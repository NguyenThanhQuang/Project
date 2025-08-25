import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
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
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Bước 1: Giữ chỗ
   * Tạo một booking tạm thời và cập nhật trạng thái ghế trên chuyến đi.
   */
  async createHold(
    createDto: CreateBookingHoldDto,
    user?: UserDocument,
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
      companyId: trip.companyId._id,
      //companyId: trip.companyId,
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
      await this.tripsService.updateSeatStatuses(
        trip._id,
        seatNumbersToHold,
        SeatStatus.HELD,
        newBooking._id,
      );
      return await newBooking.save();
    } catch (error) {
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
  async confirmBooking(
    bookingId: string,
    paidAmount: number,
    paymentMethod: string,
    transactionDateTime: string,
  ): Promise<BookingDocument> {
    const booking = await this.findOne(bookingId);
    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt vé.');
    }

    // Kiểm tra xem booking đã được xử lý chưa để tránh webhook xử lý 2 lần
    if (booking.status === BookingStatus.CONFIRMED) {
      this.logger.warn(`Booking ${bookingId} is already confirmed. Skipping.`);
      return booking;
    }

    // Chỉ xác nhận các booking đang ở trạng thái giữ chỗ
    if (booking.status !== BookingStatus.HELD) {
      throw new BadRequestException(
        'Chỉ có thể xác nhận đơn đặt vé đang ở trạng thái giữ chỗ.',
      );
    }

    // Kiểm tra số tiền thanh toán có khớp không
    if (paidAmount < booking.totalAmount) {
      throw new BadRequestException(
        `Số tiền thanh toán (${paidAmount}) không khớp với tổng tiền đơn hàng (${booking.totalAmount}).`,
      );
    }

    const seatNumbers = booking.passengers.map((p) => p.seatNumber);

    try {
      // Cập nhật trạng thái ghế trong chuyến đi thành 'booked'
      await this.tripsService.updateSeatStatuses(
        booking.tripId,
        seatNumbers,
        SeatStatus.BOOKED,
        booking._id,
      );

      // Cập nhật thông tin booking
      booking.status = BookingStatus.CONFIRMED;
      booking.paymentStatus = PaymentStatus.PAID;
      booking.paymentMethod = paymentMethod;
      booking.heldUntil = undefined; // Xóa thời gian hết hạn giữ chỗ
      booking.ticketCode = await this.generateTicketCode();
      booking.paymentGatewayTransactionId = transactionDateTime; // Lưu thời gian giao dịch

      const savedBooking = await booking.save();

      // Phát sự kiện để gửi email xác nhận
      this.eventEmitter.emit('booking.confirmed', savedBooking);

      return savedBooking;
    } catch (error) {
      this.logger.error(`Error confirming booking ${bookingId}:`, error);
      // Cân nhắc thêm logic rollback (trả ghế về AVAILABLE) nếu cần
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
    const booking = await this.findOne(bookingId, user);
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

    const savedBooking = await booking.save();
    this.eventEmitter.emit('booking.cancelled', savedBooking);

    // Cân nhắc logic hoàn tiền "ở đây"
    return savedBooking;
  }

  /**
   * Tra cứu thông tin booking
   */
  async lookupBooking(lookupDto: LookupBookingDto): Promise<BookingDocument> {
    const query: FilterQuery<Booking> = {};
    if (lookupDto.ticketCode) {
      query.ticketCode = lookupDto.ticketCode;
    } else if (lookupDto.bookingId) {
      query._id = lookupDto.bookingId;
      query.contactPhone = lookupDto.contactPhone;
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

  public async generateTicketCode(length = 8): Promise<string> {
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
  /**
   * Hàm này dành cho việc tra cứu nội bộ giữa các service, bỏ qua kiểm tra quyền.
   * Chỉ nên được gọi từ các service đáng tin cậy khác như ReviewsService.
   */
  async findOne(
    id: string | Types.ObjectId,
    user?: UserDocument,
  ): Promise<BookingDocument> {
    const booking = await this.bookingModel.findById(id).exec();

    if (!booking) {
      throw new NotFoundException(
        `Không tìm thấy đơn đặt vé với ID: ${id.toString()}`,
      );
    }

    // Nếu có user được truyền vào, thực hiện kiểm tra quyền
    if (
      user &&
      booking.userId &&
      user._id.toString() !== booking.userId.toString()
    ) {
      // Chỉ kiểm tra quyền nếu booking này có userId (không phải guest booking)
      throw new ForbiddenException(
        'Bạn không có quyền truy cập đơn đặt vé này.',
      );
    }

    return booking;
  }
  async findOneByCondition(
    condition: FilterQuery<Booking>,
  ): Promise<BookingDocument | null> {
    return this.bookingModel.findOne(condition).exec();
  }
}
