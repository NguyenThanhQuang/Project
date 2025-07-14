import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';
import { Location } from '../../locations/schemas/location.schema';
import { Vehicle } from '../../vehicles/schemas/vehicle.schema';

export type TripDocument = HydratedDocument<Trip>;

// Enum định nghĩa các trạng thái có thể có của một chuyến đi
export enum TripStatus {
  SCHEDULED = 'scheduled', // Chuyến đi đã được lên lịch, sẵn sàng để đặt vé
  DEPARTED = 'departed', // Chuyến đi đã khởi hành
  ARRIVED = 'arrived', // Chuyến đi đã đến nơi
  CANCELLED = 'cancelled', // Chuyến đi đã bị hủy
}

// Enum định nghĩa các trạng thái của một ghế ngồi
export enum SeatStatus {
  AVAILABLE = 'available', // Ghế còn trống
  HELD = 'held', // Ghế đang được giữ chỗ (ví dụ: trong quá trình thanh toán)
  BOOKED = 'booked', // Ghế đã được đặt thành công
}

// Enum định nghĩa trạng thái của một điểm dừng trong hành trình
export enum TripStopStatus {
  PENDING = 'pending', // Điểm dừng chưa đến
  ARRIVED = 'arrived', // Đã đến điểm dừng
  DEPARTED = 'departed', // Đã rời khỏi điểm dừng
}

// Schema cho một ghế ngồi, không tạo collection riêng (_id: false)
@Schema({ _id: false })
export class Seat {
  @Prop({ type: String, required: true })
  seatNumber: string; // Số hiệu ghế, ví dụ: "A1", "B5"

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

// Schema cho thông tin một điểm dừng trong chuyến đi
@Schema({ _id: false })
export class TripStopInfo {
  @Prop({ type: Types.ObjectId, ref: Location.name, required: true })
  locationId: Types.ObjectId; // Tham chiếu đến collection 'locations'

  @Prop({ type: Date, required: true })
  expectedArrivalTime: Date; // Thời gian dự kiến đến điểm dừng

  @Prop({ type: Date })
  expectedDepartureTime?: Date; // Thời gian dự kiến rời đi (có thể không có nếu là điểm dừng ngắn)

  @Prop({
    type: String,
    enum: Object.values(TripStopStatus),
    default: TripStopStatus.PENDING,
  })
  status: TripStopStatus; // Trạng thái của điểm dừng
}
export const TripStopInfoSchema = SchemaFactory.createForClass(TripStopInfo);

// Schema cho thông tin tuyến đường của chuyến đi
@Schema({ _id: false })
export class RouteInfo {
  @Prop({
    type: Types.ObjectId,
    ref: Location.name,
    required: true,
    index: true,
  })
  fromLocationId: Types.ObjectId; // ID của địa điểm đi

  @Prop({
    type: Types.ObjectId,
    ref: Location.name,
    required: true,
    index: true,
  })
  toLocationId: Types.ObjectId; // ID của địa điểm đến

  @Prop({ type: [TripStopInfoSchema], default: [] })
  stops: TripStopInfo[]; // Mảng các điểm dừng trên hành trình

  @Prop({ type: String })
  polyline?: string; // Chuỗi mã hóa polyline để vẽ trên bản đồ
}
export const RouteInfoSchema = SchemaFactory.createForClass(RouteInfo);

// Schema chính cho collection 'trips'
@Schema({ timestamps: true }) // Tự động thêm createdAt và updatedAt
export class Trip {
  @Prop({
    type: Types.ObjectId,
    ref: Company.name,
    required: true,
    index: true,
  })
  companyId: Types.ObjectId; // Liên kết tới nhà xe

  @Prop({
    type: Types.ObjectId,
    ref: Vehicle.name,
    required: true,
    index: true,
  })
  vehicleId: Types.ObjectId; // Liên kết tới loại xe

  @Prop({ type: RouteInfoSchema, required: true })
  route: RouteInfo; // Thông tin tuyến đường nhúng

  @Prop({ type: Date, required: true, index: true })
  departureTime: Date; // Thời gian khởi hành

  @Prop({ type: Date, required: true })
  expectedArrivalTime: Date; // Thời gian dự kiến đến

  @Prop({ type: Number, required: true, min: 0 })
  price: number; // Giá vé

  @Prop({
    type: String,
    enum: Object.values(TripStatus),
    default: TripStatus.SCHEDULED,
    index: true,
  })
  status: TripStatus; // Trạng thái chung của chuyến đi

  @Prop({ type: [SeatSchema], required: true, default: [] })
  seats: Seat[]; // Mảng các ghế ngồi và trạng thái của chúng
}

export const TripSchema = SchemaFactory.createForClass(Trip);

// Tạo index tổng hợp để tối ưu hóa truy vấn tìm kiếm chuyến đi
TripSchema.index({
  'route.fromLocationId': 1,
  'route.toLocationId': 1,
  departureTime: 1,
});
