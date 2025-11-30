import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { FilterQuery, Types } from 'mongoose';
import { AuthenticatedUser } from 'src/auth/strategies/jwt.strategy';
import { TripStatus } from 'src/trips/schemas/trip.schema';
import { BookingsService } from '../bookings/bookings.service';
import { TripsService } from '../trips/trips.service';
import { CreateGuestReviewDto } from './dto/create-guest-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { UpdateUserReviewDto } from './dto/update-user-review.dto';
import { ReviewsRepository } from './reviews.repository';
import { ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly bookingsService: BookingsService,
    private readonly tripsService: TripsService,
    private readonly configService: ConfigService,
  ) {}

  private async validateAndPrepareReview(bookingId: any, tripId: any) {
    const booking = await this.bookingsService.findOneByCondition({
      _id: bookingId,
    });
    if (!booking) throw new NotFoundException('Không tìm thấy đơn đặt vé.');

    const trip = await this.tripsService.findOne(tripId.toString());
    if (booking.tripId.toString() !== trip._id.toString()) {
      throw new BadRequestException('Đơn đặt vé không thuộc chuyến đi này.');
    }
    if (trip.status !== TripStatus.ARRIVED) {
      throw new BadRequestException(
        'Chỉ có thể đánh giá chuyến đi đã hoàn thành.',
      );
    }
    const existingReview = await this.reviewsRepository.findOne({ bookingId });
    if (existingReview) {
      throw new ConflictException('Bạn đã đánh giá cho chuyến đi này rồi.');
    }
    return { booking, trip };
  }

  async create(
    createReviewDto: CreateReviewDto,
    user: AuthenticatedUser,
  ): Promise<ReviewDocument> {
    const { bookingId, tripId, rating, comment, isAnonymous } = createReviewDto;

    const booking = await this.bookingsService.findOne(bookingId, user);
    const trip = await this.tripsService.findOne(
      createReviewDto.tripId.toString(),
    );

    if (!booking.userId) {
      throw new ForbiddenException(
        'Booking này không thuộc về tài khoản của bạn. Vui lòng sử dụng chức năng tra cứu vé để đánh giá.',
      );
    }

    if (booking.userId.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'Bạn không có quyền đánh giá đơn đặt vé này.',
      );
    }

    if (trip.status !== TripStatus.ARRIVED) {
      throw new BadRequestException(
        'Chỉ có thể đánh giá chuyến đi đã hoàn thành.',
      );
    }

    const existingReview = await this.reviewsRepository.findOne({ bookingId });
    if (existingReview) {
      throw new ConflictException('Bạn đã đánh giá cho chuyến đi này rồi.');
    }

    const newReviewData = {
      userId: new Types.ObjectId(user.userId),
      tripId: new Types.ObjectId(tripId),
      bookingId: new Types.ObjectId(bookingId),
      companyId: trip.companyId._id,
      rating,
      comment,
      isAnonymous: isAnonymous || false,
      displayName: createReviewDto.isAnonymous
        ? user.name.charAt(0).toUpperCase()
        : user.name,
    };

    const savedReview = await this.reviewsRepository.create(newReviewData);

    booking.reviewId = savedReview._id;
    await booking.save();

    return savedReview;
  }

  async createAsGuest(
    createGuestReviewDto: CreateGuestReviewDto,
  ): Promise<ReviewDocument> {
    const { bookingId, tripId, rating, comment, isAnonymous, contactPhone } =
      createGuestReviewDto;

    const { booking, trip } = await this.validateAndPrepareReview(
      bookingId,
      tripId,
    );

    if (booking.contactPhone !== contactPhone) {
      throw new ForbiddenException('Số điện thoại không khớp với đơn đặt vé.');
    }

    const newReviewData = {
      tripId: new Types.ObjectId(tripId),
      bookingId: new Types.ObjectId(bookingId),
      companyId: trip.companyId._id,
      rating,
      comment,
      isAnonymous: isAnonymous || false,
      displayName: isAnonymous
        ? booking.contactName.charAt(0).toUpperCase()
        : booking.contactName,
    };

    const savedReview = await this.reviewsRepository.create(newReviewData);

    booking.reviewId = savedReview._id;
    await booking.save();

    return savedReview;
  }

  async updateUserReview(
    id: string,
    user: AuthenticatedUser,
    updateUserReviewDto: UpdateUserReviewDto,
  ): Promise<ReviewDocument> {
    const review = await this.findOne(id);

    if (review.userId?.toString() !== user._id.toString()) {
      throw new ForbiddenException('Bạn không có quyền sửa đánh giá này.');
    }
    if (review.editCount > 0) {
      throw new ForbiddenException(
        'Bạn chỉ có thể sửa đánh giá một lần duy nhất.',
      );
    }

    const editWindowDays = this.configService.get<number>(
      'REVIEW_EDIT_WINDOW_DAYS',
      7,
    );
    if (dayjs().diff(dayjs(review.createdAt), 'day') > editWindowDays) {
      throw new ForbiddenException(
        `Bạn chỉ có thể sửa đánh giá trong vòng ${editWindowDays} ngày sau khi đăng.`,
      );
    }

    Object.assign(review, updateUserReviewDto);
    review.editCount += 1;
    review.lastEditedAt = new Date();

    return this.reviewsRepository.save(review);
  }

  async findAll(queryDto: QueryReviewDto): Promise<ReviewDocument[]> {
    const query: FilterQuery<ReviewDocument> = { isVisible: true };

    if (queryDto.companyId && Types.ObjectId.isValid(queryDto.companyId)) {
      query.companyId = new Types.ObjectId(queryDto.companyId);
    }
    if (queryDto.tripId && Types.ObjectId.isValid(queryDto.tripId)) {
      query.tripId = new Types.ObjectId(queryDto.tripId);
    }
    if (queryDto.userId && Types.ObjectId.isValid(queryDto.userId)) {
      query.userId = new Types.ObjectId(queryDto.userId);
    }
    if (queryDto.rating) query.rating = queryDto.rating;

    return this.reviewsRepository.findAllPublic(query);
  }

  async findAllForAdmin(queryDto: QueryReviewDto): Promise<ReviewDocument[]> {
    const query: FilterQuery<ReviewDocument> = {};

    if (queryDto.companyId && Types.ObjectId.isValid(queryDto.companyId)) {
      query.companyId = new Types.ObjectId(queryDto.companyId);
    }

    return this.reviewsRepository.findAllWithDetails(query);
  }

  async findOne(id: string): Promise<ReviewDocument> {
    const review = await this.reviewsRepository.findById(id);
    if (!review) {
      throw new NotFoundException(`Không tìm thấy đánh giá với ID: ${id}`);
    }
    return review;
  }

  async updateVisibility(
    id: string,
    isVisible: boolean,
  ): Promise<ReviewDocument> {
    const review = await this.reviewsRepository.update(id, { isVisible });

    if (!review) {
      throw new NotFoundException(`Không tìm thấy đánh giá với ID: ${id}`);
    }
    return review;
  }

  async remove(id: string): Promise<ReviewDocument> {
    const review = await this.findOne(id);
    await this.reviewsRepository.delete(review);
    return review;
  }
}
