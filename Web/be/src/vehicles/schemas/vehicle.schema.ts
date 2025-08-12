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

  @Prop({
    type: String,
    enum: Object.values(VehicleStatus),
    default: VehicleStatus.ACTIVE,
    index: true,
  })
  status: VehicleStatus;

  @Prop({ type: Number, required: true, min: 1, default: 1 })
  floors: number; // Số tầng

  @Prop({ type: Number, required: true, min: 1 })
  seatColumns: number; // Tổng số cột trên sơ đồ (bao gồm cả lối đi)

  @Prop({ type: Number, required: true, min: 1 })
  seatRows: number; // Số hàng ghế

  @Prop({ type: [Number], required: true, default: [] })
  aislePositions: number[]; // Vị trí các cột là lối đi. Ví dụ: [2] nghĩa là cột thứ 2 là lối đi.

  @Prop({ type: Number, required: true, min: 1 })
  totalSeats: number; // Tổng số ghế thực tế, được tính từ các tham số trên

  @Prop({ type: Object })
  seatMap?: SeatMap; // Sơ đồ ghế tầng 1, được tạo tự động

  @Prop({ type: Object })
  seatMapFloor2?: SeatMap; // Sơ đồ ghế tầng 2 (nếu floors > 1), được tạo tự động
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.index({ companyId: 1, vehicleNumber: 1 }, { unique: true });
