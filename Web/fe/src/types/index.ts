import type dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { Vehicle } from "../features/admin/types/vehicle";
import type { LocationData } from "../features/trips/types/location";

export type UserRole = "user" | "company_admin" | "admin";
export type LocationType =
  | "bus_station"
  | "company_office"
  | "pickup_point"
  | "rest_stop"
  | "city"
  | "other";
export type TripStatus = "scheduled" | "departed" | "arrived" | "cancelled";
export type SeatStatus = "available" | "held" | "booked";
export type TripStopStatus = "pending" | "arrived" | "departed";
export type BookingStatus =
  | "pending"
  | "held"
  | "confirmed"
  | "cancelled"
  | "expired";
export type PaymentStatus = "pending" | "paid" | "failed";

interface PopulatedCompany {
  _id: string;
  name: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  roles: UserRole[];
  isEmailVerified: boolean;
  companyId?: string | PopulatedCompany;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  _id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
}

export interface SeatMap {
  rows: number;
  cols: number;
  layout: (string | number | null)[][];
}

interface Seat {
  id: string;
  seatNumber: string;
  status: "available" | "held" | "booked";
  position: { row: number; column: number };
  price: number;
  type: "normal";
  floor?: 1 | 2;
}

export interface RouteStop {
  id: string;
  name: string;
  arrivalTime: string;
  departureTime?: string;
  isTerminal: boolean;
}

export interface TripDetail {
  id: string;
  companyName: string;
  companyLogo: string;
  vehicleType: "Giường nằm" | "Ghế ngồi";
  vehicleNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromLocation: string;
  toLocation: string;
  price: number;
  rating: number;
  amenities: string[];
  seats: Seat[];
  routeStops: RouteStop[];
  seatLayout: {
    rows: number;
    columns: number;
    aisleAfterColumn?: number;
    floors: 1 | 2;
  };
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
}

export interface TripSearchResult {
  _id: string;
  companyId: {
    _id: string;
    name: string;
    logoUrl?: string;
  };
  vehicleId: {
    _id: string;
    type: string;
  };
  route: {
    fromLocationId: LocationData;
    toLocationId: LocationData;
  };
  departureTime: string;
  expectedArrivalTime: string;
  price: number;
  availableSeatsCount: number;
}

export interface TripDetailView {
  _id: string;
  companyName: string;
  companyLogo?: string;
  vehicleType: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromLocation: string;
  toLocation: string;
  price: number;
  status: TripStatus;
  amenities: string[];
  seats: FrontendSeat[];
  routeStops: FrontendRouteStop[];
  polyline?: string;
  seatLayout: {
    rows: number;
    columns: number;
    aisleAfterColumn?: number;
    floors: 1 | 2;
  };
}

export interface FrontendSeat {
  id: string;
  seatNumber: string;
  status: SeatStatus;
  position: { row: number; column: number };
  price: number;
  floor: 1 | 2;
  type: "normal";
}

export interface FrontendRouteStop {
  id: string;
  name: string;
  arrivalTime: string;
  departureTime?: string;
  status: TripStopStatus;
}

export interface PassengerInfo {
  name: string;
  phone: string;
  seatNumber: string;
  price: number;
}

export interface Booking {
  _id: string;
  userId?: string;
  tripId: string;
  companyId: string;
  bookingTime: string;
  status: BookingStatus;
  heldUntil?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  totalAmount: number;
  passengers: PassengerInfo[];
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  ticketCode?: string;
  paymentGatewayTransactionId?: string;
}

export interface RouteStepperModalProps {
  open: boolean;
  onClose: () => void;
  routeStops: FrontendRouteStop[];
}

export type SearchState = {
  from: LocationData | null;
  to: LocationData | null;
  date: dayjs.Dayjs;
  passengers: number;
};

export interface SearchData {
  from: LocationData | null;
  to: LocationData | null;
  date: Dayjs;
  passengers: number;
}

// Định nghĩa kiểu dữ liệu cho state của các bộ lọc
export interface Filters {
  companies: string[];
  timeSlots: string[];
  vehicleTypes: string[];
  priceRange: number[];
}

export interface FilterOptions {
  companies: Pick<Company, "_id" | "name">[];
  vehicleTypes: string[];
  maxPrice: number;
}

export interface SearchTripsResponse {
  trips: TripSearchResult[];
  filters: {
    companies: Pick<Company, "_id" | "name">[];
    vehicleTypes: string[];
    maxPrice: number;
  };
}
