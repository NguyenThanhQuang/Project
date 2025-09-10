import type { Dayjs } from "dayjs";
import type { Company } from "../../admin/types/company";
import type { Vehicle } from "../../admin/types/vehicle";
import type { Location } from "./location";

export type TripStatus = "scheduled" | "departed" | "arrived" | "cancelled";
export type SeatStatus = "available" | "held" | "booked";
export type TripStopStatus = "pending" | "arrived" | "departed";

export interface Seat {
  seatNumber: string;
  status: SeatStatus;
  bookingId?: string;
}

export interface TripStopInfo {
  locationId: string;
  expectedArrivalTime: string;
  expectedDepartureTime?: string;
  status: TripStopStatus;
}

export interface RouteInfo {
  fromLocationId: string;
  toLocationId: string;
  stops: TripStopInfo[];
  polyline?: string;
}

/**
 * Interface cơ bản, đại diện cho một document Trip trong database.
 * Các trường tham chiếu là các chuỗi ID.
 */
export interface Trip {
  _id: string;
  companyId: string;
  vehicleId: string;
  route: RouteInfo;
  departureTime: string;
  expectedArrivalTime: string;
  price: number;
  status: TripStatus;
  seats: Seat[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface cho một chuyến đi đã được populate đầy đủ thông tin.
 * Thường được sử dụng trong trang chi tiết chuyến đi.
 */
export interface PopulatedTrip {
  _id: string;
  companyId: Company;
  vehicleId: Vehicle;
  route: {
    fromLocationId: Location;
    toLocationId: Location;
    stops: (Omit<TripStopInfo, "locationId"> & { locationId: Location })[];
    polyline?: string;
  };
  departureTime: string;
  expectedArrivalTime: string;
  price: number;
  status: TripStatus;
  seats: Seat[];
}

/**
 * Dữ liệu cho mỗi chuyến xe hiển thị trên trang kết quả tìm kiếm.
 * Đã được backend tối ưu hóa, chỉ chứa các thông tin cần thiết.
 */
export interface TripSearchResult {
  _id: string;
  companyId: Pick<Company, "_id" | "name" | "logoUrl">;
  vehicleId: Pick<Vehicle, "_id" | "type">;
  route: {
    fromLocationId: Pick<Location, "_id" | "name" | "province">;
    toLocationId: Pick<Location, "_id" | "name" | "province">;
  };
  departureTime: string;
  expectedArrivalTime: string;
  price: number;
  availableSeatsCount: number;
}

/**
 * Cấu trúc đầy đủ của response từ API tìm kiếm chuyến đi.
 */
export interface SearchTripsResponse {
  trips: TripSearchResult[];
  filters: FilterOptions;
}

/**
 * Dữ liệu cho các bộ lọc trên trang kết quả tìm kiếm.
 */
export interface FilterOptions {
  companies: Pick<Company, "_id" | "name">[];
  vehicleTypes: string[];
  maxPrice: number;
}

/**
 * State của form tìm kiếm chuyến đi.
 */
export interface SearchFormState {
  from: Location | null;
  to: Location | null;
  date: Dayjs | null;
  passengers: number;
}

export interface PopularRoute {
  fromLocation: Location;
  toLocation: Location;
  bookingCount: number;
}
