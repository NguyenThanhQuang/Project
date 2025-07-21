import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { SeatStatus, TripStatus } from '../trips/schemas/trip.schema';
import { TripsService } from '../trips/trips.service';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateBookingHoldDto } from './dto/create-booking-hold.dto';
import { LookupBookingDto } from './dto/lookup-booking.dto';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  PassengerInfo,
  PaymentStatus,
} from './schemas/booking.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private readonly tripsService: TripsService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Bước 1: Giữ chỗ
   * Tạo một booking tạm thời và cập nhật trạng thái ghế trên chuyến đi.
   */
  async createHold(
    createDto: CreateBookingHoldDto,
    user?: UserDocument, // User có thể không đăng nhập
  ): Promise<BookingDocument> {
    const trip = await this.tripsService.findOne(createDto.tripId);
    if (!trip) throw new NotFoundException('Không tìm thấy chuyến đi.');
    if (trip.status !== TripStatus.SCHEDULED) {
      throw new BadRequestException(
        'Chuyến đi không ở trạng thái có thể đặt vé.',
      );
    }

    const seatNumbersToHold = createDto.passengers.map((p) => p.seatNumber);
    if (new Set(seatNumbersToHold).size !== seatNumbersToHold.length) {
      throw new BadRequestException(
        'Không thể đặt trùng một ghế trong cùng một yêu cầu.',
      );
    }

    // Kiểm tra tính khả dụng của ghế và xử lý Lazy Check
    for (const seatNumber of seatNumbersToHold) {
      const seat = trip.seats.find((s) => s.seatNumber === seatNumber);
      if (!seat) {
        throw new ConflictException(
          `Ghế ${seatNumber} không tồn tại trên chuyến đi này.`,
        );
      }

      if (seat.status === SeatStatus.BOOKED) {
        throw new ConflictException(`Ghế ${seatNumber} đã được đặt.`);
      }

      if (seat.status === SeatStatus.HELD) {
        if (seat.bookingId) {
          const holdingBooking = await this.bookingModel
            .findById(seat.bookingId)
            .exec();
          if (holdingBooking) {
            throw new ConflictException(
              `Ghế ${seatNumber} đang được giữ bởi một người khác.`,
            );
          }
          // Nếu không tìm thấy holdingBooking (đã bị TTL xóa), ghế này hợp lệ để đặt.
          // Ta sẽ cho phép đi tiếp, ghế sẽ được ghi đè bởi booking mới.
        }
      }
    }

    const totalAmount = trip.price * seatNumbersToHold.length;

    const passengersWithPrice: PassengerInfo[] = createDto.passengers.map(
      (p) => ({
        ...p,
        price: trip.price,
      }),
    );

    // Tính thời gian hết hạn giữ chỗ
    const holdDurationMinutes = this.configService.get<number>(
      'SEAT_HOLD_DURATION_MINUTES',
      15,
    );
    const heldUntil = new Date(Date.now() + holdDurationMinutes * 60 * 1000);

    const newBooking = new this.bookingModel({
      userId: user?._id,
      tripId: createDto.tripId,
      companyId: trip.companyId,
      status: BookingStatus.HELD,
      paymentStatus: PaymentStatus.PENDING,
      heldUntil,
      totalAmount,
      passengers: passengersWithPrice,
      contactName: createDto.contactName,
      contactPhone: createDto.contactPhone,
      contactEmail: createDto.contactEmail,
    });

    try {
      // Cập nhật trạng thái ghế, truyền vào bookingId
      await this.tripsService.updateSeatStatuses(
        trip._id,
        seatNumbersToHold,
        SeatStatus.HELD,
        newBooking._id,
      );
      return await newBooking.save();
    } catch (error) {
      // Nếu có lỗi, cố gắng giải phóng lại ghế (rollback)
      console.error('Error creating hold, attempting to release seats:', error);
      await this.tripsService.updateSeatStatuses(
        trip._id,
        seatNumbersToHold,
        SeatStatus.AVAILABLE,
        newBooking._id,
      );
      throw new InternalServerErrorException(
        'Lỗi khi giữ chỗ. Vui lòng thử lại.',
      );
    }
  }

  /**
   * Bước 2 (Giả lập): Xác nhận thanh toán và hoàn tất booking
   */
  async confirmBooking(bookingId: string): Promise<BookingDocument> {
    const booking = await this.bookingModel.findById(bookingId).exec();
    if (!booking) throw new NotFoundException('Không tìm thấy đơn đặt vé.');
    if (booking.status !== BookingStatus.HELD) {
      throw new BadRequestException(
        'Chỉ có thể xác nhận đơn đặt vé đang ở trạng thái giữ chỗ.',
      );
    }

    const seatNumbers = booking.passengers.map((p) => p.seatNumber);

    try {
      await this.tripsService.updateSeatStatuses(
        booking.tripId,
        seatNumbers,
        SeatStatus.BOOKED,
        booking._id,
      );

      booking.status = BookingStatus.CONFIRMED;
      booking.paymentStatus = PaymentStatus.PAID;
      booking.paymentMethod = 'mock_payment'; // Đánh dấu là thanh toán giả lập
      booking.heldUntil = undefined; // Xóa thời gian hết hạn để TTL index không ảnh hưởng
      booking.ticketCode = await this.generateTicketCode();
      booking.paymentGatewayTransactionId = `MOCK_${Date.now()}`;

      return await booking.save();
    } catch (error) {
      console.error('Error confirming booking:', error);
      // Cân nhắc logic rollback nếu cần (ví dụ: chuyển ghế về lại HELD)
      throw new InternalServerErrorException('Lỗi khi xác nhận đơn đặt vé.');
    }
  }

  /**
   * Hủy một booking (do người dùng hoặc admin)
   */
  async cancelBooking(
    bookingId: string,
    user?: UserDocument,
  ): Promise<BookingDocument> {
    const booking = await this.bookingModel.findById(bookingId).exec();
    if (!booking) throw new NotFoundException('Không tìm thấy đơn đặt vé.');

    if (
      user &&
      booking.userId &&
      user._id.toString() !== booking.userId.toString()
    ) {
      throw new ForbiddenException('Bạn không có quyền hủy đơn đặt vé này.');
    }

    if (
      booking.status !== BookingStatus.HELD &&
      booking.status !== BookingStatus.CONFIRMED
    ) {
      throw new BadRequestException(
        'Không thể hủy đơn đặt vé ở trạng thái này.',
      );
    }

    const seatNumbers = booking.passengers.map((p) => p.seatNumber);
    await this.tripsService.updateSeatStatuses(
      booking.tripId,
      seatNumbers,
      SeatStatus.AVAILABLE,
    );

    booking.status = BookingStatus.CANCELLED;
    // Cân nhắc logic hoàn tiền "ở đây"
    return await booking.save();
  }

  /**
   * Tra cứu thông tin booking
   */
  async lookupBooking(lookupDto: LookupBookingDto): Promise<BookingDocument> {
    const query: FilterQuery<Booking> = {};
    if (lookupDto.ticketCode) {
      query.ticketCode = lookupDto.ticketCode;
    } else if (lookupDto.bookingId) {
      query._id = lookupDto.bookingId; //as any dto string
      query.contactPhone = lookupDto.contactPhone; // Thêm điều kiện an toàn
    } else {
      throw new BadRequestException(
        'Cần cung cấp mã vé hoặc ID đơn đặt vé để tra cứu.',
      );
    }

    const booking = await this.bookingModel
      .findOne(query)
      .populate({
        path: 'tripId',
        populate: [
          { path: 'companyId', select: 'name logoUrl' },
          { path: 'route.fromLocationId', select: 'name fullAddress' },
          { path: 'route.toLocationId', select: 'name fullAddress' },
        ],
      })
      .select('-paymentGatewayTransactionId')
      .exec();

    if (!booking)
      throw new NotFoundException('Không tìm thấy thông tin đặt vé phù hợp.');
    return booking;
  }

  private async generateTicketCode(length = 8): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    while (true) {
      result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const existing = await this.bookingModel
        .findOne({ ticketCode: result })
        .exec();
      if (!existing) {
        break;
      }
    }
    return result;
  }
}
