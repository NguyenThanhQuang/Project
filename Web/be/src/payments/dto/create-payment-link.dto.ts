import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePaymentLinkDto {
  @IsNotEmpty({ message: 'ID của đơn đặt vé không được để trống.' })
  @IsMongoId({ message: 'ID của đơn đặt vé không hợp lệ.' })
  bookingId: Types.ObjectId;
}
