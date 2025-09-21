import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from '../app.module';

import { Booking, BookingSchema } from 'src/bookings/schemas/booking.schema';
import { Company, CompanySchema } from 'src/companies/schemas/company.schema';
import {
  Location,
  LocationSchema,
} from 'src/locations/schemas/location.schema';
import { Review, ReviewSchema } from 'src/reviews/schemas/review.schema';
import { Trip, TripSchema } from 'src/trips/schemas/trip.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Vehicle, VehicleSchema } from 'src/vehicles/schemas/vehicle.schema';

import { MailModule } from 'src/mail/mail.module';
import { BookingsModule } from '../bookings/bookings.module';
import { CompaniesModule } from '../companies/companies.module';
import { LocationsModule } from '../locations/locations.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { TripsModule } from '../trips/trips.module';
import { UsersModule } from '../users/users.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { SeedService } from './seed.service';

@Module({
  imports: [
    AppModule,

    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Location.name, schema: LocationSchema },
      { name: User.name, schema: UserSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: Trip.name, schema: TripSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),

    ConfigModule,
    UsersModule,
    CompaniesModule,
    VehiclesModule,
    LocationsModule,
    TripsModule,
    BookingsModule,
    ReviewsModule,
    MailModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
