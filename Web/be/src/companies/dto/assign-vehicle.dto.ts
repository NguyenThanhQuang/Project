import { IsMongoId, IsOptional } from 'class-validator';

export class AssignVehicleDto {
  @IsMongoId()
  driverId: string;

  @IsMongoId()
  vehicleId: string;
}

export class UpdateDriverVehicleDto {
  @IsMongoId()
  newVehicleId: string;
}

export class GetCompanyDriversQueryDto {
  @IsOptional()
  status?: string;

  @IsOptional()
  withVehicle?: boolean;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  search?: string;
}