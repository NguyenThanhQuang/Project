import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Company } from 'src/companies/schemas/company.schema';
import { Trip } from 'src/trips/schemas/trip.schema';
import { Vehicle } from 'src/vehicles/schemas/vehicle.schema';

export enum DriverStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

export type DriverDocument = HydratedDocument<Driver>;

@Schema({ timestamps: true })
export class Driver {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, trim: true })
  address?: string;

  @Prop({ type: String, trim: true })
  phone?: string;

  @Prop({ type: String, trim: true, lowercase: true })
  email?: string;

  @Prop({ type: String, trim: true })
  description?: string;

  @Prop({ type: String, trim: true })
  avatarUrl?: string;

  @Prop({
    type: String,
    trim: true,
    index: true,
  })
  license?: string;

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
    index: true,
  })
  vehicleId?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Trip.name,
    index: true,
  })
  tripId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(DriverStatus),
    default: DriverStatus.ACTIVE,
    index: true,
  })
  status: DriverStatus;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
