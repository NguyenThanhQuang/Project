import {
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

  private validateSeatMap(seatMap: any, totalSeats: number): boolean {
    if (!seatMap || typeof seatMap !== 'object') return true;

    return true;
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<VehicleDocument> {
    await this.companiesService.findOne(createVehicleDto.companyId);

    if (createVehicleDto.seatMap) {
      this.validateSeatMap(
        createVehicleDto.seatMap,
        createVehicleDto.totalSeats,
      );
    }

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

    if (updateVehicleDto.type || updateVehicleDto.companyId) {
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
      updateVehicleDto.totalSeats !== undefined
        ? updateVehicleDto.totalSeats
        : existingVehicle.totalSeats;
    const seatMapForValidation =
      updateVehicleDto.seatMap !== undefined
        ? updateVehicleDto.seatMap
        : existingVehicle.seatMap;

    if (seatMapForValidation) {
      this.validateSeatMap(seatMapForValidation, totalSeatsForValidation);
    }

    Object.assign(existingVehicle, updateVehicleDto);
    return existingVehicle.save();
  }

  async remove(id: string): Promise<VehicleDocument> {
    const vehicle = await this.findOne(id);
    // const trips = await this.tripModel.countDocuments({ vehicleId: id });
    // if (trips > 0) throw new ConflictException('Không thể xóa loại xe khi vẫn còn chuyến đi liên kết.');
    await vehicle.deleteOne();
    return vehicle;
  }

  async deleteAll(): Promise<any> {
    return this.vehicleModel.deleteMany({}).exec();
  }
}
