import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { LocationType } from '../schemas/location.schema';

class PointDto {
  @IsArray()
  @ArrayMinSize(2, { message: 'Tọa độ phải có đủ kinh độ và vĩ độ.' })
  @ArrayMaxSize(2, { message: 'Tọa độ chỉ có kinh độ và vĩ độ.' })
  @IsNumber({}, { each: true, message: 'Tọa độ phải là số.' })
  coordinates: [number, number]; // [longitude, latitude]
}

export class CreateLocationDto {
  @IsNotEmpty({ message: 'Tên địa điểm không được để trống.' })
  @IsString()
  @MaxLength(200)
  name: string;

  @IsNotEmpty({ message: 'Tỉnh/Thành phố không được để trống.' })
  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsNotEmpty({ message: 'Địa chỉ đầy đủ không được để trống.' })
  @IsString()
  fullAddress: string;

  @IsNotEmpty({
    message: 'Thông tin vị trí (coordinates) không được để trống.',
  })
  @ValidateNested()
  @Type(() => PointDto)
  location: { type: 'Point'; coordinates: [number, number] };

  @IsNotEmpty({ message: 'Loại địa điểm không được để trống.' })
  @IsEnum(LocationType, { message: 'Loại địa điểm không hợp lệ.' })
  type: LocationType;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true, message: 'Mỗi ảnh phải là một URL hợp lệ.' })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
