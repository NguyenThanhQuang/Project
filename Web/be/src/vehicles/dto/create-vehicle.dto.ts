import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateVehicleDto {
  @IsNotEmpty({ message: 'ID Nhà xe không được để trống' })
  @IsMongoId({ message: 'ID Nhà xe không hợp lệ' })
  companyId: Types.ObjectId;

  @IsNotEmpty({ message: 'Loại xe không được để trống' })
  @IsString()
  @MaxLength(100)
  type: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsObject()
  seatMap?: Record<string, any>;

  @IsNotEmpty({ message: 'Tổng số ghế không được để trống' })
  @IsNumber({}, { message: 'Tổng số ghế phải là một số' })
  @Min(1, { message: 'Tổng số ghế phải lớn hơn 0' })
  totalSeats: number;
}
