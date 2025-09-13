import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import {
  Location,
  LocationDocument,
  LocationType,
} from './schemas/location.schema';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {}

  async create(
    createLocationDto: CreateLocationDto,
  ): Promise<LocationDocument> {
    // Kiểm tra xem địa điểm với tên và tỉnh đã tồn tại chưa để tránh trùng lặp
    const existingLocation = await this.locationModel
      .findOne({
        name: createLocationDto.name,
        province: createLocationDto.province,
      })
      .exec();

    if (existingLocation) {
      throw new ConflictException(
        `Địa điểm "${createLocationDto.name}" tại tỉnh/thành "${createLocationDto.province}" đã tồn tại.`,
      );
    }

    const newLocation = new this.locationModel(createLocationDto);
    return newLocation.save();
  }

  async findAll(
    query: FilterQuery<Location> = {},
  ): Promise<LocationDocument[]> {
    // Logic lọc, chưa có phân trang
    // Ví dụ: /api/locations?type=bus_station&province=Hồ Chí Minh
    return this.locationModel.find(query).sort({ province: 1, name: 1 }).exec();
  }

  async search(keyword: string): Promise<LocationDocument[]> {
    if (!keyword || keyword.trim().length < 2) {
      return [];
    }

    const searchRegex = new RegExp(keyword, 'i');

    return this.locationModel
      .find({
        $or: [
          { name: { $regex: searchRegex } },
          { province: { $regex: searchRegex } },
        ],
      })
      .sort({ province: 1, name: 1 })
      .limit(15)
      .exec();
  }

  async findOne(id: string): Promise<LocationDocument> {
    const location = await this.locationModel.findById(id).exec();
    if (!location) {
      throw new NotFoundException(`Không tìm thấy địa điểm với ID: ${id}`);
    }
    return location;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<LocationDocument> {
    const updatedLocation = await this.locationModel
      .findByIdAndUpdate(id, { $set: updateLocationDto }, { new: true })
      .exec();

    if (!updatedLocation) {
      throw new NotFoundException(
        `Không tìm thấy địa điểm với ID: ${id} để cập nhật.`,
      );
    }
    return updatedLocation;
  }

  async remove(id: string): Promise<LocationDocument> {
    // TODO: Khi có Trips, cần kiểm tra xem địa điểm có đang được sử dụng không
    // const tripsUsingLocation = await this.tripModel.countDocuments({
    //   $or: [
    //     { 'route.fromLocationId': id },
    //     { 'route.toLocationId': id },
    //     { 'route.stopLocationIds': id },
    //   ],
    // });
    // if (tripsUsingLocation > 0) {
    //   throw new ConflictException(
    //     'Không thể xóa địa điểm đang được sử dụng trong một chuyến đi.',
    //   );
    // }

    const deletedLocation = await this.locationModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedLocation) {
      throw new NotFoundException(
        `Không tìm thấy địa điểm với ID: ${id} để xóa.`,
      );
    }
    return deletedLocation;
  }
  async findPopularLocations(limit = 10): Promise<LocationDocument[]> {
    return this.locationModel
      .find({
        type: { $in: [LocationType.BUS_STATION, LocationType.CITY] },
        isActive: true,
      })
      .sort({ province: 1 }) // Sắp xếp theo alphabet
      .limit(limit)
      .exec();
  }

  // async deleteAll(): Promise<any> {
  //   return this.locationModel.deleteMany({}).exec();
  // }
}
