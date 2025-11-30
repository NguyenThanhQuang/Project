import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsRepository } from './locations.repository';
import { Location, LocationDocument } from './schemas/location.schema';

@Injectable()
export class LocationsService {
  constructor(private readonly locationsRepository: LocationsRepository) {}

  async create(
    createLocationDto: CreateLocationDto,
  ): Promise<LocationDocument> {
    const existingLocation = await this.locationsRepository.findOne({
      name: createLocationDto.name,
      province: createLocationDto.province,
    });

    if (existingLocation) {
      throw new ConflictException(
        `Địa điểm "${createLocationDto.name}" tại tỉnh/thành "${createLocationDto.province}" đã tồn tại.`,
      );
    }

    return this.locationsRepository.create(createLocationDto);
  }

  async findAll(
    query: FilterQuery<Location> = {},
  ): Promise<LocationDocument[]> {
    return this.locationsRepository.findAll(query);
  }

  private escapeRegex(string: string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  async search(keyword: string): Promise<LocationDocument[]> {
    if (!keyword || keyword.trim().length < 2) {
      return [];
    }
    const decodedKeyword = decodeURIComponent(keyword);
    const escapedKeyword = this.escapeRegex(decodedKeyword.trim());

    const searchRegex = new RegExp(escapedKeyword, 'i');

    const filter = {
      $or: [
        { name: { $regex: searchRegex } },
        { province: { $regex: searchRegex } },
      ],
    };

    return this.locationsRepository.search(filter, 15);
  }

  async findOne(id: string): Promise<LocationDocument> {
    const location = await this.locationsRepository.findById(id);
    if (!location) {
      throw new NotFoundException(`Không tìm thấy địa điểm với ID: ${id}`);
    }
    return location;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<LocationDocument> {
    const updatedLocation = await this.locationsRepository.update(
      id,
      updateLocationDto,
    );

    if (!updatedLocation) {
      throw new NotFoundException(
        `Không tìm thấy địa điểm với ID: ${id} để cập nhật.`,
      );
    }
    return updatedLocation;
  }

  async remove(id: string): Promise<LocationDocument> {
    const deletedLocation = await this.locationsRepository.delete(id);

    if (!deletedLocation) {
      throw new NotFoundException(
        `Không tìm thấy địa điểm với ID: ${id} để xóa.`,
      );
    }
    return deletedLocation;
  }

  async findPopularLocations(limit = 10): Promise<LocationDocument[]> {
    return this.locationsRepository.findPopular(limit);
  }
}
