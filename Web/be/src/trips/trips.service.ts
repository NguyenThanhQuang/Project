/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { FilterQuery, Model, Types } from 'mongoose';
import { CompanyStatus } from 'src/companies/schemas/company.schema';
import { CompaniesService } from '../companies/companies.service';
import { LocationsService } from '../locations/locations.service';
import { MapsService } from '../maps/maps.service';
import { VehicleDocument } from '../vehicles/schemas/vehicle.schema';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { QueryTripsDto } from './dto/query-trips.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import {
  PopulatedTripForFiltering,
  Seat,
  SeatStatus,
  Trip,
  TripDocument,
  TripStopInfo,
  TripStopStatus,
} from './schemas/trip.schema';
dayjs.extend(utc);
@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    private readonly companiesService: CompaniesService,
    private readonly vehiclesService: VehiclesService,
    private readonly locationsService: LocationsService,
    private readonly mapsService: MapsService,
  ) {}

  private extractFilterOptions(trips: PopulatedTripForFiltering[]) {
    const companies = new Map<string, { _id: string; name: string }>();
    const vehicleTypes = new Set<string>();
    let maxPrice = 0;

    trips.forEach((trip) => {
      const companyIdStr = trip.companyId._id.toString();
      if (trip.companyId && typeof trip.companyId === 'object') {
        const companyIdStr = trip.companyId._id.toString();
        if (!companies.has(companyIdStr)) {
          companies.set(companyIdStr, {
            _id: companyIdStr,
            name: trip.companyId.name,
          });
        }
      }
      vehicleTypes.add(trip.vehicleId.type);
      if (trip.price > maxPrice) {
        maxPrice = trip.price;
      }
    });

    return {
      companies: Array.from(companies.values()),
      vehicleTypes: Array.from(vehicleTypes),
      maxPrice,
    };
  }
  /**
   * @description Tạo một chuyến đi mới.
   * 1. Validate sự tồn tại của các tài nguyên liên quan (công ty, xe, địa điểm).
   * 2. Gọi MapsService để lấy polyline cho tuyến đường.
   * 3. Khởi tạo danh sách ghế từ thông tin xe.
   * 4. Kiểm tra logic nghiệp vụ (thời gian, xe thuộc công ty...).
   * 5. Kiểm tra sự trùng lặp của chuyến đi.
   * 6. Lưu chuyến đi mới vào cơ sở dữ liệu.
   * @param {CreateTripDto} createTripDto - Dữ liệu đầu vào để tạo chuyến đi.
   * @returns {Promise<TripDocument>} - Chuyến đi vừa được tạo.
   */
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

    // Lấy tọa độ từ các địa điểm đã được validate để tạo polyline
    const coordinates = locations.map((loc) => loc.location.coordinates);
    const polyline = await this.mapsService.getRoutePolyline(coordinates);

    // Validate thời gian
    const departureTime = new Date(createTripDto.departureTime);
    const expectedArrivalTime = new Date(createTripDto.expectedArrivalTime);
    if (departureTime >= expectedArrivalTime) {
      throw new BadRequestException(
        'Thời gian khởi hành phải trước thời gian dự kiến đến.',
      );
    }

    // Khởi tạo danh sách ghế từ thông tin xe
    const seats: Seat[] = this.generateSeatsFromVehicle(vehicle);

    // Xử lý thông tin các điểm dừng
    const stops: TripStopInfo[] = (stopDtos || []).map((dto) => ({
      locationId: new Types.ObjectId(dto.locationId),
      expectedArrivalTime: new Date(dto.expectedArrivalTime),
      expectedDepartureTime: dto.expectedDepartureTime
        ? new Date(dto.expectedDepartureTime)
        : undefined,
      status: TripStopStatus.PENDING,
    }));

    // Kiểm tra xem chuyến đi tương tự đã tồn tại chưa
    const existingTrip = await this.tripModel
      .findOne({
        companyId,
        vehicleId,
        'route.fromLocationId': fromLocationId,
        'route.toLocationId': toLocationId,
        departureTime,
      })
      .exec();
    if (existingTrip) {
      throw new ConflictException(
        'Chuyến đi tương tự đã tồn tại (cùng nhà xe, xe, tuyến đường, giờ khởi hành).',
      );
    }

    // Tạo object dữ liệu cuối cùng để lưu
    const newTripData = {
      ...createTripDto,
      route: { ...createTripDto.route, stops, polyline },
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
    if (
      !vehicle.seatMap ||
      !vehicle.seatMap.layout ||
      !Array.isArray(vehicle.seatMap.layout) ||
      vehicle.seatMap.layout.length === 0
    ) {
      // Nếu không có sơ đồ, tạo ghế dựa trên tổng số ghế
      for (let i = 1; i <= vehicle.totalSeats; i++) {
        generatedSeats.push({
          seatNumber: `G${i}`,
          status: SeatStatus.AVAILABLE,
        });
      }
      return generatedSeats;
    }
    // Nếu có sơ đồ, tạo ghế dựa trên sơ đồ
    const { layout } = vehicle.seatMap;
    (layout as Array<Array<string | null | number>>).forEach((row) => {
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
    return generatedSeats;
  }

  /**
   * @description Tìm kiếm các chuyến đi cho người dùng public.
   * Chuyển đổi tên tỉnh/thành phố thành location ID và truy vấn.
   * Populate đầy đủ thông tin cần thiết cho giao diện người dùng.
   * @param {QueryTripsDto} queryTripsDto - Dữ liệu tìm kiếm.
   * @returns {Promise<any[]>} - Danh sách các chuyến đi phù hợp, đã được xử lý để hiển thị.
   */
  async findPublicTrips(
    queryTripsDto: QueryTripsDto,
  ): Promise<{ trips: any[]; filters: any }> {
    const { from, to, passengers = 1 } = queryTripsDto;

    const [fromLocations, toLocations] = await Promise.all([
      this.locationsService.findAll({ province: new RegExp(from, 'i') }),
      this.locationsService.findAll({ province: new RegExp(to, 'i') }),
    ]);

    if (fromLocations.length === 0 || toLocations.length === 0) {
      return {
        trips: [],
        filters: { companies: [], vehicleTypes: [], maxPrice: 0 },
      };
    }

    const fromLocationIds = fromLocations.map((loc) => loc._id);
    const toLocationIds = toLocations.map((loc) => loc._id);

    const query: FilterQuery<Trip> = {
      'route.fromLocationId': { $in: fromLocationIds },
      'route.toLocationId': { $in: toLocationIds },
    };

    const allTripsFromDb = (await this.tripModel.aggregate([
      { $match: query },

      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'companyDetails',
        },
      },
      { $unwind: '$companyDetails' },

      {
        $match: {
          'companyDetails.status': CompanyStatus.ACTIVE,
        },
      },

      {
        $lookup: {
          from: 'vehicles',
          localField: 'vehicleId',
          foreignField: '_id',
          as: 'vehicleDetails',
        },
      },
      { $unwind: '$vehicleDetails' },
      {
        $lookup: {
          from: 'locations',
          localField: 'route.fromLocationId',
          foreignField: '_id',
          as: 'fromLocationDetails',
        },
      },
      { $unwind: '$fromLocationDetails' },
      {
        $lookup: {
          from: 'locations',
          localField: 'route.toLocationId',
          foreignField: '_id',
          as: 'toLocationDetails',
        },
      },
      { $unwind: '$toLocationDetails' },

      {
        $project: {
          _id: 1,
          departureTime: 1,
          expectedArrivalTime: 1,
          price: 1,
          seats: 1,
          companyId: {
            _id: '$companyDetails._id',
            name: '$companyDetails.name',
            logoUrl: '$companyDetails.logoUrl',
          },
          vehicleId: {
            _id: '$vehicleDetails._id',
            type: '$vehicleDetails.type',
          },
          route: {
            fromLocationId: '$fromLocationDetails',
            toLocationId: '$toLocationDetails',
          },
        },
      },
    ])) as unknown as PopulatedTripForFiltering[];

    const filters = this.extractFilterOptions(allTripsFromDb);

    return {
      trips: allTripsFromDb,
      filters,
    };
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
      query.companyId = companyId;
    }
    return this.tripModel
      .find(query)
      .populate('companyId', 'name')
      .populate('vehicleId', 'type')
      .populate('route.fromLocationId', 'name')
      .populate('route.toLocationId', 'name')
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
    // const existingTrip = await this.findOne(id);
    // TODO: Thêm logic phức tạp nếu cần, ví dụ: nếu thay đổi xe thì phải tạo lại ghế...
    // Hiện tại, chỉ cập nhật các trường được cung cấp.
    const updatedTrip = await this.tripModel
      .findByIdAndUpdate(id, { $set: updateTripDto }, { new: true })
      .exec();
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

  /**
   * @description [DEV ONLY] Xóa tất cả chuyến đi.
   * @returns {Promise<any>} - Kết quả từ operation của MongoDB.
   */
  async deleteAll(): Promise<any> {
    return this.tripModel.deleteMany({}).exec();
  }
}
