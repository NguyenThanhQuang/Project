import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { TripStatus, TripStopStatus } from '../schemas/trip.schema';

export class UpdateTripDriverDto {
  // Cập nhật trạng thái chính của chuyến đi (bắt buộc chọn 1 trong 2: status hoặc stop info)
  @IsOptional()
  @IsEnum([TripStatus.DEPARTED, TripStatus.ARRIVED], {
    message: 'Trạng thái không hợp lệ. Chỉ chấp nhận departed hoặc arrived.',
  })
  status?: TripStatus;

  // Cập nhật trạng thái điểm dừng
  @IsOptional()
  @IsMongoId({ message: 'ID địa điểm dừng không hợp lệ.' })
  stopLocationId?: string;

  @IsOptional()
  @IsEnum(TripStopStatus)
  stopStatus?: TripStopStatus;
}
