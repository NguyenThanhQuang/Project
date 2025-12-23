import { BaseEntity, GeoLocation } from "./common";
import {
  BookingStatus,
  CompanyStatus,
  LocationType,
  PaymentMethod,
  PaymentStatus,
  SeatStatus,
  TripStatus,
  TripStopStatus,
  UserAccountStatus,
  UserRole,
  VehicleStatus,
} from "./enums";

/**
 * QUẢN LÝ ĐỊA ĐIỂM
 */
export interface Location extends BaseEntity {
  name: string;
  slug: string;
  province: string;
  district?: string;
  fullAddress: string;
  location: GeoLocation;
  type: LocationType;
  images?: string[];
  isActive: boolean;
}

/**
 * QUẢN LÝ NGƯỜI DÙNG
 */
export interface User extends BaseEntity {
  email: string;
  phone: string;
  name: string;
  roles: UserRole[];
  companyId?: string;
  isEmailVerified: boolean;
  status: UserAccountStatus;
  lastLoginDate?: string;
  isBanned: boolean;
}

/**
 * QUẢN LÝ NHÀ XE
 */
export interface Company extends BaseEntity {
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  logoUrl?: string;
  status: CompanyStatus;
}

/**
 * CẤU TRÚC SƠ ĐỒ GHẾ (Seat Map)
 */
export interface SeatMap {
  rows: number;
  cols: number;
  layout: (string | null)[][]; // null đại diện cho lối đi
}

/**
 * Type đại diện cho ma trận ghế (Array of Arrays)
 * null = lối đi, string = mã ghế (ví dụ: "A01")
 */
export type SeatMapLayout = (string | null)[][];

/**
 * CẤU TRÚC SƠ ĐỒ GHẾ (Seat Map)
 */
export interface SeatMap {
  rows: number;
  cols: number;
  layout: SeatMapLayout; // Sử dụng type vừa định nghĩa ở trên
}

/**
 * QUẢN LÝ XE KHÁCH
 */
export interface Vehicle extends BaseEntity {
  companyId: string;
  vehicleNumber: string;
  type: string;
  description?: string;
  status: VehicleStatus;
  floors: number;
  seatColumns: number;
  seatRows: number;
  aislePositions: number[];
  totalSeats: number;
  seatMap?: SeatMap;
  seatMapFloor2?: SeatMap;
}

/**
 * QUẢN LÝ CHUYẾN XE (TRIP)
 */
export interface TripSeat {
  seatNumber: string;
  status: SeatStatus;
  bookingId?: string;
}

export interface TripStop {
  locationId: string;
  expectedArrivalTime: string;
  expectedDepartureTime?: string;
  status: TripStopStatus;
}

export interface RouteInfo {
  fromLocationId: string;
  toLocationId: string;
  stops: TripStop[];
  polyline?: string;
  duration?: number; // Giây
  distance?: number; // Mét
}

export interface Trip extends BaseEntity {
  companyId: string;
  vehicleId: string;
  route: RouteInfo;
  departureTime: string;
  expectedArrivalTime: string;
  price: number;
  status: TripStatus;
  seats: TripSeat[];
  isRecurrenceTemplate: boolean;
  isRecurrenceActive: boolean;
  recurrenceParentId?: string;
}

/**
 * QUẢN LÝ ĐẶT VÉ (BOOKING)
 */
export interface PassengerInfo {
  name: string;
  phone: string;
  seatNumber: string;
  price: number;
}

export interface Booking extends BaseEntity {
  userId?: string;
  tripId: string;
  companyId: string;
  bookingTime: string;
  status: BookingStatus;
  heldUntil?: string; // Quan trọng: Thời điểm tự động nhả ghế nếu không thanh toán
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  totalAmount: number;
  passengers: PassengerInfo[];
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  ticketCode?: string; // Mã vé sau khi confirmed
  paymentGatewayTransactionId?: string;
  paymentOrderCode?: number; // Dành riêng cho PayOS
  reviewId?: string;
}

/**
 * ĐÁNH GIÁ (REVIEW)
 */
export interface Review extends BaseEntity {
  userId?: string;
  displayName: string;
  tripId: string;
  companyId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  isAnonymous: boolean;
  isVisible: boolean;
  editCount: number;
  lastEditedAt?: string;
}

/**
 * THÔNG BÁO (NOTIFICATION)
 */
export interface Notification extends BaseEntity {
  userId?: string; // Nếu không có thì là thông báo hệ thống
  title: string;
  message: string;
  type: string; // Sync với NotificationType enum
  category: string; // Sync với NotificationCategory enum
  isRead: boolean;
  metadata?: Record<string, unknown>;
}
