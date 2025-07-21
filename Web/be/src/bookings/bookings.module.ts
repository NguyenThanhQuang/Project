import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TripsModule } from '../trips/trips.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking, BookingSchema } from './schemas/booking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    TripsModule,
    ConfigModule,
    forwardRef(() => TripsModule),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
