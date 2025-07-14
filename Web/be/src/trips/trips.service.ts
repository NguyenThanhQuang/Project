import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CompaniesService } from '../companies/companies.service';
import { LocationsService } from '../locations/locations.service';
import { MapsService } from '../maps/maps.service';
import { VehicleDocument } from '../vehicles/schemas/vehicle.schema';
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

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    private readonly companiesService: CompaniesService,
    private readonly vehiclesService: VehiclesService,
    private readonly locationsService: LocationsService,
    private readonly mapsService: MapsService,
  ) {}

  /**
   * @description Tạo một chuyến đi mới.
   * Hàm này thực hiện nhiều bước:
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

    // Gom tất cả ID địa điểm lại để validate một lần
    const stopLocationIds = (stopDtos || []).map((s) => s.locationId);
    const allLocationIds = [fromLocationId, toLocationId, ...stopLocationIds];

    // Sử dụng Promise.all để kiểm tra sự tồn tại của các tài nguyên song song, tăng hiệu năng.
    const [company, vehicle, ...locations] = await Promise.all([
      this.companiesService.findOne(companyId),
      this.vehiclesService.findOne(vehicleId),
      ...allLocationIds.map((id) => this.locationsService.findOne(id)),
    ]).catch((err) => {
      // Nếu bất kỳ một ID nào không hợp lệ, ném lỗi ngay lập tức.
      throw new BadRequestException(`Dữ liệu không hợp lệ: ${err.message}`);
    });

    // Kiểm tra logic nghiệp vụ: Xe phải thuộc về công ty.
    if (vehicle.companyId.toString() !== company._id.toString()) {
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
  async findPublicTrips(queryTripsDto: QueryTripsDto): Promise<any[]> {
    const { from, to, date } = queryTripsDto;

    // Tìm các địa điểm thuộc tỉnh/thành phố `from` và `to`.
    const [fromLocations, toLocations] = await Promise.all([
      this.locationsService.findAll({ province: new RegExp(`^${from}$`, 'i') }),
      this.locationsService.findAll({ province: new RegExp(`^${to}$`, 'i') }),
    ]);

    if (fromLocations.length === 0 || toLocations.length === 0) {
      return []; // Không có chuyến đi nếu không tìm thấy địa điểm.
    }

    const fromLocationIds = fromLocations.map((loc) => loc._id);
    const toLocationIds = toLocations.map((loc) => loc._id);

    // Validate ngày tìm kiếm
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    if (startDate < today) {
      throw new BadRequestException(
        'Không thể tìm kiếm các chuyến đi trong quá khứ.',
      );
    }
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Xây dựng câu truy vấn
    const query: any = {
      'route.fromLocationId': { $in: fromLocationIds },
      'route.toLocationId': { $in: toLocationIds },
      status: TripStatus.SCHEDULED, // Chỉ tìm các chuyến đi sắp diễn ra
      departureTime: { $gte: startDate, $lte: endDate },
    };

    const trips = await this.tripModel
      .find(query)
      .select('-seats.bookingId -__v') // Ẩn các trường không cần thiết
      .populate('companyId', 'name code logoUrl')
      .populate('vehicleId', 'type')
      .populate('route.fromLocationId', 'name fullAddress province')
      .populate('route.toLocationId', 'name fullAddress province')
      .sort({ departureTime: 1 }) // Sắp xếp theo giờ khởi hành sớm nhất
      .lean() // Tăng tốc độ truy vấn bằng cách trả về plain object
      .exec();

    // Xử lý kết quả trả về: thêm số ghế trống
    return trips.map((trip) => {
      const availableSeatsCount = trip.seats.filter(
        (s) => s.status === SeatStatus.AVAILABLE,
      ).length;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { seats, ...restOfTrip } = trip;
      return { ...restOfTrip, availableSeatsCount };
    });
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
    const query: any = {};
    if (companyId) {
      query.companyId = companyId;
    }
    return this.tripModel
      .find(query)
      .populate('companyId', 'name')
      .populate('vehicleId', 'type')
      .populate('route.fromLocationId', 'name')
      .populate('route.toLocationId', 'name')
      .sort({ departureTime: -1 }) // Sắp xếp theo ngày mới nhất
      .exec();
  }

  /**
   * @description Tìm một chuyến đi bằng ID và populate đầy đủ thông tin.
   * @param {string | Types.ObjectId} id - ID của chuyến đi.
   * @returns {Promise<TripDocument>} - Document chi tiết của chuyến đi.
   */
  async findOne(id: string | Types.ObjectId): Promise<TripDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID chuyến đi không hợp lệ.');
    }
    const trip = await this.tripModel
      .findById(id)
      .populate('companyId')
      .populate('vehicleId')
      .populate('route.fromLocationId')
      .populate('route.toLocationId')
      .populate({ path: 'route.stops.locationId', model: 'Location' }) // Populate sâu vào mảng
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
        `Không tìm thấy chuyến đi với ID: ${tripId} để cập nhật ghế.`,
      );
    }
    // ... (logic kiểm tra xung đột ghế giữ nguyên như code gốc của bạn)
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
