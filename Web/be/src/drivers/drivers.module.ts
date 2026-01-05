  import { Module } from '@nestjs/common';
  import { DriversService } from './drivers.service';
  import { DriversController } from './drivers.controller';
  import { MongooseModule } from '@nestjs/mongoose';
  import { Driver, DriverSchema } from './schema/driver.schema';
  import { Booking, BookingSchema } from 'src/bookings/schemas/booking.schema';
  import { Trip, TripSchema } from 'src/trips/schemas/trip.schema';
  import { User, UserSchema } from 'src/users/schemas/user.schema';
  import { UsersModule } from 'src/users/users.module';
  import { MailModule } from 'src/mail/mail.module';

  @Module({
  imports: [
      MongooseModule.forFeature([
        { name: Driver.name, schema: DriverSchema },
        { name: Booking.name, schema: BookingSchema }, // ✅ FIX
        { name: Trip.name, schema: TripSchema },       // ✅ vì service có inject TripModel
        { name: User.name, schema: UserSchema }, 
      ],),  UsersModule, // ✅ để lấy UsersService
      MailModule,
    ],  controllers: [DriversController],
    providers: [DriversService],
    exports:[DriversService]
  })
  export class DriversModule {}
