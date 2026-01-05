import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  Company,
  CompanyDocument,
} from '../../companies/schemas/company.schema';
import { Location } from '../../locations/schemas/location.schema';
import {
  Vehicle,
  VehicleDocument,
} from '../../vehicles/schemas/vehicle.schema';

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

export enum TripStopStatus {
  PENDING = 'pending',
  ARRIVED = 'arrived',
  DEPARTED = 'departed',
}

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

@Schema({ _id: false })
export class TripStopInfo {
  @Prop({ type: Types.ObjectId, ref: Location.name, required: true })
  locationId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  expectedArrivalTime: Date;

  @Prop({ type: Date })
  expectedDepartureTime?: Date;

  @Prop({
    type: String,
    enum: Object.values(TripStopStatus),
    default: TripStopStatus.PENDING,
  })
  status: TripStopStatus;
}
export const TripStopInfoSchema = SchemaFactory.createForClass(TripStopInfo);

@Schema({ _id: false })
export class RouteInfo {
  @Prop({
    type: Types.ObjectId,
    ref: Location.name,
    required: true,
    index: true,
  })
  fromLocationId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Location.name,
    required: true,
    index: true,
  })
  toLocationId: Types.ObjectId;

  @Prop({ type: [TripStopInfoSchema], default: [] })
  stops: TripStopInfo[];

  @Prop({ type: String })
  polyline?: string;

  @Prop({ type: Number })
  duration?: number;

  @Prop({ type: Number })
  distance?: number;
}
export const RouteInfoSchema = SchemaFactory.createForClass(RouteInfo);

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
@Prop({
  type: Types.ObjectId,
  ref: 'Driver',
  index: true,
})
driverId?: Types.ObjectId;
  @Prop({ type: [SeatSchema], required: true, default: [] })
  seats: Seat[];

  @Prop({ type: Boolean, default: false, index: true })
  isRecurrenceTemplate: boolean;

  @Prop({ type: Types.ObjectId, index: true })
  recurrenceParentId?: Types.ObjectId;

  @Prop({ type: Boolean, default: true, index: true })
  isRecurrenceActive: boolean;
}

export const TripSchema = SchemaFactory.createForClass(Trip);

TripSchema.index({
  'route.fromLocationId': 1,
  'route.toLocationId': 1,
  departureTime: 1,
});

export type PopulatedTripForFiltering = Omit<
  TripDocument,
  'companyId' | 'vehicleId'
> & {
  companyId: Pick<CompanyDocument, '_id' | 'name'>;
  vehicleId: Pick<VehicleDocument, 'type'>;
};
