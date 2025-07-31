import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from 'src/bookings/schemas/booking.schema';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MailModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
