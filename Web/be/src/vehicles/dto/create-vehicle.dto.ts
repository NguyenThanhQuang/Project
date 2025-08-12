import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { VehicleStatus } from '../schemas/vehicle.schema';

export class CreateVehicleDto {
  @IsNotEmpty({ message: 'ID Nhà xe không được để trống.' })
  @IsMongoId({ message: 'ID Nhà xe không hợp lệ.' })
  companyId: Types.ObjectId;

  @IsNotEmpty({ message: 'Biển số xe không được để trống.' })
  @IsString()
  @MaxLength(20, { message: 'Biển số xe không được vượt quá 20 ký tự.' })
  vehicleNumber: string;

  @IsNotEmpty({ message: 'Loại xe không được để trống.' })
  @IsString()
  @MaxLength(100, { message: 'Loại xe không được vượt quá 100 ký tự.' })
  type: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Mô tả không được vượt quá 1000 ký tự.' })
  description?: string;

  @IsOptional()
  @IsEnum(VehicleStatus, { message: 'Trạng thái không hợp lệ.' })
  status?: VehicleStatus;

  @IsNotEmpty({ message: 'Số tầng không được để trống.' })
  @IsInt({ message: 'Số tầng phải là số nguyên.' })
  @Min(1, { message: 'Phải có ít nhất 1 tầng.' })
  floors: number;

  @IsNotEmpty({ message: 'Số cột ghế không được để trống.' })
  @IsInt({ message: 'Số cột ghế phải là số nguyên.' })
  @Min(1, { message: 'Phải có ít nhất 1 cột ghế.' })
  seatColumns: number;

  @IsNotEmpty({ message: 'Số hàng ghế không được để trống.' })
  @IsInt({ message: 'Số hàng ghế phải là số nguyên.' })
  @Min(1, { message: 'Phải có ít nhất 1 hàng ghế.' })
  seatRows: number;

  @IsOptional()
  @IsArray({ message: 'Vị trí lối đi phải là một mảng.' })
  @IsNumber(
    {},
    { each: true, message: 'Mỗi vị trí lối đi phải là một con số.' },
  )
  @ArrayMaxSize(5)
  aislePositions?: number[];
}
