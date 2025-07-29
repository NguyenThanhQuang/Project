import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Booking } from '../../bookings/schemas/booking.schema';
import { Company } from '../../companies/schemas/company.schema';
import { Trip } from '../../trips/schemas/trip.schema';
import { User } from '../../users/schemas/user.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Trip.name, required: true, index: true })
  tripId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Company.name,
    required: true,
    index: true,
  })
  companyId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Booking.name,
    required: true,
    unique: true,
    index: true,
  })
  bookingId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1, max: 5, index: true })
  rating: number;

  @Prop({ type: String, trim: true, maxlength: 2000 })
  comment?: string;

  @Prop({ type: Boolean, default: false })
  isAnonymous: boolean;

  @Prop({ type: Boolean, default: true, index: true })
  isVisible: boolean; // Admin có thể dùng để ẩn/hiện review
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ companyId: 1, createdAt: -1 });
ReviewSchema.index({ tripId: 1, createdAt: -1 });
