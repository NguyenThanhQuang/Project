import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LookupBookingDto {
  @IsNotEmpty({ message: 'Mã vé hoặc mã đơn hàng không được để trống.' })
  @IsString()
  identifier: string;

  @IsNotEmpty({ message: 'Số điện thoại liên hệ không được để trống.' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại liên hệ không hợp lệ.' })
  contactPhone: string;
}
