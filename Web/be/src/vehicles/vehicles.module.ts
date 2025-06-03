import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesModule } from '../companies/companies.module';
import { Vehicle, VehicleSchema } from './schemas/vehicle.schema';
import { VehiclesService } from './vehicles.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    CompaniesModule,
  ],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
