import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';
import { Vehicle } from '../../vehicles/schemas/vehicle.schema';

export type TripDocument = HydratedDocument<Trip>;

export enum TripStatus {
  SCHEDULED = 'scheduled',
  DEPARTED = 'departed',
  ARRIVED = 'arrived',
  CANCELLED = 'cancelled',
}

export enum SeatStatus {
  AVAILABLE = 'available',
  HELD = 'held',
  BOOKED = 'booked',
}

// Cấu trúc cho điểm (location)
const PointSchemaStructureRequired = {
  type: { type: String, enum: ['Point'], default: 'Point', required: true },
  coordinates: { type: [Number], required: true },
};

const PointSchemaStructureOptional = {
  // Dùng cho Stop
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number] },
};

// Cấu trúc cho điểm dừng
@Schema({ _id: false })
export class Stop {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop(raw(PointSchemaStructureOptional))
  location?: { type: 'Point'; coordinates: [number, number] };

  @Prop({ type: Date })
  expectedArrivalTime?: Date;

  @Prop({ type: Date })
  expectedDepartureTime?: Date;
}
export const StopSchema = SchemaFactory.createForClass(Stop);

// Cấu trúc cho Route
@Schema({ _id: false })
export class RouteInfo {
  @Prop(
    raw({
      name: { type: String, required: true, trim: true },
      location: PointSchemaStructureRequired,
    }),
  )
  from: {
    name: string;
    location: { type: 'Point'; coordinates: [number, number] };
  };

  @Prop(
    raw({
      name: { type: String, required: true, trim: true },
      location: PointSchemaStructureRequired,
    }),
  )
  to: {
    name: string;
    location: { type: 'Point'; coordinates: [number, number] };
  };

  @Prop({ type: [StopSchema], default: [] })
  stops: Stop[];

  @Prop({ type: String })
  polyline?: string;
}
export const RouteInfoSchema = SchemaFactory.createForClass(RouteInfo);

// Cấu trúc cho Ghế
@Schema({ _id: false })
export class Seat {
  @Prop({ type: String, required: true })
  seatNumber: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(SeatStatus),
    default: SeatStatus.AVAILABLE,
  })
  status: SeatStatus;

  @Prop({ type: Types.ObjectId, ref: 'Booking' })
  bookingId?: Types.ObjectId;
}
export const SeatSchema = SchemaFactory.createForClass(Seat);

@Schema({ timestamps: true })
export class Trip {
  @Prop({
    type: Types.ObjectId,
    ref: Company.name,
    required: true,
    index: true,
  })
  companyId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Vehicle.name,
    required: true,
    index: true,
  })
  vehicleId: Types.ObjectId;

  @Prop({ type: RouteInfoSchema, required: true })
  route: RouteInfo;

  @Prop({ type: Date, required: true, index: true })
  departureTime: Date;

  @Prop({ type: Date, required: true })
  expectedArrivalTime: Date;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({
    type: String,
    enum: Object.values(TripStatus),
    default: TripStatus.SCHEDULED,
    index: true,
  })
  status: TripStatus;

  @Prop({ type: [SeatSchema], required: true, default: [] })
  seats: Seat[];
}

export const TripSchema = SchemaFactory.createForClass(Trip);
TripSchema.index({
  'route.from.name': 1,
  'route.to.name': 1,
  departureTime: 1,
});
