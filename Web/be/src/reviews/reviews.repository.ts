import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async create(doc: Partial<Review>): Promise<ReviewDocument> {
    const newReview = new this.reviewModel(doc);
    return newReview.save();
  }

  async findById(id: string | Types.ObjectId): Promise<ReviewDocument | null> {
    return this.reviewModel.findById(id).exec();
  }

  async findOne(
    filter: FilterQuery<ReviewDocument>,
  ): Promise<ReviewDocument | null> {
    return this.reviewModel.findOne(filter).exec();
  }

  async findAllPublic(
    filter: FilterQuery<ReviewDocument>,
  ): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find(filter)
      .select('-userId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllWithDetails(
    filter: FilterQuery<ReviewDocument>,
  ): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find(filter)
      .populate('userId', 'name email')
      .populate('companyId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateData: UpdateQuery<ReviewDocument>,
  ): Promise<ReviewDocument | null> {
    return this.reviewModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async save(review: ReviewDocument): Promise<ReviewDocument> {
    return review.save();
  }

  async delete(review: ReviewDocument): Promise<void> {
    await review.deleteOne();
  }
}
