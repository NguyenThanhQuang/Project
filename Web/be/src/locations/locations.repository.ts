import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import {
  Location,
  LocationDocument,
  LocationType,
} from './schemas/location.schema';

@Injectable()
export class LocationsRepository {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {}

  async create(doc: Partial<Location>): Promise<LocationDocument> {
    const newLocation = new this.locationModel(doc);
    return newLocation.save();
  }

  async findOne(
    filter: FilterQuery<LocationDocument>,
  ): Promise<LocationDocument | null> {
    return this.locationModel.findOne(filter).exec();
  }

  async findById(
    id: string | Types.ObjectId,
  ): Promise<LocationDocument | null> {
    return this.locationModel.findById(id).exec();
  }

  async findAll(
    filter: FilterQuery<LocationDocument> = {},
  ): Promise<LocationDocument[]> {
    return this.locationModel
      .find(filter)
      .sort({ province: 1, name: 1 })
      .exec();
  }

  // Logic tìm kiếm đặc thù: Sort theo tỉnh, tên và giới hạn 15 kết quả
  async search(
    filter: FilterQuery<LocationDocument>,
    limit: number = 15,
  ): Promise<LocationDocument[]> {
    return this.locationModel
      .find(filter)
      .sort({ province: 1, name: 1 })
      .limit(limit)
      .exec();
  }

  // Logic tìm địa điểm phổ biến
  async findPopular(limit: number = 10): Promise<LocationDocument[]> {
    return this.locationModel
      .find({
        type: { $in: [LocationType.BUS_STATION, LocationType.CITY] },
        isActive: true,
      })
      .sort({ province: 1 })
      .limit(limit)
      .exec();
  }

  async update(
    id: string | Types.ObjectId,
    updateData: UpdateQuery<LocationDocument>,
  ): Promise<LocationDocument | null> {
    return this.locationModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();
  }

  async delete(id: string | Types.ObjectId): Promise<LocationDocument | null> {
    return this.locationModel.findByIdAndDelete(id).exec();
  }
}
