import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { SeatStatus, TripStatus } from '../trips/schemas/trip.schema';
import { TripsService } from '../trips/trips.service';
import { UsersService } from '../users/users.service';
import { BookingsRepository } from './bookings.repository';
import { BookingsService } from './bookings.service';
import { CreateBookingHoldDto } from './dto/create-booking-hold.dto';
import {
  Booking,
  BookingStatus,
  PaymentStatus,
} from './schemas/booking.schema';

const mockBookingId = new Types.ObjectId();
const mockTripId = new Types.ObjectId();
const mockUserId = new Types.ObjectId();
const mockCompanyId = new Types.ObjectId();

const mockBookingDoc = (mock?: Partial<Booking>) => ({
  _id: mockBookingId,
  tripId: mockTripId,
  companyId: mockCompanyId,
  userId: mockUserId,
  status: BookingStatus.HELD,
  paymentStatus: PaymentStatus.PENDING,
  totalAmount: 200000,
  passengers: [
    { seatNumber: 'A01', price: 200000, name: 'Khach', phone: '0909' },
  ],
  contactName: 'Lien He',
  contactPhone: '0909',
  heldUntil: new Date(Date.now() + 900000),
  ...mock,
  save: jest.fn().mockImplementation(function () {
    return Promise.resolve(this);
  }),
  toObject: jest.fn().mockReturnThis(),
});

const mockTripsService = {
  findOne: jest.fn(),
  updateSeatStatuses: jest.fn(),
};

const mockUsersService = {
  findOneByEmail: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key, defaultVal) => defaultVal || 15),
};

const mockEventEmitter = {
  emit: jest.fn(),
};

const mockBookingsRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  findByCondition: jest.fn(),
  findForLookup: jest.fn(),
  save: jest.fn().mockImplementation((doc) => doc.save()),
  bookingModel: {
    findByIdAndDelete: jest.fn(),
  },
};

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingsRepository: typeof mockBookingsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: BookingsRepository, useValue: mockBookingsRepository },
        { provide: TripsService, useValue: mockTripsService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingsRepository = module.get(BookingsRepository);

    jest.clearAllMocks();
  });

  // ================= TEST CREATE HOLD =================
  describe('createHold', () => {
    const createDto: CreateBookingHoldDto = {
      tripId: mockTripId.toString(),
      passengers: [{ name: 'A', phone: '090', seatNumber: 'A01' }],
      contactName: 'Contact',
      contactPhone: '090',
      contactEmail: 'test@mail.com',
    };

    it('should create a hold successfully', async () => {
      mockTripsService.findOne.mockResolvedValue({
        _id: mockTripId,
        status: TripStatus.SCHEDULED,
        price: 100000,
        companyId: { _id: mockCompanyId },
        seats: [{ seatNumber: 'A01', status: SeatStatus.AVAILABLE }],
      });
      mockUsersService.findOneByEmail.mockResolvedValue({ _id: mockUserId });

      bookingsRepository.create.mockResolvedValue(mockBookingDoc());

      const result = await service.createHold(createDto);

      expect(mockTripsService.findOne).toHaveBeenCalledWith(createDto.tripId);
      expect(bookingsRepository.create).toHaveBeenCalled();
      expect(mockTripsService.updateSeatStatuses).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw Conflict if seat is booked', async () => {
      mockTripsService.findOne.mockResolvedValue({
        _id: mockTripId,
        status: TripStatus.SCHEDULED,
        seats: [{ seatNumber: 'A01', status: SeatStatus.BOOKED }],
      });

      await expect(service.createHold(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // ================= TEST CONFIRM BOOKING =================
  describe('confirmBooking', () => {
    it('should confirm booking successfully', async () => {
      const heldBooking = mockBookingDoc();
      bookingsRepository.findById.mockResolvedValue(heldBooking);
      bookingsRepository.findOne.mockResolvedValue(null);

      const result = await service.confirmBooking(
        mockBookingId.toString(),
        200000,
        'MOMO',
        'TRANS123',
      );

      expect(mockTripsService.updateSeatStatuses).toHaveBeenCalled();
      expect(heldBooking.status).toBe(BookingStatus.CONFIRMED);
      expect(bookingsRepository.save).toHaveBeenCalledWith(heldBooking);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'booking.confirmed',
        expect.anything(),
      );
    });

    it('should throw BadRequest if paid amount is insufficient', async () => {
      const heldBooking = mockBookingDoc({ totalAmount: 500000 });
      bookingsRepository.findById.mockResolvedValue(heldBooking);

      await expect(
        service.confirmBooking(
          mockBookingId.toString(),
          200000,
          'MOMO',
          'TRANS123',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ================= TEST CANCEL BOOKING =================
  describe('cancelBooking', () => {
    it('should cancel booking successfully', async () => {
      const booking = mockBookingDoc({ status: BookingStatus.CONFIRMED });
      bookingsRepository.findById.mockResolvedValue(booking);

      const result = await service.cancelBooking(mockBookingId.toString());

      expect(mockTripsService.updateSeatStatuses).toHaveBeenCalled();
      expect(booking.status).toBe(BookingStatus.CANCELLED);
      expect(bookingsRepository.save).toHaveBeenCalledWith(booking);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'booking.cancelled',
        expect.anything(),
      );
    });

    it('should throw Forbidden if user is not owner', async () => {
      const booking = mockBookingDoc({ userId: new Types.ObjectId() });
      bookingsRepository.findById.mockResolvedValue(booking);

      const user = { _id: mockUserId } as any;

      await expect(
        service.cancelBooking(mockBookingId.toString(), user),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ================= TEST LOOKUP BOOKING =================
  describe('lookupBooking', () => {
    it('should return booking with populated info', async () => {
      const booking = mockBookingDoc();
      bookingsRepository.findForLookup.mockResolvedValue(booking);

      const result = await service.lookupBooking({
        identifier: 'TICKET123',
        contactPhone: '0909',
      });

      expect(bookingsRepository.findForLookup).toHaveBeenCalled();
      expect(result).toHaveProperty('isReviewed');
    });
  });
});
