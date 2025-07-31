import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { TripStatus } from 'src/trips/schemas/trip.schema';
import { BookingsService } from '../bookings/bookings.service';
import { BookingStatus } from '../bookings/schemas/booking.schema';
import { TripsService } from '../trips/trips.service';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private readonly bookingsService: BookingsService,
    private readonly tripsService: TripsService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    user: UserDocument,
  ): Promise<ReviewDocument> {
    const { bookingId, tripId, rating, comment, isAnonymous } = createReviewDto;

    const booking = await this.bookingsService.findOne(bookingId, user);
    const trip = await this.tripsService.findOne(tripId.toString());

    if (booking.tripId.toString() !== trip._id.toString()) {
      throw new BadRequestException('Đơn đặt vé không thuộc chuyến đi này.');
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        'Chỉ có thể đánh giá các chuyến đi đã được xác nhận.',
      );
    }

    if (trip.status !== TripStatus.ARRIVED) {
      throw new BadRequestException(
        'Chỉ có thể đánh giá các chuyến đi đã hoàn thành (đã đến nơi).',
      );
    }

    const existingReview = await this.reviewModel.findOne({ bookingId }).exec();
    if (existingReview) {
      throw new ConflictException('Bạn đã đánh giá cho chuyến đi này rồi.');
    }

    const newReview = new this.reviewModel({
      userId: user._id,
      tripId,
      bookingId,
      companyId: trip.companyId,
      rating,
      comment,
      isAnonymous: isAnonymous || false,
    });

    try {
      const savedReview = await newReview.save();
      return savedReview;
    } catch (error) {
      if ((error as { code: number }).code === 11000) {
        throw new ConflictException('Bạn đã đánh giá cho chuyến đi này rồi.');
      }
      throw error;
    }
  }

  async findAll(queryDto: QueryReviewDto): Promise<ReviewDocument[]> {
    const query: FilterQuery<ReviewDocument> = { isVisible: true };

    if (queryDto.companyId) query.companyId = queryDto.companyId;
    if (queryDto.tripId) query.tripId = queryDto.tripId;
    if (queryDto.userId) query.userId = queryDto.userId;
    if (queryDto.rating) query.rating = queryDto.rating;

    return this.reviewModel
      .find(query)
      .populate({
        path: 'userId',
        select: 'name',
      })
      .sort({ createdAt: -1 })
      .exec()
      .then((reviews) => {
        return reviews.map((review) => {
          if (review.isAnonymous) {
            (review.userId as any) = { name: 'Người dùng ẩn danh' };
          }
          return review;
        });
      });
  }

  async findAllForAdmin(queryDto: QueryReviewDto): Promise<ReviewDocument[]> {
    const query: FilterQuery<ReviewDocument> = {};
    if (queryDto.companyId) query.companyId = queryDto.companyId;
    return this.reviewModel
      .find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException(`Không tìm thấy đánh giá với ID: ${id}`);
    }
    return review;
  }

  async updateVisibility(
    id: string,
    isVisible: boolean,
  ): Promise<ReviewDocument> {
    const review = await this.reviewModel
      .findByIdAndUpdate(id, { $set: { isVisible } }, { new: true })
      .exec();

    if (!review) {
      throw new NotFoundException(`Không tìm thấy đánh giá với ID: ${id}`);
    }
    return review;
  }

  async remove(id: string): Promise<ReviewDocument> {
    const review = await this.findOne(id);
    await review.deleteOne();
    return review;
  }
}
