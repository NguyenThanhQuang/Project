import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from 'src/bookings/schemas/booking.schema';
import { MailModule } from '../mail/mail.module';
import { NotificationListener } from './listeners/notification.listener';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  providers: [NotificationsService, NotificationListener],
  exports: [NotificationsService],
})
export class NotificationsModule {}
