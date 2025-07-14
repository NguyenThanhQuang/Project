import { IsEnum, IsNotEmpty } from 'class-validator';
import { TripStopStatus } from '../schemas/trip.schema';

export class UpdateTripStopStatusDto {
  @IsNotEmpty()
  @IsEnum(TripStopStatus)
  status: TripStopStatus;
}
