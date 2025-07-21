import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';

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

  @Prop({ type: String, required: true, trim: true })
  type: string;

  @Prop({ type: String, trim: true })
  description?: string;

  @Prop({ type: Object })
  seatMap?: SeatMap;

  @Prop({ type: Number, required: true, min: 1 })
  totalSeats: number;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
