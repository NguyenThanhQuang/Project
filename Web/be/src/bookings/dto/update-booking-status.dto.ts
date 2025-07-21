import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus, PaymentStatus } from '../schemas/booking.schema';

export class UpdateBookingStatusDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsDate()
  heldUntil?: Date;

  @IsOptional()
  @IsString()
  ticketCode?: string;

  @IsOptional()
  @IsString()
  paymentGatewayTransactionId?: string;
}
