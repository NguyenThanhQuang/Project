import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';

@Injectable()
export class VehiclesRepository {
  constructor(
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  async create(
    doc: Partial<Vehicle>,
    session?: ClientSession,
  ): Promise<VehicleDocument> {
    const newVehicle = new this.vehicleModel(doc);
    return newVehicle.save({ session });
  }

  async findOne(
    filter: FilterQuery<VehicleDocument>,
  ): Promise<VehicleDocument | null> {
    return this.vehicleModel.findOne(filter).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<VehicleDocument | null> {
    return this.vehicleModel
      .findById(id)
      .populate('companyId', 'name code')
      .exec();
  }

  async findAll(
    filter: FilterQuery<VehicleDocument> = {},
  ): Promise<VehicleDocument[]> {
    return this.vehicleModel
      .find(filter)
      .populate('companyId', 'name code')
      .exec();
  }

  async save(
    vehicle: VehicleDocument,
    session?: ClientSession,
  ): Promise<VehicleDocument> {
    return vehicle.save({ session });
  }
}
