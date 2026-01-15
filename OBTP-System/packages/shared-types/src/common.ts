import { UserRole } from "./enums";

/**
 * Cấu trúc phản hồi chuẩn từ API cho dữ liệu đơn lẻ
 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Cấu trúc lỗi trả về từ hệ thống
 * Tuân thủ quy tắc "Error Codes over Messages"
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[]; // Array cho validation errors (Zod/Nest)
  errorCode: string; // VD: "USR_NOT_FOUND", "TRIP_FULL"
  path: string;
  timestamp: string;
}

/**
 * Metadata dành cho dữ liệu phân trang
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Cấu trúc phản hồi chuẩn cho danh sách dữ liệu (phân trang)
 */
export interface PaginatedResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
  meta: PaginationMeta;
  timestamp: string;
}

/**
 * Interface cơ bản chứa các mốc thời gian và định danh của Database
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Dữ liệu người dùng đã được xác thực (Dùng trong Request/Token/Context)
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  phone: string;
  companyId?: string; // Chỉ có nếu là COMPANY_ADMIN hoặc tài khoản liên kết nhà xe
}

// Dữ liệu User trả về cho Client sau khi Login/Register (Đã sanitize)
export interface AuthUserResponse {
  id: string;
  email: string;
  name: string;
  roles: string[]; // Client nhận về string array
  companyId?: string;
  phone: string;
}

/**
 * Cấu trúc Token trả về khi Login thành công
 */
export interface LoginResponse {
  accessToken: string;
  user: AuthenticatedUser;
}

export const ROLES_KEY = "roles";

/**
 * Interface cho dữ liệu Error chuẩn của hệ thống
 */
export interface ApiErrorResponse {
  statusCode: number;
  errorCode: string;
  message: string | string[];
  timestamp: string;
  path: string;
}

/**
 * Cấu trúc JWT Payload khi giải mã
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  roles: UserRole[];
  companyId?: string;
  iat?: number;
  exp?: number;
}

/**
 * Cấu trúc tọa độ địa lý chuẩn GeoJSON (Sử dụng cho Mongoose Schema)
 */
export interface GeoLocation {
  type: "Point";
  coordinates: [number, number]; // [Longitude, Latitude]
}

/**
 * Cấu trúc tọa độ bản đồ dạng Object (Sử dụng cho Map API/Google/OSRM DTOs)
 */
export interface MapCoordinate {
  latitude: number;
  longitude: number;
}

/**
 * Dữ liệu trả về khi upload file/ảnh (Cloudinary/S3)
 */
export interface FileUploadResponse {
  url: string;
  publicId: string;
  format: string;
}
