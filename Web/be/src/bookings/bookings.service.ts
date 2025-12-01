import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FilterQuery, Types } from 'mongoose';
import { AuthenticatedUser } from 'src/auth/strategies/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { SeatStatus, TripStatus } from '../trips/schemas/trip.schema';
import { TripsService } from '../trips/trips.service';
import { UserDocument } from '../users/schemas/user.schema';
import { BookingsRepository } from './bookings.repository'; // Import Repository
import { CreateBookingHoldDto } from './dto/create-booking-hold.dto';
import { LookupBookingDto } from './dto/lookup-booking.dto';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  PassengerInfo,
  PaymentStatus,
} from './schemas/booking.schema';
import { BUSINESS_CONSTANTS } from 'src/common/constants/business.constants';

export interface BookingWithReviewStatus extends BookingDocument {
  isReviewed: boolean;
}

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly bookingsRepository: BookingsRepository, // Sử dụng Repository
    private readonly tripsService: TripsService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Bước 1: Giữ chỗ (Hold)
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

    // Validate ghế
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
          // Kiểm tra xem booking giữ chỗ còn tồn tại không
          const holdingBooking = await this.bookingsRepository.findById(
            seat.bookingId,
          );
          if (holdingBooking) {
            throw new ConflictException(
              `Ghế ${seatNumber} đang được giữ bởi một người khác.`,
            );
          }
        }
      }
    }

    let bookingUserId = user?._id;
    if (!bookingUserId && createDto.contactEmail) {
      const potentialUser = await this.usersService.findOneByEmail(
        createDto.contactEmail,
      );
      if (potentialUser) {
        bookingUserId = potentialUser._id;
        this.logger.log(
          `Guest booking by ${createDto.contactEmail} linked to existing user ID: ${potentialUser._id}`,
        );
      }
    }

    const totalAmount = trip.price * seatNumbersToHold.length;

    const passengersWithPrice: PassengerInfo[] = createDto.passengers.map(
      (p) => ({
        ...p,
        price: trip.price,
      }),
    );

    const holdDurationMinutes = this.configService.get<number>(
      'SEAT_HOLD_DURATION_MINUTES',
      BUSINESS_CONSTANTS.BOOKING.SEAT_HOLD_DURATION_MINUTES,
    );
    
    const heldUntil = new Date(Date.now() + holdDurationMinutes * 60 * 1000);

    const bookingData: Partial<Booking> = {
      userId: bookingUserId,
      tripId: new Types.ObjectId(createDto.tripId),
      companyId: trip.companyId._id,
      status: BookingStatus.HELD,
      paymentStatus: PaymentStatus.PENDING,
      heldUntil,
      totalAmount,
      passengers: passengersWithPrice,
      contactName: createDto.contactName,
      contactPhone: createDto.contactPhone,
      contactEmail: createDto.contactEmail,
    };

    let savedBooking: BookingDocument;

    // 1. Tạo Booking trong DB trước
    try {
      savedBooking = await this.bookingsRepository.create(bookingData);
    } catch (error) {
      this.logger.error('Failed to create booking document', error);
      throw new InternalServerErrorException('Lỗi khi khởi tạo đơn hàng.');
    }

    // 2. Cố gắng cập nhật trạng thái ghế sang HELD
    try {
      await this.tripsService.updateSeatStatuses(
        trip._id,
        seatNumbersToHold,
        SeatStatus.HELD,
        savedBooking._id,
      );
      return savedBooking;
    } catch (error) {
      this.logger.error('Error holding seats, rolling back booking:', error);

      // ROLLBACK: Nếu giữ ghế thất bại, phải xóa Booking vừa tạo để tránh rác
      // Dùng ép kiểu any để truy cập model hoặc bạn có thể thêm hàm delete vào BookingsRepository
      const model = (this.bookingsRepository as any).bookingModel;
      if (model && model.findByIdAndDelete) {
        await model.findByIdAndDelete(savedBooking._id);
      }

      // Cố gắng nhả ghế (phòng trường hợp updateSeatStatuses chạy được một nửa)
      try {
        await this.tripsService.updateSeatStatuses(
          trip._id,
          seatNumbersToHold,
          SeatStatus.AVAILABLE,
        );
      } catch (releaseError) {
        this.logger.warn(
          'Failed to explicit release seats during rollback',
          releaseError,
        );
      }

      throw new InternalServerErrorException(
        'Lỗi khi giữ chỗ. Vui lòng thử lại.',
      );
    }
  }

  /**
   * Bước 2: Xác nhận thanh toán (Confirm)
   */
  async confirmBooking(
    bookingId: string,
    paidAmount: number,
    paymentMethod: string,
    transactionDateTime: string,
  ): Promise<BookingDocument> {
    const booking = await this.bookingsRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt vé.');
    }

    if (booking.status === BookingStatus.CONFIRMED) {
      this.logger.warn(`Booking ${bookingId} is already confirmed. Skipping.`);
      return booking;
    }

    if (booking.status !== BookingStatus.HELD) {
      throw new BadRequestException(
        'Chỉ có thể xác nhận đơn đặt vé đang ở trạng thái giữ chỗ.',
      );
    }

    if (paidAmount < booking.totalAmount) {
      throw new BadRequestException(
        `Số tiền thanh toán (${paidAmount}) không khớp với tổng tiền đơn hàng (${booking.totalAmount}).`,
      );
    }

    const seatNumbers = booking.passengers.map((p) => p.seatNumber);

    try {
      const tripIdAsObjectId = new Types.ObjectId(booking.tripId);

      // Cập nhật trạng thái ghế sang BOOKED
      await this.tripsService.updateSeatStatuses(
        tripIdAsObjectId,
        seatNumbers,
        SeatStatus.BOOKED,
        booking._id,
      );

      // Cập nhật thông tin Booking
      booking.status = BookingStatus.CONFIRMED;
      booking.paymentStatus = PaymentStatus.PAID;
      booking.paymentMethod = paymentMethod;
      booking.heldUntil = undefined;
      booking.ticketCode = await this.generateTicketCode();
      booking.paymentGatewayTransactionId = transactionDateTime;

      const savedBooking = await this.bookingsRepository.save(booking);

      this.eventEmitter.emit('booking.confirmed', savedBooking);

      return savedBooking;
    } catch (error) {
      this.logger.error(`Error confirming booking ${bookingId}:`, error);
      throw new InternalServerErrorException('Lỗi khi xác nhận đơn đặt vé.');
    }
  }

  /**
   * Hủy vé (User hoặc Admin)
   */
  async cancelBooking(
    bookingId: string,
    user?: UserDocument,
  ): Promise<BookingDocument> {
    const booking = await this.findOne(bookingId, user);

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

    // Nhả ghế
    await this.tripsService.updateSeatStatuses(
      booking.tripId,
      seatNumbers,
      SeatStatus.AVAILABLE,
    );

    booking.status = BookingStatus.CANCELLED;

    const savedBooking = await this.bookingsRepository.save(booking);
    this.eventEmitter.emit('booking.cancelled', savedBooking);

    return savedBooking;
  }

  /**
   * Tra cứu vé (Lookup)
   */
  async lookupBooking(
    lookupDto: LookupBookingDto,
  ): Promise<BookingWithReviewStatus> {
    const { identifier, contactPhone } = lookupDto;

    const query: FilterQuery<Booking> = {
      contactPhone: contactPhone,
    };

    if (Types.ObjectId.isValid(identifier)) {
      query.$or = [{ _id: identifier }, { ticketCode: identifier }];
    } else {
      query.ticketCode = identifier;
    }

    // Sử dụng hàm chuyên biệt của Repository để populate sâu
    const booking = await this.bookingsRepository.findForLookup(query);

    if (!booking)
      throw new NotFoundException('Không tìm thấy thông tin đặt vé phù hợp.');

    const bookingObject = booking.toObject();
    const result = bookingObject as BookingWithReviewStatus;
    result.isReviewed = !!result.reviewId;

    return result;
  }

  public async generateTicketCode(length = 8): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    while (true) {
      result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const existing = await this.bookingsRepository.findOne({
        ticketCode: result,
      });
      if (!existing) {
        break;
      }
    }
    return result;
  }

  async findOne(
    id: string | Types.ObjectId,
    user?: AuthenticatedUser | UserDocument,
  ): Promise<BookingDocument> {
    const booking = await this.bookingsRepository.findById(id);

    if (!booking) {
      throw new NotFoundException(
        `Không tìm thấy đơn đặt vé với ID: ${id.toString()}`,
      );
    }

    if (user && booking.userId) {
      if (user._id.toString() !== booking.userId.toString()) {
        throw new ForbiddenException(
          'Bạn không có quyền truy cập đơn đặt vé này.',
        );
      }
    }
    return booking;
  }

  async findOneByCondition(
    condition: FilterQuery<Booking>,
  ): Promise<BookingDocument | null> {
    return this.bookingsRepository.findByCondition(condition);
  }
}
