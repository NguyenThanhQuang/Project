import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingDocument } from '../../bookings/schemas/booking.schema';
import { NotificationsService } from '../notifications.service';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('booking.confirmed', { async: true }) // Lắng nghe sự kiện 'booking.confirmed'
  async handleBookingConfirmedEvent(booking: BookingDocument) {
    this.logger.log(
      `Received booking.confirmed event, data: ${booking._id.toString()}`,
    );
    // Chuyển giao nhiệm vụ cho service xử lý
    await this.notificationsService.handleBookingConfirmed(booking);
  }

  @OnEvent('booking.cancelled', { async: true }) // Lắng nghe sự kiện 'booking.cancelled'
  async handleBookingCancelledEvent(booking: BookingDocument) {
    this.logger.log(
      `Received booking.cancelled event, data: ${booking._id.toString()}`,
    );
    await this.notificationsService.handleBookingCancelled(booking);
  }
}
