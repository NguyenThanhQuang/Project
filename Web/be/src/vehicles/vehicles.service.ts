import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CompaniesService } from '../companies/companies.service';
import { Trip, TripDocument, TripStatus } from '../trips/schemas/trip.schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import {
  SeatMap,
  SeatMapLayout,
  VehicleDocument,
  VehicleStatus,
} from './schemas/vehicle.schema';
import { VehiclesRepository } from './vehicles.repository';

@Injectable()
export class VehiclesService {
  constructor(
    private readonly vehiclesRepository: VehiclesRepository,
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    private readonly companiesService: CompaniesService,
  ) {}

  /**
   * TẠO SƠ ĐỒ GHẾ VÀ ĐẾM SỐ GHẾ TỪ CÁC THAM SỐ CẤU HÌNH.
   * Đây là hàm logic cốt lõi mới của chúng ta.
   * @param rows Số hàng ghế.
   * @param columns Số cột (bao gồm cả lối đi).
   * @param aisles Mảng vị trí các cột là lối đi (ví dụ: [2] hoặc [1, 2]).
   * @param seatPrefix Tiền tố cho tên ghế (ví dụ: 'A' cho tầng 1, 'B' cho tầng 2).
   * @returns Một object chứa số ghế đã đếm và sơ đồ ghế đã tạo.
   */
  private generateSeatMapLayout(
    rows: number,
    columns: number,
    aisles: number[],
    seatPrefix: string,
  ): { seatCount: number; seatMap: SeatMap } {
    if (rows <= 0 || columns <= 0) {
      throw new BadRequestException('Số hàng và số cột phải lớn hơn 0.');
    }

    let seatCount = 0;
    const layout: SeatMapLayout = [];

    for (let r = 1; r <= rows; r++) {
      const newRow: (string | null)[] = [];
      for (let c = 1; c <= columns; c++) {
        if (aisles.includes(c)) {
          newRow.push(null);
        } else {
          seatCount++;
          const seatNumber = `${seatPrefix}${seatCount.toString().padStart(2, '0')}`;
          newRow.push(seatNumber);
        }
      }
      layout.push(newRow);
    }

    return {
      seatCount,
      seatMap: {
        rows,
        cols: columns,
        layout: layout,
      },
    };
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<VehicleDocument> {
    await this.companiesService.findOne(createVehicleDto.companyId);

    const existingVehicleByNumber = await this.vehiclesRepository.findOne({
      companyId: createVehicleDto.companyId,
      vehicleNumber: createVehicleDto.vehicleNumber.toUpperCase(),
    });
    if (existingVehicleByNumber) {
      throw new ConflictException(
        `Biển số xe "${createVehicleDto.vehicleNumber}" đã tồn tại cho nhà xe này.`,
      );
    }

    const {
      seatRows,
      seatColumns,
      aislePositions = [],
      floors,
    } = createVehicleDto;

    // Sơ đồ và đếm ghế cho tầng 1
    const floor1Result = this.generateSeatMapLayout(
      seatRows,
      seatColumns,
      aislePositions,
      'A',
    );
    let totalSeats = floor1Result.seatCount;
    let seatMapFloor2: SeatMap | undefined = undefined;

    // Sơ đồ và đếm ghế cho tầng 2
    if (floors > 1) {
      const floor2Result = this.generateSeatMapLayout(
        seatRows,
        seatColumns,
        aislePositions,
        'B',
      );
      totalSeats += floor2Result.seatCount;
      seatMapFloor2 = floor2Result.seatMap;
    }

    const newVehicleData = {
      ...createVehicleDto,
      companyId: new Types.ObjectId(createVehicleDto.companyId),
      vehicleNumber: createVehicleDto.vehicleNumber.toUpperCase(),
      totalSeats,
      seatMap: floor1Result.seatMap,
      seatMapFloor2,
    };

    return this.vehiclesRepository.create(newVehicleData);
  }

  async findAll(
    companyId?: string | Types.ObjectId,
  ): Promise<VehicleDocument[]> {
    const query: any = {};

    if (companyId) {
      if (!Types.ObjectId.isValid(companyId)) {
        return [];
      }
      query.companyId = new Types.ObjectId(companyId);
    }

    return this.vehiclesRepository.findAll(query);
  }

  async findOne(id: string | Types.ObjectId): Promise<VehicleDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID loại xe không hợp lệ');
    }
    const vehicle = await this.vehiclesRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundException(
        `Không tìm thấy loại xe với ID "${id.toString()}"`,
      );
    }
    return vehicle;
  }

  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<VehicleDocument> {
    const existingVehicle = await this.findOne(id);

    if (
      updateVehicleDto.vehicleNumber &&
      updateVehicleDto.vehicleNumber.toUpperCase() !==
        existingVehicle.vehicleNumber
    ) {
      const conflictingVehicle = await this.vehiclesRepository.findOne({
        companyId: existingVehicle.companyId,
        vehicleNumber: updateVehicleDto.vehicleNumber.toUpperCase(),
        _id: { $ne: id },
      });
      if (conflictingVehicle) {
        throw new ConflictException(
          `Biển số xe "${updateVehicleDto.vehicleNumber}" đã được sử dụng bởi một xe khác trong nhà xe này.`,
        );
      }
    }

    const hasStructuralChange =
      (updateVehicleDto.floors !== undefined &&
        updateVehicleDto.floors !== existingVehicle.floors) ||
      (updateVehicleDto.seatRows !== undefined &&
        updateVehicleDto.seatRows !== existingVehicle.seatRows) ||
      (updateVehicleDto.seatColumns !== undefined &&
        updateVehicleDto.seatColumns !== existingVehicle.seatColumns) ||
      // (So sánh mảng phức tạp hơn, nhưng đây là cách đơn giản và hiệu quả)
      (updateVehicleDto.aislePositions !== undefined &&
        JSON.stringify(updateVehicleDto.aislePositions) !==
          JSON.stringify(existingVehicle.aislePositions));

    if (hasStructuralChange) {
      const upcomingTripsCount = await this.tripModel
        .countDocuments({
          vehicleId: existingVehicle._id,
          status: { $in: [TripStatus.SCHEDULED, TripStatus.DEPARTED] },
        })
        .exec();

      if (upcomingTripsCount > 0) {
        throw new ConflictException(
          `Không thể thay đổi cấu trúc xe vì đang được sử dụng trong ${upcomingTripsCount} chuyến đi sắp tới hoặc đang chạy.`,
        );
      }
    }

    const configChanged =
      updateVehicleDto.seatRows !== undefined ||
      updateVehicleDto.seatColumns !== undefined ||
      updateVehicleDto.aislePositions !== undefined ||
      updateVehicleDto.floors !== undefined;

    if (configChanged) {
      const rows = updateVehicleDto.seatRows ?? existingVehicle.seatRows;
      const columns =
        updateVehicleDto.seatColumns ?? existingVehicle.seatColumns;
      const aisles =
        updateVehicleDto.aislePositions ?? existingVehicle.aislePositions;
      const floors = updateVehicleDto.floors ?? existingVehicle.floors;

      const floor1Result = this.generateSeatMapLayout(
        rows,
        columns,
        aisles,
        'A',
      );
      let totalSeats = floor1Result.seatCount;
      let seatMapFloor2: SeatMap | undefined = undefined;

      if (floors > 1) {
        const floor2Result = this.generateSeatMapLayout(
          rows,
          columns,
          aisles,
          'B',
        );
        totalSeats += floor2Result.seatCount;
        seatMapFloor2 = floor2Result.seatMap;
      } else {
        seatMapFloor2 = undefined;
      }

      existingVehicle.totalSeats = totalSeats;
      existingVehicle.seatMap = floor1Result.seatMap;
      existingVehicle.seatMapFloor2 = seatMapFloor2;
    }

    const { companyId, ...restOfDto } = updateVehicleDto;
    Object.assign(existingVehicle, restOfDto);

    if (updateVehicleDto.vehicleNumber) {
      existingVehicle.vehicleNumber =
        updateVehicleDto.vehicleNumber.toUpperCase();
    }

    return this.vehiclesRepository.save(existingVehicle);
  }

  async remove(id: string): Promise<VehicleDocument> {
    const vehicle = await this.findOne(id);

    const upcomingTripsCount = await this.tripModel
      .countDocuments({
        vehicleId: vehicle._id,
        status: { $in: [TripStatus.SCHEDULED, TripStatus.DEPARTED] },
      })
      .exec();

    if (upcomingTripsCount > 0) {
      throw new ConflictException(
        `Không thể xóa/vô hiệu hóa xe vì đang được sử dụng trong ${upcomingTripsCount} chuyến đi sắp tới hoặc đang chạy.`,
      );
    }

    vehicle.status = VehicleStatus.INACTIVE;
    return this.vehiclesRepository.save(vehicle);
  }
}
