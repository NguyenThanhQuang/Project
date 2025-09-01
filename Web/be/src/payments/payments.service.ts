import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import PayOS from '@payos/node';
import * as crypto from 'crypto';
import { Connection, Model } from 'mongoose';
import { SeatStatus, Trip, TripDocument } from 'src/trips/schemas/trip.schema';
import { BookingsService } from '../bookings/bookings.service';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  PaymentStatus,
} from '../bookings/schemas/booking.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { PayOSWebhookDto } from './dto/payos-webhook.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly payOS: PayOS;
  private readonly publicUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly bookingsService: BookingsService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.payOS = new PayOS(
      this.configService.getOrThrow<string>('PAYOS_CLIENT_ID'),
      this.configService.getOrThrow<string>('PAYOS_API_KEY'),
      this.configService.getOrThrow<string>('PAYOS_CHECKSUM_KEY'),
    );
    this.publicUrl = this.configService.getOrThrow<string>('CLIENT_URL');
  }

  async createPaymentLink(
    createPaymentLinkDto: CreatePaymentLinkDto,
    user?: UserDocument,
  ): Promise<any> {
    const { bookingId } = createPaymentLinkDto;
    this.logger.log(`Tạo link thanh toán cho booking: ${bookingId.toString()}`);

    const booking = await this.bookingsService.findOne(bookingId, user);
    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt vé.');
    }

    // Chỉ kiểm tra quyền sở hữu nếu đây là booking của một người dùng đã đăng nhập
    if (booking.userId && user) {
      if (booking.userId.toString() !== user._id.toString()) {
        throw new ForbiddenException(
          'Bạn không có quyền thanh toán cho đơn đặt vé này.',
        );
      }
    }

    if (booking.status !== BookingStatus.HELD) {
      throw new BadRequestException(
        'Chỉ có thể thanh toán cho đơn hàng đang ở trạng thái "giữ chỗ".',
      );
    }

    if (!booking.heldUntil) {
      this.logger.error(
        `Booking ${booking._id.toString()} ở trạng thái HELD nhưng thiếu heldUntil.`,
      );
      throw new InternalServerErrorException(
        'Lỗi hệ thống: Không thể xác định thời gian hết hạn của đơn hàng.',
      );
    }

    const orderCode = parseInt(
      `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(0, 15),
    );
    booking.paymentOrderCode = orderCode;
    await booking.save();

    const expirationTimestamp = Math.floor(booking.heldUntil.getTime() / 1000);

    const paymentData = {
      orderCode,
      amount: booking.totalAmount,
      description: `TT ve xe ${booking.paymentOrderCode}`,
      returnUrl: `${this.publicUrl}${this.configService.get<string>('CLIENT_PAYMENT_SUCCESS_PATH')}?bookingId=${booking._id.toString()}`,
      cancelUrl: `${this.publicUrl}${this.configService.get<string>('CLIENT_PAYMENT_CANCEL_PATH')}?bookingId=${booking._id.toString()}`,
      expiredAt: expirationTimestamp,
    };

    try {
      const paymentLink = await this.payOS.createPaymentLink(paymentData);
      this.logger.log(`Tạo link thành công cho orderCode: ${orderCode}`);
      return paymentLink;
    } catch (error) {
      this.logger.error('Lỗi khi tạo link thanh toán PayOS:', error);
      throw new InternalServerErrorException('Không thể tạo link thanh toán.');
    }
  }

  logVerificationAttempt(): void {
    this.logger.log('PayOS is attempting to verify the webhook URL.');
  }

  async handleWebhook(webhookPayload: PayOSWebhookDto): Promise<void> {
    if (!webhookPayload || !webhookPayload.data || !webhookPayload.signature) {
      this.logger.log(
        'Received a webhook test/verification request. Responding successfully.',
      );
      return;
    }

    const { data, signature } = webhookPayload;
    const orderCode = data.orderCode;

    const checksumKey = this.configService.get<string>('PAYOS_CHECKSUM_KEY');
    if (!checksumKey) {
      this.logger.error(
        'CRITICAL: PAYOS_CHECKSUM_KEY is not configured. Webhook cannot be verified.',
      );
      return;
    }

    const sortedDataKeys = Object.keys(data).sort();
    let dataToSign = '';
    for (const key of sortedDataKeys) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        dataToSign += `${key}=${data[key]}&`;
      }
    }
    dataToSign = dataToSign.slice(0, -1);

    const generatedSignature = crypto
      .createHmac('sha256', checksumKey)
      .update(dataToSign)
      .digest('hex');

    if (generatedSignature !== signature) {
      this.logger.warn(
        `Webhook signature mismatch for orderCode: ${orderCode}. The request may be fraudulent.`,
      );
      return;
    }

    this.logger.log(
      `Webhook for orderCode ${orderCode} signature verified successfully.`,
    );

    // Kiểm tra trạng thái giao dịch
    if (data.code !== '00') {
      this.logger.log(
        `Webhook for order ${orderCode} has a non-successful status code: ${data.code}. Skipping.`,
      );
      return;
    }

    // Xử lý logic nghiệp vụ
    try {
      const booking = await this.bookingModel
        .findOne({ paymentOrderCode: orderCode })
        .exec();

      if (!booking) {
        this.logger.error(
          `Booking with paymentOrderCode ${orderCode} not found in the database.`,
        );
        return;
      }

      // Ngăn chặn việc xử lý lại webhook đã xử lý thành công
      if (booking.status === BookingStatus.CONFIRMED) {
        this.logger.log(
          `Booking ${booking._id.toString()} is already confirmed. Skipping duplicate webhook.`,
        );
        return;
      }

      // Gọi service để xác nhận booking
      await this.bookingsService.confirmBooking(
        booking._id.toString(),
        data.amount,
        'PayOS',
        data.transactionDateTime,
      );

      this.logger.log(
        `Successfully confirmed booking ${booking._id.toString()} for orderCode ${orderCode} via webhook.`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing webhook's business logic for orderCode ${orderCode}:`,
        error,
      );
      // Cân nhắc ném lỗi ra để một hệ thống monitoring nào đó bắt được
    }
  }
  private async processSuccessfulPayment(orderCode: number): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const booking = await this.bookingModel
        .findOne({ paymentOrderCode: orderCode })
        .session(session);
      if (!booking) {
        throw new NotFoundException(
          `Không tìm thấy booking với orderCode: ${orderCode}`,
        );
      }
      if (booking.status === BookingStatus.CONFIRMED) {
        this.logger.log(
          `Booking ${booking._id.toString()} đã được xác nhận trước đó. Bỏ qua.`,
        );
        await session.commitTransaction();
        return;
      }

      const trip = await this.tripModel
        .findById(booking.tripId)
        .session(session);
      if (!trip) {
        throw new NotFoundException(
          `Không tìm thấy chuyến đi ${booking.tripId.toString()}`,
        );
      }

      const seatNumbers = booking.passengers.map((p) => p.seatNumber);
      trip.seats.forEach((seat) => {
        if (seatNumbers.includes(seat.seatNumber)) {
          seat.status = SeatStatus.BOOKED;
        }
      });
      await trip.save({ session });

      booking.status = BookingStatus.CONFIRMED;
      booking.paymentStatus = PaymentStatus.PAID;
      booking.paymentMethod = 'payOS';
      booking.heldUntil = undefined;
      booking.ticketCode = await this.bookingsService.generateTicketCode();
      if (!booking.paymentOrderCode) {
        throw new InternalServerErrorException(
          `Booking ${booking._id.toString()} thiếu paymentOrderCode khi xử lý webhook.`,
        );
      }
      booking.paymentGatewayTransactionId = booking.paymentOrderCode.toString();

      const savedBooking = await booking.save({ session });

      await session.commitTransaction();
      this.logger.log(
        `Xác nhận booking ${savedBooking._id.toString()} thành công!`,
      );
      this.eventEmitter.emit('booking.confirmed', savedBooking.toObject());
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(
        `Lỗi khi xử lý thanh toán cho orderCode ${orderCode}:`,
        error,
      );
      throw new InternalServerErrorException(
        'Lỗi khi xử lý xác nhận thanh toán.',
      );
    } finally {
      await session.endSession();
    }
  }
}
