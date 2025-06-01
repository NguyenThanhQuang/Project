import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';

export type VehicleDocument = HydratedDocument<Vehicle>;

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

  @Prop(
    raw({
      rows: { type: Number },
      cols: { type: Number },

      layout: { type: Object },
    }),
  )
  seatMap?: Record<string, any>;

  @Prop({ type: Number, required: true, min: 1 })
  totalSeats: number;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
