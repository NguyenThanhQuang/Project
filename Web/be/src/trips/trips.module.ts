import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from 'src/bookings/schemas/booking.schema';
import { Review, ReviewSchema } from 'src/reviews/schemas/review.schema';
import { CompaniesModule } from '../companies/companies.module';
import { LocationsModule } from '../locations/locations.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { Trip, TripSchema } from './schemas/trip.schema';
import { TripSchedulerService } from './trip.scheduler.service';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { TripsRepository } from './trips.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trip.name, schema: TripSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    CompaniesModule,
    VehiclesModule,
    LocationsModule,
  ],
  controllers: [TripsController],
  providers: [TripsService, TripSchedulerService, TripsRepository],
  exports: [TripsService],
})
export class TripsModule {}
