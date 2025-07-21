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
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class PassengerHoldDto {
  @IsNotEmpty({ message: 'Tên hành khách không được để trống' })
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty({ message: 'Số điện thoại hành khách không được để trống' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại hành khách không hợp lệ' })
  phone: string;

  @IsNotEmpty({ message: 'Số ghế không được để trống' })
  @IsString()
  @MaxLength(10) // Giả sử số ghế không quá dài
  seatNumber: string;
}

export class CreateBookingHoldDto {
  @IsNotEmpty()
  @IsMongoId()
  tripId: string;

  @IsNotEmpty({ message: 'Thông tin hành khách không được để trống' })
  @IsArray()
  @ArrayMinSize(1, { message: 'Phải có ít nhất một hành khách' })
  @ValidateNested({ each: true })
  @Type(() => PassengerHoldDto)
  passengers: PassengerHoldDto[];

  @IsNotEmpty({ message: 'Tên liên hệ không được để trống' })
  @IsString()
  @MaxLength(100)
  contactName: string;

  @IsNotEmpty({ message: 'Số điện thoại liên hệ không được để trống' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại liên hệ không hợp lệ' })
  contactPhone: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email liên hệ không đúng định dạng' })
  @MaxLength(100)
  contactEmail?: string;
}
