import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { BookingsService } from '../bookings/bookings.service';
import { TripStatus } from '../trips/schemas/trip.schema';
import { TripsService } from '../trips/trips.service';
import { CreateGuestReviewDto } from './dto/create-guest-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsRepository } from './reviews.repository';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';

const mockReviewId = new Types.ObjectId();
const mockBookingId = new Types.ObjectId();
const mockTripId = new Types.ObjectId();
const mockUserId = new Types.ObjectId();
const mockCompanyId = new Types.ObjectId();

const mockReviewDoc = (mock?: Partial<Review>) => ({
  _id: mockReviewId,
  bookingId: mockBookingId,
  tripId: mockTripId,
  userId: mockUserId,
  rating: 5,
  comment: 'Good',
  createdAt: new Date(),
  editCount: 0,
  ...mock,
  save: jest.fn().mockImplementation(function () {
    return Promise.resolve(this);
  }),
  deleteOne: jest.fn().mockResolvedValue(true),
});

const mockBookingsService = {
  findOne: jest.fn(),
  findOneByCondition: jest.fn(),
};

const mockTripsService = {
  findOne: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key, defaultVal) => defaultVal || 7),
};

const mockReviewsRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findAllPublic: jest.fn(),
  findAllWithDetails: jest.fn(),
  update: jest.fn(),
  save: jest.fn().mockImplementation((doc) => doc.save()),
  delete: jest.fn(),
};

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewsRepository: typeof mockReviewsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: ReviewsRepository, useValue: mockReviewsRepository },
        { provide: BookingsService, useValue: mockBookingsService },
        { provide: TripsService, useValue: mockTripsService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    reviewsRepository = module.get(ReviewsRepository);

    jest.clearAllMocks();
  });

  // ================= TEST CREATE REVIEW (USER) =================
  describe('create', () => {
    const createDto: CreateReviewDto = {
      bookingId: mockBookingId as any,
      tripId: mockTripId as any,
      rating: 5,
      comment: 'Excellent',
    };
    const mockUser = {
      _id: mockUserId.toString(),
      userId: mockUserId.toString(),
      name: 'User',
    } as any;

    it('should create review successfully', async () => {
      const booking = {
        _id: mockBookingId,
        userId: mockUserId,
        tripId: mockTripId,
        reviewId: null,
        save: jest.fn(),
      };
      mockBookingsService.findOne.mockResolvedValue(booking);

      mockTripsService.findOne.mockResolvedValue({
        _id: mockTripId,
        status: TripStatus.ARRIVED,
        companyId: { _id: mockCompanyId },
      });

      reviewsRepository.findOne.mockResolvedValue(null);
      reviewsRepository.create.mockResolvedValue(mockReviewDoc());

      const result = await service.create(createDto, mockUser);

      expect(result).toBeDefined();
      expect(reviewsRepository.create).toHaveBeenCalled();
      expect(booking.save).toHaveBeenCalled();
    });

    it('should throw Conflict if already reviewed', async () => {
      const booking = {
        _id: mockBookingId,
        userId: mockUserId,
        tripId: mockTripId,
      };
      mockBookingsService.findOne.mockResolvedValue(booking);
      mockTripsService.findOne.mockResolvedValue({
        _id: mockTripId,
        status: TripStatus.ARRIVED,
      });

      reviewsRepository.findOne.mockResolvedValue(mockReviewDoc());

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // ================= TEST CREATE GUEST REVIEW =================
  describe('createAsGuest', () => {
    const createGuestDto: CreateGuestReviewDto = {
      bookingId: mockBookingId as any,
      tripId: mockTripId as any,
      rating: 4,
      contactPhone: '0909000111',
    };

    it('should create guest review successfully', async () => {
      const booking = {
        _id: mockBookingId,
        tripId: mockTripId,
        contactPhone: '0909000111',
        contactName: 'Guest',
        save: jest.fn(),
      };
      mockBookingsService.findOneByCondition.mockResolvedValue(booking);
      mockTripsService.findOne.mockResolvedValue({
        _id: mockTripId,
        status: TripStatus.ARRIVED,
        companyId: { _id: mockCompanyId },
      });
      reviewsRepository.findOne.mockResolvedValue(null);
      reviewsRepository.create.mockResolvedValue(mockReviewDoc());

      const result = await service.createAsGuest(createGuestDto);
      expect(result).toBeDefined();
    });
  });

  // ================= TEST UPDATE USER REVIEW =================
  describe('updateUserReview', () => {
    const updateDto = { rating: 3 };
    const mockUser = { _id: mockUserId.toString() } as any;

    it('should update review successfully', async () => {
      const existingReview = mockReviewDoc({
        userId: mockUserId,
        createdAt: new Date(),
      });
      reviewsRepository.findById.mockResolvedValue(existingReview);

      const result = await service.updateUserReview(
        mockReviewId.toString(),
        mockUser,
        updateDto,
      );

      expect(existingReview.rating).toBe(3);
      expect(reviewsRepository.save).toHaveBeenCalledWith(existingReview);
    });
  });

  // ================= TEST FIND ALL =================
  describe('findAll', () => {
    it('should return visible reviews', async () => {
      reviewsRepository.findAllPublic.mockResolvedValue([mockReviewDoc()]);

      await service.findAll({});

      expect(reviewsRepository.findAllPublic).toHaveBeenCalledWith(
        expect.objectContaining({ isVisible: true }),
      );
    });
  });
});
