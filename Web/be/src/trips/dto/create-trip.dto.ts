import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { TripStatus } from '../schemas/trip.schema';

class PointDto {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}

class LocationPointDto {
  @IsNotEmpty({ message: 'Tên điểm không được để trống' })
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty({ message: 'Thông tin vị trí không được để trống' })
  @ValidateNested()
  @Type(() => PointDto)
  location: PointDto;
}

class StopDto {
  @IsNotEmpty({ message: 'Tên điểm dừng không được để trống' })
  @IsString()
  @MaxLength(100)
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
  @MaxLength(4096)
  polyline?: string;
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
}
