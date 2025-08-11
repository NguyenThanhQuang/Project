import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { SeatMapLayout, VehicleStatus } from '../schemas/vehicle.schema';

class SeatMapDto {
  @IsNotEmpty({ message: 'Số hàng ghế (rows) không được để trống.' })
  @IsInt({ message: 'Số hàng ghế phải là số nguyên.' })
  @Min(1, { message: 'Số hàng ghế phải lớn hơn 0.' })
  rows: number;

  @IsNotEmpty({ message: 'Số cột ghế (cols) không được để trống.' })
  @IsInt({ message: 'Số cột ghế phải là số nguyên.' })
  @Min(1, { message: 'Số cột ghế phải lớn hơn 0.' })
  cols: number;

  @IsNotEmpty({ message: 'Sơ đồ ghế (layout) không được để trống.' })
  @IsArray({ message: 'Sơ đồ ghế phải là một mảng.' })
  layout: SeatMapLayout;
}

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
  @IsObject({ message: 'Sơ đồ ghế phải là một đối tượng.' })
  @ValidateNested()
  @Type(() => SeatMapDto)
  seatMap?: SeatMapDto;

  @IsNotEmpty({ message: 'Tổng số ghế không được để trống.' })
  @IsInt({ message: 'Tổng số ghế phải là một số nguyên.' })
  @Min(1, { message: 'Tổng số ghế phải lớn hơn 0.' })
  totalSeats: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  floors?: number;

  @IsOptional()
  @IsEnum(VehicleStatus, { message: 'Trạng thái không hợp lệ.' })
  status?: VehicleStatus;
}
