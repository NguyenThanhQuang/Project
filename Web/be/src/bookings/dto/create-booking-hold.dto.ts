import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class PassengerInfoDto {
  @IsNotEmpty({ message: 'Tên hành khách không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Số điện thoại hành khách không được để trống' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại hành khách không hợp lệ' })
  phone: string;

  @IsNotEmpty({ message: 'Số ghế không được để trống' })
  @IsString()
  seatNumber: string;
}

export class CreateBookingHoldDto {
  @IsNotEmpty()
  @IsMongoId()
  tripId: Types.ObjectId;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1, { message: 'Phải chọn ít nhất một ghế' })
  @IsString({ each: true, message: 'Mỗi số ghế phải là chuỗi' })
  seatNumbers: string[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PassengerInfoDto)
  passengers: PassengerInfoDto[];

  @IsNotEmpty({ message: 'Tên liên hệ không được để trống' })
  @IsString()
  contactName: string;

  @IsNotEmpty({ message: 'Số điện thoại liên hệ không được để trống' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại liên hệ không hợp lệ' })
  contactPhone: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email liên hệ không đúng định dạng' })
  contactEmail?: string;
}
