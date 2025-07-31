import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly mailService: MailService,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  /**
   * Xử lý logic khi một booking được xác nhận thành công.
   * @param bookingPayload - Document booking được truyền từ sự kiện.
   */
  async handleBookingConfirmed(bookingPayload: BookingDocument) {
    const bookingIdString = bookingPayload._id.toString();

    this.logger.log(
      `Handling booking.confirmed event for booking ID: ${bookingIdString}`,
    );

    try {
      const populatedBooking = await this.bookingModel
        .findById(bookingPayload._id)
        .populate({
          path: 'tripId',
          populate: [
            { path: 'route.fromLocationId', select: 'name province' },
            { path: 'route.toLocationId', select: 'name province' },
            { path: 'companyId', select: 'name' },
          ],
        })
        .populate('userId', 'name')
        .exec();

      if (!populatedBooking) {
        this.logger.error(
          `Booking with ID ${bookingIdString} not found for notification.`,
        );
        return;
      }

      if (populatedBooking.contactEmail) {
        await this.mailService.sendBookingConfirmationEmail(populatedBooking);
      } else {
        this.logger.warn(
          `Booking ${bookingIdString} has no contact email. Skipping email notification.`,
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error(
        `Failed to send confirmation notification for booking ID: ${bookingIdString}`,
        errorMessage,
      );
    }
  }

  /**
   * Xử lý logic khi một booking bị hủy.
   * @param bookingPayload
   */
  async handleBookingCancelled(bookingPayload: BookingDocument) {
    const bookingIdString = bookingPayload._id.toString();

    this.logger.log(
      `Handling booking.cancelled event for booking ID: ${bookingIdString}`,
    );

    try {
      const populatedBooking = await this.bookingModel
        .findById(bookingPayload._id)
        .populate({
          path: 'tripId',
          populate: [
            { path: 'route.fromLocationId', select: 'name province' },
            { path: 'route.toLocationId', select: 'name province' },
            { path: 'companyId', select: 'name' },
          ],
        })
        .populate('userId', 'name')
        .exec();

      if (!populatedBooking) {
        this.logger.error(
          `Booking with ID ${bookingIdString} not found for notification.`,
        );
        return;
      }

      if (populatedBooking.contactEmail) {
        // await this.mailService.sendBookingCancellationEmail(populatedBooking);
        this.logger.log(
          `(Pretending to) Sent cancellation email for booking ${bookingIdString}`,
        );
      } else {
        this.logger.warn(
          `Booking ${bookingIdString} has no contact email. Skipping email notification.`,
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error(
        `Failed to send cancellation notification for booking ID: ${bookingIdString}`,
        errorMessage,
      );
    }
  }
}
