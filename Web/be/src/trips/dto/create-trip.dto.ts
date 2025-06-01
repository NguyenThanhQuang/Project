import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { SeatStatus, TripStatus } from '../schemas/trip.schema';

class PointDto {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}

class LocationPointDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PointDto)
  location: PointDto;
}

class StopDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PointDto)
  location?: PointDto;

  @IsOptional()
  @IsDateString()
  expectedArrivalTime?: string;

  @IsOptional()
  @IsDateString()
  expectedDepartureTime?: string;
}

class RouteInfoDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationPointDto)
  from: LocationPointDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationPointDto)
  to: LocationPointDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StopDto)
  stops?: StopDto[];

  @IsOptional()
  @IsString()
  polyline?: string;
}

export class SeatDto {
  @IsNotEmpty()
  @IsString()
  seatNumber: string;

  @IsOptional()
  @IsEnum(SeatStatus)
  status?: SeatStatus;
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

  @IsNotEmpty({ message: 'Danh sách ghế không được để trống khi tạo chuyến.' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];
}
