import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CompaniesService } from '../companies/companies.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    private readonly companiesService: CompaniesService,
  ) {}

  /**
   * Validate sơ đồ ghế (seatMap).
   * - Kiểm tra seatMap có cấu trúc hợp lệ (tối thiểu là có thuộc tính layout dạng mảng).
   * - Đếm số ghế trong layout và so sánh với totalSeats đã khai báo.
   * Logic này có thể được mở rộng để validate các quy tắc phức tạp.
   * @param seatMap - Đối tượng sơ đồ ghế từ DTO.
   * @param totalSeats - Tổng số ghế đã khai báo.
   */
  private validateSeatMap(seatMap: any, totalSeats: number): void {
    if (!seatMap) {
      return;
    }
    //Hạn chế dùng any

    if (typeof seatMap !== 'object' || !Array.isArray(seatMap.layout)) {
      throw new BadRequestException(
        'Sơ đồ ghế (seatMap) không hợp lệ. Cần có thuộc tính "layout" là một mảng.',
      );
    }

    let countedSeats = 0;
    for (const row of seatMap.layout) {
      if (Array.isArray(row)) {
        for (const seat of row) {
          if (seat !== null && seat !== undefined) {
            countedSeats++;
          }
        }
      }
    }

    if (countedSeats !== totalSeats) {
      throw new BadRequestException(
        `Số lượng ghế trong sơ đồ (${countedSeats}) không khớp với tổng số ghế đã khai báo (${totalSeats}).`,
      );
    }
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<VehicleDocument> {
    await this.companiesService.findOne(createVehicleDto.companyId);

    this.validateSeatMap(createVehicleDto.seatMap, createVehicleDto.totalSeats);

    const existingVehicle = await this.vehicleModel
      .findOne({
        companyId: createVehicleDto.companyId,
        type: createVehicleDto.type,
      })
      .exec();

    if (existingVehicle) {
      throw new ConflictException(
        `Loại xe "${createVehicleDto.type}" đã tồn tại cho nhà xe này.`,
      );
    }

    const newVehicle = new this.vehicleModel(createVehicleDto);
    return newVehicle.save();
  }

  async findAll(
    companyId?: string | Types.ObjectId,
  ): Promise<VehicleDocument[]> {
    const query = companyId ? { companyId } : {};
    return this.vehicleModel
      .find(query)
      .populate('companyId', 'name code')
      .exec();
  }

  async findOne(id: string | Types.ObjectId): Promise<VehicleDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID loại xe không hợp lệ');
    }
    const vehicle = await this.vehicleModel
      .findById(id)
      .populate('companyId', 'name code')
      .exec();
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

    if (updateVehicleDto.type || updateVehicleDto.companyId) {
      if (
        updateVehicleDto.companyId &&
        updateVehicleDto.companyId.toString() !==
          existingVehicle.companyId.toString()
      ) {
        await this.companiesService.findOne(updateVehicleDto.companyId);
      }

      const companyIdForCheck =
        updateVehicleDto.companyId || existingVehicle.companyId;
      const typeForCheck = updateVehicleDto.type || existingVehicle.type;

      const conflictingVehicle = await this.vehicleModel
        .findOne({
          companyId: companyIdForCheck,
          type: typeForCheck,
          _id: { $ne: id },
        })
        .exec();

      if (conflictingVehicle) {
        throw new ConflictException(
          `Loại xe "${typeForCheck}" đã tồn tại cho nhà xe này.`,
        );
      }
    }

    const totalSeatsForValidation =
      updateVehicleDto.totalSeats ?? existingVehicle.totalSeats;
    const seatMapForValidation =
      updateVehicleDto.seatMap ?? existingVehicle.seatMap;

    this.validateSeatMap(seatMapForValidation, totalSeatsForValidation);

    Object.assign(existingVehicle, updateVehicleDto);
    return existingVehicle.save();
  }

  async remove(id: string): Promise<VehicleDocument> {
    const vehicle = await this.findOne(id);

    // **Ghi chú quan trọng:**
    // Module `Trips`, logic kiểm tra:
    // const tripCount = await this.tripModel.countDocuments({ vehicleId: id }).exec();
    // if (tripCount > 0) {
    //   throw new ConflictException(
    //     'Không thể xóa loại xe này vì nó đang được sử dụng trong ' + tripCount + ' chuyến đi.'
    //   );
    // }

    await vehicle.deleteOne();
    return vehicle;
  }

  // async deleteAll(): Promise<any> {
  //   return this.vehicleModel.deleteMany({}).exec();
  // }
}
