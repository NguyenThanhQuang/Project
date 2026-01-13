import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Connection, Model, Types } from 'mongoose';
import { CompanyStatus } from 'src/companies/schemas/company.schema';
import { Review, ReviewDocument } from 'src/reviews/schemas/review.schema';
import { UserRole } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from '../bookings/schemas/booking.schema';
import { CompaniesService } from '../companies/companies.service';
import { LocationsService } from '../locations/locations.service';
import { MapsService } from '../maps/maps.service';
import {
  VehicleDocument,
  VehicleStatus,
} from '../vehicles/schemas/vehicle.schema';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { QueryTripsDto } from './dto/query-trips.dto';
import { UpdateTripDriverDto } from './dto/update-trip-driver.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import {
  Seat,
  SeatStatus,
  TripDocument,
  TripStatus,
  TripStopInfo,
  TripStopStatus,
} from './schemas/trip.schema';
import { TripsRepository } from './trips.repository';

dayjs.extend(utc);
dayjs.extend(timezone);

interface PopulatedPublicTrip {
  seats: Seat[];
  _id: Types.ObjectId;
  companyId?: {
    _id: Types.ObjectId;
    name: string;
    logoUrl?: string;
    status: CompanyStatus;
  } | null;
  vehicleId?: {
    _id: Types.ObjectId;
    type: string;
  } | null;
  route: {
    fromLocationId?: {
      _id: Types.ObjectId;
      name: string;
      province: string;
    } | null;
    toLocationId?: {
      _id: Types.ObjectId;
      name: string;
      province: string;
    } | null;
  };
  departureTime: Date;
  price: number;
}

@Injectable()
export class TripsService {
  constructor(
    private readonly tripsRepository: TripsRepository,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly eventEmitter: EventEmitter2,
    private readonly companiesService: CompaniesService,
    private readonly vehiclesService: VehiclesService,
    private readonly locationsService: LocationsService,
    private readonly mapsService: MapsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  private generateSeatsFromVehicle(vehicle: VehicleDocument): Seat[] {
    const generatedSeats: Seat[] = [];

    // Xử lý tầng 1
    if (vehicle.seatMap && vehicle.seatMap.layout) {
      vehicle.seatMap.layout.forEach((row) => {
        if (Array.isArray(row)) {
          row.forEach((seatElement) => {
            if (seatElement !== null && seatElement !== undefined) {
              generatedSeats.push({
                seatNumber: String(seatElement),
                status: SeatStatus.AVAILABLE,
              });
            }
          });
        }
      });
    }

    // Xử lý tầng 2
    if (
      vehicle.floors > 1 &&
      vehicle.seatMapFloor2 &&
      vehicle.seatMapFloor2.layout
    ) {
      vehicle.seatMapFloor2.layout.forEach((row) => {
        if (Array.isArray(row)) {
          row.forEach((seatElement) => {
            if (seatElement !== null && seatElement !== undefined) {
              generatedSeats.push({
                seatNumber: String(seatElement),
                status: SeatStatus.AVAILABLE,
              });
            }
          });
        }
      });
    }

    // Fallback nếu không có seatMap
    if (generatedSeats.length === 0 && vehicle.totalSeats > 0) {
      for (let i = 1; i <= vehicle.totalSeats; i++) {
        generatedSeats.push({
          seatNumber: `G${i}`,
          status: SeatStatus.AVAILABLE,
        });
      }
    }

    return generatedSeats;
  }

  async create(createTripDto: CreateTripDto): Promise<TripDocument> {
    const { companyId, vehicleId, route } = createTripDto;
    const { fromLocationId, toLocationId, stops: stopDtos } = route;

    const stopLocationIds = (stopDtos || []).map((s) => s.locationId);
    const allLocationIds = [fromLocationId, toLocationId, ...stopLocationIds];

    const [company, vehicle, ...locations] = await Promise.all([
      this.companiesService.findOne(companyId),
      this.vehiclesService.findOne(vehicleId),
      ...allLocationIds.map((id) => this.locationsService.findOne(id)),
    ]).catch((err) => {
      throw new BadRequestException(
        `Dữ liệu không hợp lệ: ${
          err &&
          typeof err === 'object' &&
          err !== null &&
          'message' in err &&
          typeof (err as { message?: unknown }).message === 'string'
            ? (err as { message: string }).message
            : String(err)
        }`,
      );
    });

    if (vehicle.status !== VehicleStatus.ACTIVE) {
      throw new BadRequestException(
        `Không thể tạo chuyến đi. Xe "${vehicle.vehicleNumber}" đang ở trạng thái "${vehicle.status}".`,
      );
    }

    if (company.status !== CompanyStatus.ACTIVE) {
      throw new BadRequestException(
        `Không thể tạo chuyến đi cho nhà xe đang ở trạng thái "${company.status}".`,
      );
    }
    if (vehicle.companyId._id.toString() !== company._id.toString()) {
      throw new BadRequestException(
        'Loại xe không thuộc nhà xe được chỉ định.',
      );
    }

    const coordinates = locations.map((loc) => loc.location.coordinates);
    const routeInfoFromMapService =
      await this.mapsService.getRouteInfo(coordinates);

    const departureTime = new Date(createTripDto.departureTime);
    const expectedArrivalTime = new Date(createTripDto.expectedArrivalTime);

    if (departureTime >= expectedArrivalTime) {
      throw new BadRequestException(
        'Thời gian khởi hành phải trước thời gian dự kiến đến.',
      );
    }

    const seats: Seat[] = this.generateSeatsFromVehicle(vehicle);

    const stops: TripStopInfo[] = (stopDtos || []).map((dto) => ({
      locationId: new Types.ObjectId(dto.locationId),
      expectedArrivalTime: dayjs(dto.expectedArrivalTime).toDate(),
      expectedDepartureTime: dto.expectedDepartureTime
        ? dayjs(dto.expectedDepartureTime).toDate()
        : undefined,
      status: TripStopStatus.PENDING,
    }));

    const existingTrip = await this.tripsRepository.findOne({
      companyId,
      vehicleId,
      'route.fromLocationId': fromLocationId,
      'route.toLocationId': toLocationId,
      departureTime,
    });
    // if (existingTrip) {
    //   throw new ConflictException(
    //     'Chuyến đi tương tự đã tồn tại (cùng nhà xe, xe, tuyến đường, giờ khởi hành).',
    //   );
    // }

    const newTripData = {
      ...createTripDto,
      companyId: new Types.ObjectId(createTripDto.companyId),
      vehicleId: new Types.ObjectId(createTripDto.vehicleId),
      route: {
        ...createTripDto.route,
        fromLocationId: new Types.ObjectId(createTripDto.route.fromLocationId),
        toLocationId: new Types.ObjectId(createTripDto.route.toLocationId),
        stops,
        polyline: routeInfoFromMapService.polyline,
        duration: routeInfoFromMapService.duration,
        distance: routeInfoFromMapService.distance,
      },
      departureTime,
      expectedArrivalTime,
      seats,
    };

    return this.tripsRepository.create(newTripData);
  }

  async findPublicTrips(queryTripsDto: QueryTripsDto): Promise<any[]> {
    const { from, to, date } = queryTripsDto;
    const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh';
    const startOfDay = dayjs.tz(date, VIETNAM_TIMEZONE).startOf('day').toDate();
    const endOfDay = dayjs.tz(date, VIETNAM_TIMEZONE).endOf('day').toDate();

    const tripsRaw = await this.tripsRepository.findPublicTripsByCondition(
      startOfDay,
      endOfDay,
      from,
      to,
    );

    if (tripsRaw.length === 0) {
      return [];
    }

    const companyIds = [...new Set(tripsRaw.map((t) => t.company._id))];
    const reviewStats = await this.reviewModel.aggregate([
      { $match: { companyId: { $in: companyIds } } },
      {
        $group: {
          _id: '$companyId',
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const reviewStatsMap = new Map<
      string,
      { avgRating: number; reviewCount: number }
    >();
    reviewStats.forEach((stat) => {
      reviewStatsMap.set(stat._id.toString(), {
        avgRating: stat.avgRating,
        reviewCount: stat.reviewCount,
      });
    });

    return tripsRaw.map((trip) => {
      const companyStats = reviewStatsMap.get(trip.company._id.toString());

      const availableSeatsCount = trip.seats.filter(
        (s: any) => s.status === 'available',
      ).length;

      return {
        ...trip,
        companyAvgRating: companyStats?.avgRating ?? 0,
        companyReviewCount: companyStats?.reviewCount ?? 0,
        availableSeatsCount: availableSeatsCount,
        seats: undefined,
      };
    });
  }

  async findForManagement(
    companyId?: string | Types.ObjectId,
  ): Promise<TripDocument[]> {
    const query: Record<string, unknown> = {};
    if (companyId) {
      if (!Types.ObjectId.isValid(companyId)) {
        return [];
      }
      query.companyId = new Types.ObjectId(companyId);
    }
    return this.tripsRepository.findManagementTrips(query);
  }

  async findOne(id: string): Promise<TripDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID chuyến đi không hợp lệ.');
    }
    const trip = await this.tripsRepository.findByIdWithDetails(id);
    if (!trip) {
      throw new NotFoundException(`Không tìm thấy chuyến đi với ID: ${id}`);
    }
    return trip;
  }

  async update(
    id: string,
    updateTripDto: UpdateTripDto,
  ): Promise<TripDocument> {
    const existingTrip = await this.findOne(id);

    const hasActiveBookings = existingTrip.seats.some(
      (seat) =>
        seat.status === SeatStatus.BOOKED || seat.status === SeatStatus.HELD,
    );

    if (hasActiveBookings) {
      if (
        updateTripDto.vehicleId &&
        updateTripDto.vehicleId.toString() !==
          existingTrip.vehicleId._id.toString()
      ) {
        throw new ConflictException(
          'Không thể đổi xe cho chuyến đi đã có người đặt vé.',
        );
      }

      const hasCoreInfoChange =
        updateTripDto.route ||
        updateTripDto.departureTime ||
        updateTripDto.price !== undefined;

      if (hasCoreInfoChange) {
        throw new ConflictException(
          'Không thể thay đổi thông tin cốt lõi (tuyến đường, thời gian, giá vé) của chuyến đi đã có người đặt vé.',
        );
      }
    } else {
      if (
        updateTripDto.vehicleId &&
        updateTripDto.vehicleId.toString() !==
          existingTrip.vehicleId._id.toString()
      ) {
        const newVehicle = await this.vehiclesService.findOne(
          updateTripDto.vehicleId,
        );
        const newSeats = this.generateSeatsFromVehicle(newVehicle);
        existingTrip.seats = newSeats;
        existingTrip.vehicleId = newVehicle._id;
      }
    }

    if (updateTripDto.price !== undefined)
      existingTrip.price = updateTripDto.price;
    if (updateTripDto.status) existingTrip.status = updateTripDto.status;
    if (updateTripDto.departureTime)
      existingTrip.departureTime = new Date(updateTripDto.departureTime);
    if (updateTripDto.expectedArrivalTime)
      existingTrip.expectedArrivalTime = new Date(
        updateTripDto.expectedArrivalTime,
      );
    if (updateTripDto.isRecurrenceTemplate !== undefined)
      existingTrip.isRecurrenceTemplate = updateTripDto.isRecurrenceTemplate;

    if (updateTripDto.companyId) {
      existingTrip.companyId = new Types.ObjectId(updateTripDto.companyId);
    }

    if (updateTripDto.route) {
      const { fromLocationId, toLocationId, stops } = updateTripDto.route;

      if (fromLocationId) {
        existingTrip.route.fromLocationId = new Types.ObjectId(fromLocationId);
      }
      if (toLocationId) {
        existingTrip.route.toLocationId = new Types.ObjectId(toLocationId);
      }
    }

    const updatedTrip = await this.tripsRepository.save(existingTrip);

    if (!updatedTrip) {
      throw new NotFoundException(
        `Không tìm thấy chuyến đi với ID: ${id} để cập nhật.`,
      );
    }
    return updatedTrip;
  }

  async updateTripStopStatus(
    tripId: string,
    stopLocationId: string,
    newStatus: TripStopStatus,
  ): Promise<TripDocument> {
    const trip = await this.findOne(tripId);
    const stopToUpdate = trip.route.stops.find(
      (s) => s.locationId._id.toString() === stopLocationId,
    );
    if (!stopToUpdate) {
      throw new NotFoundException(
        `Không tìm thấy điểm dừng với ID ${stopLocationId} trong chuyến đi này.`,
      );
    }
    stopToUpdate.status = newStatus;
    return this.tripsRepository.save(trip);
  }

  async remove(id: string): Promise<TripDocument> {
    const trip = await this.findOne(id);
    await trip.deleteOne();
    return trip;
  }

  async updateSeatStatuses(
    tripId: Types.ObjectId,
    seatNumbers: string[],
    newStatus: SeatStatus,
    bookingId?: Types.ObjectId,
  ): Promise<TripDocument> {
    const trip = await this.tripsRepository.findById(tripId);
    if (!trip) {
      throw new NotFoundException(
        `Không tìm thấy chuyến đi với ID: ${tripId.toString()} để cập nhật ghế.`,
      );
    }
    for (const seatNumber of seatNumbers) {
      const seat = trip.seats.find((s) => s.seatNumber === seatNumber);
      if (!seat) {
        throw new BadRequestException(
          `Ghế ${seatNumber} không tồn tại trong chuyến đi.`,
        );
      }
      if (
        newStatus === SeatStatus.HELD &&
        seat.status !== SeatStatus.AVAILABLE
      ) {
        throw new ConflictException(
          `Ghế ${seatNumber} không có sẵn để giữ chỗ.`,
        );
      }
      seat.status = newStatus;
      seat.bookingId =
        newStatus === SeatStatus.AVAILABLE ? undefined : bookingId;
    }
    return this.tripsRepository.save(trip);
  }

  async cancel(tripId: string): Promise<TripDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const trip = await this.tripsRepository.findById(tripId, session);
      if (!trip) {
        throw new NotFoundException(
          `Không tìm thấy chuyến đi với ID: ${tripId}`,
        );
      }
      if (trip.status === TripStatus.CANCELLED) {
        throw new BadRequestException('Chuyến đi này đã được hủy trước đó.');
      }
      if (trip.status === TripStatus.ARRIVED) {
        throw new BadRequestException('Không thể hủy chuyến đi đã hoàn thành.');
      }

      const bookingsToCancel = await this.bookingModel
        .find({
          tripId: trip._id,
          status: BookingStatus.CONFIRMED,
        })
        .session(session);

      trip.status = TripStatus.CANCELLED;
      trip.seats.forEach((seat) => {
        seat.status = SeatStatus.AVAILABLE;
        seat.bookingId = undefined;
      });

      for (const booking of bookingsToCancel) {
        booking.status = BookingStatus.CANCELLED;
        await booking.save({ session });
        this.eventEmitter.emit('booking.cancelled', booking.toObject());
      }

      await this.tripsRepository.save(trip, session);
      await session.commitTransaction();

      return trip;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async findPopularRoutes(limit = 5): Promise<any> {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    return this.bookingModel.aggregate([
      {
        $match: {
          status: BookingStatus.CONFIRMED,
          createdAt: { $gte: ninetyDaysAgo },
        },
      },
      { $addFields: { tripObjectId: { $toObjectId: '$tripId' } } },
      {
        $lookup: {
          from: 'trips',
          localField: 'tripObjectId',
          foreignField: '_id',
          as: 'tripInfo',
        },
      },
      { $unwind: '$tripInfo' },
      {
        $addFields: {
          'tripInfo.route.fromLocationObjectId': {
            $toObjectId: '$tripInfo.route.fromLocationId',
          },
          'tripInfo.route.toLocationObjectId': {
            $toObjectId: '$tripInfo.route.toLocationId',
          },
        },
      },
      {
        $group: {
          _id: {
            from: '$tripInfo.route.fromLocationObjectId',
            to: '$tripInfo.route.toLocationObjectId',
          },
          bookingCount: { $sum: 1 },
        },
      },
      { $sort: { bookingCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'locations',
          localField: '_id.from',
          foreignField: '_id',
          as: 'fromLocation',
        },
      },
      {
        $lookup: {
          from: 'locations',
          localField: '_id.to',
          foreignField: '_id',
          as: 'toLocation',
        },
      },
      { $unwind: '$fromLocation' },
      { $unwind: '$toLocation' },
      {
        $project: {
          _id: 0,
          fromLocation: '$fromLocation',
          toLocation: '$toLocation',
          bookingCount: 1,
        },
      },
    ]);
  }

  async toggleRecurrence(
    tripId: string | Types.ObjectId,
    isActive: boolean,
  ): Promise<TripDocument> {
    const tripTemplate = await this.findOne(tripId.toString());

    if (!tripTemplate.isRecurrenceTemplate) {
      throw new BadRequestException(
        'Chức năng này chỉ áp dụng cho các chuyến đi mẫu.',
      );
    }

    tripTemplate.isRecurrenceActive = isActive;
    return this.tripsRepository.save(tripTemplate);
  }

  async assignDriver(tripId: string, driverId: string): Promise<TripDocument> {
    // 1. Lấy chuyến đi
    const trip = await this.tripsRepository.findById(tripId);
    if (!trip) {
      throw new NotFoundException('Không tìm thấy chuyến đi.');
    }

    if (
      trip.status === TripStatus.CANCELLED ||
      trip.status === TripStatus.ARRIVED
    ) {
      throw new BadRequestException(
        'Không thể gán tài xế cho chuyến đã hủy hoặc đã hoàn thành.',
      );
    }

    // 2. Lấy tài xế và kiểm tra
    const driver = await this.usersService.findById(driverId);
    if (!driver) {
      throw new NotFoundException('Không tìm thấy tài xế.');
    }

    // Validate 1: Driver role
    if (!driver.roles.includes(UserRole.DRIVER)) {
      throw new BadRequestException(
        'Người dùng được gán không phải là tài xế.',
      );
    }

    // Validate 2: Driver Company
    if (
      !driver.companyId ||
      driver.companyId.toString() !== trip.companyId.toString()
    ) {
      throw new ConflictException(
        'Tài xế không thuộc về nhà xe của chuyến đi này.',
      );
    }

    // Validate 3: Driver Active
    if (driver.isBanned) {
      throw new ConflictException('Tài xế này hiện đang bị khóa.');
    }

    // 3. Gán và lưu
    trip.driverId = driver._id;
    return this.tripsRepository.save(trip);
  }

  /**
   * [DRIVER] Lấy danh sách chuyến đi
   */
  async getDriverTrips(driverId: string): Promise<TripDocument[]> {
    return this.tripsRepository.findUpcomingTripsByDriver(driverId);
  }

  /**
   * [DRIVER] Xem Manifest (Lệnh vận chuyển/Danh sách khách)
   */
  async getDriverManifest(tripId: string, driverId: string) {
    // 1. Lấy thông tin chuyến đi chi tiết
    const trip = await this.tripsRepository.findTripForManifest(tripId);

    if (!trip) {
      throw new NotFoundException('Không tìm thấy chuyến đi.');
    }

    // 2. [GUARD] Kiểm tra quyền: Phải là tài xế của chuyến này
    if (!trip.driverId || trip.driverId.toString() !== driverId) {
      throw new ForbiddenException(
        'Bạn không được phân công cho chuyến đi này.',
      );
    }

    // 3. Lấy danh sách Booking đã CONFIRMED của chuyến này
    const bookings = await this.bookingModel
      .find({
        tripId: trip._id,
        status: BookingStatus.CONFIRMED,
      })
      .lean()
      .exec();

    // 4. Flatten cấu trúc: Biến Booking thành danh sách Passengers hiển thị phẳng
    const passengerList = bookings.flatMap((booking: BookingDocument) => {
      // Vì Booking schema lưu 1 array passengers, ta cần tách lẻ từng người để tài xế dễ kiểm soát
      return booking.passengers.map((passenger) => ({
        bookingCode: booking.ticketCode, // Mã vé
        seatNumber: passenger.seatNumber, // Số ghế
        name: passenger.name, // Tên hành khách
        phone: passenger.phone, // SĐT hành khách

        price: passenger.price,

        isCheckedIn: booking.isCheckedIn,
        note: `Đơn hàng: ${booking.contactPhone}`,
      }));
    });

    passengerList.sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));

    const summary = {
      totalSeats: trip.seats.length,
      bookedCount: passengerList.length,
      checkedInCount: bookings.filter((b) => b.isCheckedIn).length,
    };

    return {
      tripInfo: {
        _id: trip._id,
        vehicleNumber: (trip.vehicleId as any)?.vehicleNumber,
        departureTime: trip.departureTime,
        status: trip.status,
      },
      route: {
        from: (trip.route.fromLocationId as any)?.name,
        to: (trip.route.toLocationId as any)?.name,
        stops: trip.route.stops.map((stop) => ({
          name: (stop.locationId as any)?.name,
          fullAddress: (stop.locationId as any)?.fullAddress,
          arrivalTime: stop.expectedArrivalTime,
          status: stop.status,
        })),
      },
      summary,
      passengers: passengerList,
    };
  }
  /**
   * [DRIVER] Cập nhật trạng thái hành trình (Chính hoặc Điểm dừng)
   */
  async updateDriverStatus(
    tripId: string,
    driverId: string,
    dto: UpdateTripDriverDto,
  ): Promise<TripDocument> {
    const trip = await this.findOne(tripId);

    // 1. Kiểm tra quyền Tài xế
    if (!trip.driverId || trip.driverId.toString() !== driverId) {
      throw new ForbiddenException(
        'Bạn không được phân công cho chuyến đi này.',
      );
    }

    // 2. Cập nhật Trạng thái Chuyến đi (Main Status)
    if (dto.status) {
      if (
        (trip.status === TripStatus.SCHEDULED &&
          dto.status !== TripStatus.DEPARTED) ||
        (trip.status === TripStatus.DEPARTED &&
          dto.status !== TripStatus.ARRIVED) ||
        trip.status === TripStatus.ARRIVED || // Đã kết thúc thì không cập nhật lại
        trip.status === TripStatus.CANCELLED
      ) {
        throw new BadRequestException(
          `Không thể chuyển trạng thái từ "${trip.status}" sang "${dto.status}".`,
        );
      }
      trip.status = dto.status;
    }

    // 3. Cập nhật Trạng thái Điểm dừng (Stops)
    if (dto.stopLocationId && dto.stopStatus) {
      const stop = trip.route.stops.find(
        (s) => s.locationId.toString() === dto.stopLocationId,
      );
      if (!stop) {
        throw new NotFoundException(
          'Không tìm thấy điểm dừng này trong lộ trình.',
        );
      }
      stop.status = dto.stopStatus;

      // Logic phụ (Optional): Nếu đã đến điểm cuối cùng -> Auto set Trip Status = ARRIVED
      const isLastStop =
        trip.route.stops[trip.route.stops.length - 1].locationId.toString() ===
        dto.stopLocationId;

      if (isLastStop && dto.stopStatus === TripStopStatus.ARRIVED) {
        trip.status = TripStatus.ARRIVED;
      }
    }

    return this.tripsRepository.save(trip);
  }
}
