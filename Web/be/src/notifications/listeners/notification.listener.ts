import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingDocument } from '../../bookings/schemas/booking.schema';
import { NotificationsService } from '../notifications.service';

interface UserEventPayload {
  email: string;
  name: string;
  token: string;
}

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('booking.confirmed', { async: true })
  async handleBookingConfirmedEvent(booking: BookingDocument) {
    this.logger.log(
      `Received booking.confirmed event, data: ${booking._id.toString()}`,
    );
    await this.notificationsService.handleBookingConfirmed(booking);
  }

  @OnEvent('booking.cancelled', { async: true })
  async handleBookingCancelledEvent(booking: BookingDocument) {
    this.logger.log(
      `Received booking.cancelled event, data: ${booking._id.toString()}`,
    );
    await this.notificationsService.handleBookingCancelled(booking);
  }

  @OnEvent('user.registered', { async: true })
  handleUserRegisteredEvent(payload: UserEventPayload) {
    this.logger.log(
      `Received user.registered event for email: ${payload.email}`,
    );
    // Chuyển giao nhiệm vụ cho service
    this.notificationsService.handleUserRegistered(payload);
  }

  @OnEvent('user.resend_verification', { async: true })
  handleUserResendVerificationEvent(payload: UserEventPayload) {
    this.logger.log(
      `Received user.resend_verification event for email: ${payload.email}`,
    );
    // Chuyển giao nhiệm vụ cho service
    this.notificationsService.handleUserRegistered(payload); // Có thể dùng chung hàm xử lý
  }

  @OnEvent('user.forgot_password', { async: true })
  handleUserForgotPasswordEvent(payload: UserEventPayload) {
    this.logger.log(
      `Received user.forgot_password event for email: ${payload.email}`,
    );
    // Chuyển giao nhiệm vụ cho service
    this.notificationsService.handleUserForgotPassword(payload);
  }
}
