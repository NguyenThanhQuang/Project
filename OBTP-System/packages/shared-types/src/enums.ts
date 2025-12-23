/**
 * Vai trò người dùng trong hệ thống
 */
export enum UserRole {
  USER = "user",
  COMPANY_ADMIN = "company_admin",
  ADMIN = "admin",
  DRIVER = "driver",
}

/**
 * Trạng thái tài khoản (Dành cho hiển thị trên Dashboard Admin)
 */
export enum UserAccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
}

/**
 * Trạng thái hoạt động của Nhà xe (Company)
 */
export enum CompanyStatus {
  ACTIVE = "active",
  PENDING = "pending",
  SUSPENDED = "suspended",
}

/**
 * Trạng thái của xe khách
 */
export enum VehicleStatus {
  ACTIVE = "active",
  MAINTENANCE = "maintenance",
  INACTIVE = "inactive",
}

/**
 * Trạng thái vận hành của một chuyến xe
 */
export enum TripStatus {
  SCHEDULED = "scheduled", // Đã lên lịch
  DEPARTED = "departed", // Đang trên đường
  ARRIVED = "arrived", // Đã cập bến
  CANCELLED = "cancelled", // Đã hủy chuyến
}

/**
 * Trạng thái chi tiết của từng vị trí ghế
 */
export enum SeatStatus {
  AVAILABLE = "available",
  HELD = "held",
  BOOKED = "booked",
}

/**
 * Trạng thái tại các điểm dừng
 */
export enum TripStopStatus {
  PENDING = "pending",
  ARRIVED = "arrived",
  DEPARTED = "departed",
}

/**
 * Trạng thái vòng đời của một đơn đặt vé (Booking Lifecycle)
 */
export enum BookingStatus {
  PENDING = "pending",
  HELD = "held",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  COMPLETED = "completed",
}

/**
 * Trạng thái thanh toán (Internal logic & Gateway mapping)
 */
export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

/**
 * Phương thức thanh toán hỗ trợ
 */
export enum PaymentMethod {
  PAYOS = "payos",
  MOMO = "momo",
  ZALOPAY = "zalopay",
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
}

/**
 * Phân loại loại giao dịch trong báo cáo tài chính
 */
export enum TransactionType {
  BOOKING = "booking",
  COMMISSION = "commission",
  REFUND = "refund",
}

/**
 * Phân loại địa điểm (Schema mapping)
 */
export enum LocationType {
  BUS_STATION = "bus_station",
  COMPANY_OFFICE = "company_office",
  PICKUP_POINT = "pickup_point",
  REST_STOP = "rest_stop",
  CITY = "city",
  OTHER = "other",
}

/**
 * Khoảng thời gian báo cáo
 */
export enum ReportPeriod {
  WEEK = "7d",
  MONTH = "30d",
  QUARTER = "90d",
  YEAR = "365d",
}

/**
 * Danh mục thông báo
 */
export enum NotificationCategory {
  SYSTEM = "system",
  USER = "user",
  COMPANY = "company",
  FINANCE = "finance",
}

/**
 * Mức độ nghiêm trọng của thông báo
 */
export enum NotificationType {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success",
}

/**
 * Danh sách tên các Sự kiện hệ thống (Dùng cho EventEmitter2)
 */
export enum SystemEvent {
  USER_REGISTERED = "user.registered",
  USER_FORGOT_PASSWORD = "user.forgot_password",
  USER_VERIFICATION_RESENT = "user.resend_verification",
  BOOKING_CONFIRMED = "booking.confirmed",
  BOOKING_CANCELLED = "booking.cancelled",
}
