import {
  BadRequestException,
  ConflictException,
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
import { UpdateTripDto } from './dto/update-trip.dto';
import {
  Seat,
  SeatStatus,
  Trip,
  TripDocument,
  TripStatus,
  TripStopInfo,
  TripStopStatus,
} from './schemas/trip.schema';
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
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly eventEmitter: EventEmitter2,
    private readonly companiesService: CompaniesService,
    private readonly vehiclesService: VehiclesService,
    private readonly locationsService: LocationsService,
    private readonly mapsService: MapsService,
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  // private extractFilterOptions(trips: PopulatedTripForFiltering[]) {
  //   const companies = new Map<string, { _id: string; name: string }>();
  //   const vehicleTypes = new Set<string>();
  //   let maxPrice = 0;

  //   trips.forEach((trip) => {
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const companyIdStr = trip.companyId._id.toString();
  //     if (trip.companyId && typeof trip.companyId === 'object') {
  //       const companyIdStr = trip.companyId._id.toString();
  //       if (!companies.has(companyIdStr)) {
  //         companies.set(companyIdStr, {
  //           _id: companyIdStr,
  //           name: trip.companyId.name,
  //         });
  //       }
  //     }
  //     vehicleTypes.add(trip.vehicleId.type);
  //     if (trip.price > maxPrice) {
  //       maxPrice = trip.price;
  //     }
  //   });

  //   return {
  //     companies: Array.from(companies.values()),
  //     vehicleTypes: Array.from(vehicleTypes),
  //     maxPrice,
  //   };
  // }

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

    const existingTrip = await this.tripModel
      .findOne({
        companyId,
        vehicleId,
        'route.fromLocationId': fromLocationId,
        'route.toLocationId': toLocationId,
        departureTime,
      })
      .exec();
    // if (existingTrip) {
    //   throw new ConflictException(
    //     'Chuyến đi tương tự đã tồn tại (cùng nhà xe, xe, tuyến đường, giờ khởi hành).',
    //   );
    // }

    const newTripData = {
      ...createTripDto,
      route: {
        ...createTripDto.route,
        stops,
        polyline: routeInfoFromMapService.polyline,
        duration: routeInfoFromMapService.duration,
        distance: routeInfoFromMapService.distance,
      },
      departureTime,
      expectedArrivalTime,
      seats,
    };

    const createdTrip = new this.tripModel(newTripData);
    return createdTrip.save();
  }

  /**
   * @description Hàm nội bộ để tạo danh sách ghế dựa trên thông tin của xe.
   * Xử lý cả trường hợp xe có sơ đồ ghế chi tiết và trường hợp chỉ có tổng số ghế.
   * @param {VehicleDocument} vehicle - Document của loại xe.
   * @returns {Seat[]} - Mảng các ghế đã được khởi tạo.
   */
  private generateSeatsFromVehicle(vehicle: VehicleDocument): Seat[] {
    const generatedSeats: Seat[] = [];

    // Xử lý tầng 1 (luôn luôn có)
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

    // Xử lý tầng 2 (nếu có)
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

    // Trường hợp dự phòng nếu xe không có sơ đồ ghế chi tiết
    if (generatedSeats.length === 0 && vehicle.totalSeats > 0) {
      for (let i = 1; i <= vehicle.totalSeats; i++) {
        generatedSeats.push({
          seatNumber: `G${i}`, // Generic seat number
          status: SeatStatus.AVAILABLE,
        });
      }
    }

    return generatedSeats;
  }

  /**
   * @description Tìm kiếm các chuyến đi cho người dùng public.
   * Chuyển đổi tên tỉnh/thành phố thành location ID và truy vấn.
   * Populate đầy đủ thông tin cần thiết cho giao diện người dùng.
   * @param {QueryTripsDto} queryTripsDto - Dữ liệu tìm kiếm.
   * @returns {Promise<any[]>} - Danh sách các chuyến đi phù hợp, đã được xử lý để hiển thị.
   */
  async findPublicTrips(queryTripsDto: QueryTripsDto): Promise<any[]> {
    const { from, to, date } = queryTripsDto;

    const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh';
    const startOfDay = dayjs.tz(date, VIETNAM_TIMEZONE).startOf('day').toDate();
    const endOfDay = dayjs.tz(date, VIETNAM_TIMEZONE).endOf('day').toDate();

    // BƯỚC 1: Lấy danh sách các chuyến đi hợp lệ, populate thông tin cần thiết
    const tripsInDay = await this.tripModel
      .find({
        departureTime: { $gte: startOfDay, $lte: endOfDay },
        status: TripStatus.SCHEDULED,
      })
      .populate<{ companyId: PopulatedPublicTrip['companyId'] }>({
        path: 'companyId',
        select: 'name logoUrl status',
      })
      .populate<{ vehicleId: PopulatedPublicTrip['vehicleId'] }>({
        path: 'vehicleId',
        select: 'type',
      })
      .populate<{ route: PopulatedPublicTrip['route'] }>({
        path: 'route.fromLocationId',
        select: 'name province',
      })
      .populate<{ route: PopulatedPublicTrip['route'] }>({
        path: 'route.toLocationId',
        select: 'name province',
      })
      .lean()
      .exec();

    const filteredTrips = (tripsInDay as PopulatedPublicTrip[]).filter(
      (trip) => {
        // Lọc an toàn, đảm bảo các trường populate không bị null
        return (
          trip.companyId?.status === CompanyStatus.ACTIVE &&
          trip.route?.fromLocationId?.province?.toLowerCase() ===
            from.toLowerCase() &&
          trip.route?.toLocationId?.province?.toLowerCase() === to.toLowerCase()
        );
      },
    );

    if (filteredTrips.length === 0) {
      return [];
    }

    const companyIds = [
      ...new Set(filteredTrips.map((trip) => trip.companyId?._id)),
    ];

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

    const finalTrips = filteredTrips.map((trip) => {
      const companyStats = reviewStatsMap.get(trip.companyId!._id.toString());
      return {
        ...trip,
        companyAvgRating: companyStats?.avgRating ?? null,
        companyReviewCount: companyStats?.reviewCount ?? 0,
        availableSeatsCount: trip.seats.filter(
          (s) => s.status === SeatStatus.AVAILABLE,
        ).length,
      };
    });

    return finalTrips;
  }
  /**
   * @description Tìm kiếm chuyến đi cho mục đích quản lý.
   * Có thể lọc theo công ty.
   * @param {string | Types.ObjectId} [companyId] - ID của công ty (tùy chọn).
   * @returns {Promise<TripDocument[]>} - Danh sách chuyến đi.
   */
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
    return this.tripModel
      .find(query)
      .populate('companyId', 'name')
      .populate('vehicleId', 'type vehicleNumber')
      .populate('route.fromLocationId', 'name province')
      .populate('route.toLocationId', 'name province')
      .sort({ departureTime: -1 })
      .exec();
  }

  /**
   * @description Tìm một chuyến đi bằng ID và populate đầy đủ thông tin.
   * @param {string | Types.ObjectId} id - ID của chuyến đi.
   * @returns {Promise<TripDocument>} - Document chi tiết của chuyến đi.
   */
  async findOne(id: string): Promise<TripDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID chuyến đi không hợp lệ.');
    }
    const trip = await this.tripModel
      .findById(id)
      .populate('companyId')
      .populate(
        'vehicleId',
        'type seatMap seatMapFloor2 floors aisleAfterColumn totalSeats description',
      )
      .populate('route.fromLocationId')
      .populate('route.toLocationId')
      .populate({ path: 'route.stops.locationId', model: 'Location' })
      .exec();
    if (!trip) {
      throw new NotFoundException(`Không tìm thấy chuyến đi với ID: ${id}`);
    }
    return trip;
  }

  /**
   * @description Cập nhật một chuyến đi.
   * @param {string} id - ID chuyến đi.
   * @param {UpdateTripDto} updateTripDto - Dữ liệu cần cập nhật.
   * @returns {Promise<TripDocument>} - Chuyến đi sau khi cập nhật.
   */
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
      }
    }

    Object.assign(existingTrip, updateTripDto);

    const updatedTrip = await existingTrip.save();
    if (!updatedTrip) {
      throw new NotFoundException(
        `Không tìm thấy chuyến đi với ID: ${id} để cập nhật.`,
      );
    }
    return updatedTrip;
  }

  /**
   * @description Cập nhật trạng thái của một điểm dừng cụ thể trong chuyến đi.
   * @param {string} tripId - ID chuyến đi.
   * @param {string} stopLocationId - ID của địa điểm dừng.
   * @param {TripStopStatus} newStatus - Trạng thái mới.
   * @returns {Promise<TripDocument>} - Chuyến đi sau khi cập nhật.
   */
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
    // TODO: Thêm logic validate, ví dụ: không thể nhảy từ 'pending' sang 'departed'.
    stopToUpdate.status = newStatus;
    return trip.save();
  }

  /**
   * @description Xóa một chuyến đi.
   * @param {string} id - ID chuyến đi cần xóa.
   * @returns {Promise<TripDocument>} - Document của chuyến đi đã bị xóa.
   */
  async remove(id: string): Promise<TripDocument> {
    const trip = await this.findOne(id);
    // TODO: Khi có Bookings, cần kiểm tra xem có booking nào đang hoạt động không.
    await trip.deleteOne();
    return trip;
  }

  /**
   * @description Cập nhật trạng thái của nhiều ghế cùng lúc.
   * Được sử dụng bởi module Bookings.
   * @param {Types.ObjectId} tripId - ID chuyến đi.
   * @param {string[]} seatNumbers - Mảng các số ghế.
   * @param {SeatStatus} newStatus - Trạng thái mới.
   * @param {Types.ObjectId} [bookingId] - ID của booking (nếu có).
   * @returns {Promise<TripDocument>} - Chuyến đi sau khi cập nhật ghế.
   */
  async updateSeatStatuses(
    tripId: Types.ObjectId,
    seatNumbers: string[],
    newStatus: SeatStatus,
    bookingId?: Types.ObjectId,
  ): Promise<TripDocument> {
    const trip = await this.tripModel.findById(tripId).exec();
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
    return trip.save();
  }

  async cancel(tripId: string): Promise<TripDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const trip = await this.tripModel.findById(tripId).session(session);
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

      await trip.save({ session });
      await session.commitTransaction();

      return trip;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async findPopularRoutes(limit = 6): Promise<any> {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    return this.bookingModel.aggregate([
      // 1. Lọc booking
      {
        $match: {
          status: BookingStatus.CONFIRMED,
          createdAt: { $gte: ninetyDaysAgo },
        },
      },

      // 2. Chuyển đổi tripId
      { $addFields: { tripObjectId: { $toObjectId: '$tripId' } } },

      // 3. Join với trips
      {
        $lookup: {
          from: 'trips',
          localField: 'tripObjectId',
          foreignField: '_id',
          as: 'tripInfo',
        },
      },

      // 4. Deconstruct tripInfo (nếu tripInfo rỗng, document sẽ bị loại bỏ ở đây)
      { $unwind: '$tripInfo' },

      // 5. [BƯỚC MỚI] Chuyển đổi fromLocationId và toLocationId từ String sang ObjectId
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

      // 6. Nhóm theo các ObjectId mới để đếm
      {
        $group: {
          _id: {
            from: '$tripInfo.route.fromLocationObjectId', // <-- Dùng trường mới
            to: '$tripInfo.route.toLocationObjectId', // <-- Dùng trường mới
          },
          bookingCount: { $sum: 1 },
        },
      },

      // 7. Sắp xếp và giới hạn
      { $sort: { bookingCount: -1 } },
      { $limit: limit },

      // 8. Join với 'locations' (Bây giờ sẽ hoạt động chính xác)
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

      // 9. Deconstruct
      { $unwind: '$fromLocation' },
      { $unwind: '$toLocation' },

      // 10. Định hình output
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
  /**
   * @description Kích hoạt hoặc vô hiệu hóa một mẫu chuyến đi lặp lại.
   * Chỉ áp dụng cho các chuyến đi có isRecurrenceTemplate = true.
   * @param {string | Types.ObjectId} tripId - ID của chuyến đi mẫu.
   * @param {boolean} isActive - Trạng thái kích hoạt mới.
   * @returns {Promise<TripDocument>} - Chuyến đi mẫu sau khi cập nhật.
   */
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
    return tripTemplate.save();
  }
}
