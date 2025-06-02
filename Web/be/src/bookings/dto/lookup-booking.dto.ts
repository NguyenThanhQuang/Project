import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class LookupBookingDto {
  @IsOptional()
  @IsString()
  @MaxLength(50) // Giả sử mã vé không quá dài
  ticketCode?: string;

  @IsOptional()
  @IsMongoId({ message: 'Booking ID không hợp lệ' })
  bookingId?: string;

  @ValidateIf((o: LookupBookingDto) => !!o.bookingId && !o.ticketCode, {
    message:
      'Số điện thoại liên hệ là bắt buộc khi tra cứu bằng Booking ID mà không có Mã vé.',
  })
  @IsNotEmpty({
    message:
      'Số điện thoại liên hệ không được để trống khi tra cứu bằng Booking ID.',
  })
  @IsPhoneNumber('VN', { message: 'Số điện thoại liên hệ không hợp lệ' })
  contactPhone?: string;
}
