import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';

export enum VehicleStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  INACTIVE = 'inactive',
}

export type VehicleDocument = HydratedDocument<Vehicle>;

export type SeatMapLayout = Array<Array<string | number | null>>;

export interface SeatMap {
  rows: number;
  cols: number;
  layout: SeatMapLayout;
}

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({
    type: Types.ObjectId,
    ref: Company.name,
    required: true,
    index: true,
  })
  companyId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, uppercase: true })
  vehicleNumber: string;

  @Prop({ type: String, required: true, trim: true })
  type: string;

  @Prop({ type: String, trim: true })
  description?: string;

  @Prop({ type: Object })
  seatMap?: SeatMap;

  @Prop({ type: Number, default: 1, min: 1 })
  floors: number;

  @Prop({ type: Number, required: true, min: 1 })
  totalSeats: number;

  @Prop({
    type: String,
    enum: Object.values(VehicleStatus),
    default: VehicleStatus.ACTIVE,
    index: true,
  })
  status: VehicleStatus;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.index({ companyId: 1, vehicleNumber: 1 }, { unique: true });
