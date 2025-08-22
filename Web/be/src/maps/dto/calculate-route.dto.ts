import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class CoordinateDto {
  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;
}

export class CalculateRouteDto {
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CoordinateDto)
  waypoints: CoordinateDto[];
}
