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
import { WebhookType } from '@payos/node/lib/type';
import { Connection, Model } from 'mongoose';
import { BookingsService } from '../bookings/bookings.service';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  PaymentStatus,
} from '../bookings/schemas/booking.schema';
import { SeatStatus, Trip, TripDocument } from '../trips/schemas/trip.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';

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
    user: UserDocument,
  ): Promise<any> {
    const { bookingId } = createPaymentLinkDto;
    this.logger.log(`Tạo link thanh toán cho booking: ${bookingId.toString()}`);

    const booking = await this.bookingsService.findOne(bookingId, user);
    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt vé.');
    }
    if (booking.userId?.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'Bạn không có quyền thanh toán cho đơn này.',
      );
    }
    if (booking.status !== BookingStatus.HELD) {
      throw new BadRequestException(
        'Chỉ có thể thanh toán cho đơn hàng đang ở trạng thái "giữ chỗ".',
      );
    }

    const orderCode = parseInt(
      `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(0, 15),
    );
    booking.paymentOrderCode = orderCode;
    await booking.save();

    const paymentData = {
      orderCode,
      amount: booking.totalAmount,
      description: `Thanh toán vé xe cho mã đặt chỗ ${booking._id.toString()}`,
      returnUrl: `${this.publicUrl}${this.configService.get<string>('CLIENT_PAYMENT_SUCCESS_PATH')}?bookingId=${booking._id.toString()}`,
      cancelUrl: `${this.publicUrl}${this.configService.get<string>('CLIENT_PAYMENT_CANCEL_PATH')}?bookingId=${booking._id.toString()}`,
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

  async handleWebhook(webhookData: any): Promise<void> {
    this.logger.log('Nhận được webhook từ PayOS');
    try {
      const verifiedData: WebhookType =
        this.payOS.verifyPaymentWebhookData(webhookData);

      this.logger.log('Webhook đã được xác thực thành công.');

      if (verifiedData.code === '00' && verifiedData.data?.status === 'PAID') {
        const orderCode = verifiedData.data.orderCode;
        this.logger.log(
          `Xử lý thanh toán thành công cho orderCode: ${orderCode}`,
        );
        await this.processSuccessfulPayment(orderCode);
      } else {
        this.logger.warn(
          `Webhook không ở trạng thái PAID. Bỏ qua. Status: ${verifiedData.data?.status}`,
        );
      }
    } catch (error) {
      this.logger.error(
        'LỖI BẢO MẬT: Webhook từ PayOS không hợp lệ!',
        (error as Error).message,
      );
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
