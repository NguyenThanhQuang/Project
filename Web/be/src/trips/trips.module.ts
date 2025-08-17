import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from 'src/bookings/schemas/booking.schema';
import { CompaniesModule } from '../companies/companies.module';
import { LocationsModule } from '../locations/locations.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { Trip, TripSchema } from './schemas/trip.schema';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trip.name, schema: TripSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
    CompaniesModule,
    VehiclesModule,
    LocationsModule,
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
