import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Trip } from '../../trips/schemas/trip.schema';
import { User } from '../../users/schemas/user.schema';

export type BookingDocument = HydratedDocument<Booking>;

export enum BookingStatus {
  PENDING = 'pending',
  HELD = 'held',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

@Schema({ _id: false })
export class PassengerInfo {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true })
  phone: string;

  @Prop({ type: String, required: true })
  seatNumber: string;
}
export const PassengerInfoSchema = SchemaFactory.createForClass(PassengerInfo);

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: User.name, index: true, required: false })
  userId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Trip.name, required: true, index: true })
  tripId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now, required: true })
  bookingTime: Date;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING,
    index: true,
  })
  status: BookingStatus;

  @Prop({ type: Date, index: true })
  heldUntil?: Date;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Prop({ type: String })
  paymentMethod?: string;

  @Prop({ type: Number, required: true, min: 0 })
  totalAmount: number;

  @Prop({ type: [PassengerInfoSchema], required: true, default: [] })
  passengers: PassengerInfo[];

  @Prop({ type: String, required: true, trim: true })
  contactName: string;

  @Prop({ type: String, required: true, trim: true })
  contactPhone: string;

  @Prop({ type: String, trim: true, lowercase: true })
  contactEmail?: string;

  @Prop({ type: String, unique: true, sparse: true, index: true })
  ticketCode?: string;

  @Prop({ type: String, index: true })
  paymentGatewayTransactionId?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
