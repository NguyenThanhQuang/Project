import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class LookupBookingDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ticketCode?: string;

  @IsOptional()
  @IsMongoId({ message: 'Booking ID không hợp lệ' })
  bookingId?: string;

  @IsOptional()
  @IsPhoneNumber('VN', { message: 'Số điện thoại liên hệ không hợp lệ' })
  contactPhone?: string;
}
