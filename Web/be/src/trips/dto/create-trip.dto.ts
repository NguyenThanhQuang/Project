import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { TripStatus } from '../schemas/trip.schema';

class TripStopDto {
  @IsNotEmpty({ message: 'ID điểm dừng không được để trống.' })
  @IsMongoId()
  locationId: string;

  @IsNotEmpty({
    message: 'Thời gian dự kiến đến điểm dừng không được để trống.',
  })
  @IsDateString()
  expectedArrivalTime: string;

  @IsOptional()
  @IsDateString()
  expectedDepartureTime?: string;
}

class RouteInfoDto {
  @IsNotEmpty({ message: 'ID điểm đi không được để trống.' })
  @IsMongoId()
  fromLocationId: string;

  @IsNotEmpty({ message: 'ID điểm đến không được để trống.' })
  @IsMongoId()
  toLocationId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TripStopDto)
  stops?: TripStopDto[];

  // Polyline không cần có trong DTO vì nó sẽ được tạo tự động
}

export class CreateTripDto {
  @IsNotEmpty()
  @IsMongoId()
  companyId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  vehicleId: Types.ObjectId;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RouteInfoDto)
  route: RouteInfoDto;

  @IsNotEmpty()
  @IsDateString()
  departureTime: string;

  @IsNotEmpty()
  @IsDateString()
  expectedArrivalTime: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;

  @IsOptional()
  @IsBoolean()
  isRecurrenceTemplate?: boolean;
}
