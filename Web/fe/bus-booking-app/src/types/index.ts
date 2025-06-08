// User types
export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
}

// Company types
export interface Company {
  id: string;
  name: string;
  logo?: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
}

// Vehicle types
export interface Vehicle {
  id: string;
  companyId: string;
  type: string;
  licensePlate: string;
  capacity: number;
  amenities: string[];
  seatMap: SeatMapLayout;
}

export interface SeatMapLayout {
  rows: number;
  columns: number;
  layout: string[][]; // 2D array representing seat layout
}

// Location and Route types
export interface Location {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RouteStop {
  location: Location;
  stopOrder: number;
  expectedArrivalTime?: string;
  expectedDepartureTime?: string;
}

export interface Route {
  from: Location;
  to: Location;
  stops: RouteStop[];
  distance: number;
  estimatedDuration: number;
  polyline?: string;
}

// Trip types
export interface Trip {
  id: string;
  companyId: string;
  vehicleId: string;
  route: Route;
  departureTime: string;
  expectedArrivalTime: string;
  price: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  recurringPattern?: string;
}

// Seat types
export interface Seat {
  id: string;
  tripId: string;
  seatNumber: string;
  status: 'available' | 'held' | 'booked';
  heldBy?: string;
  heldUntil?: string;
  price: number;
}

// Passenger types
export interface Passenger {
  id: string;
  name: string;
  phone: string;
  seatId: string;
}

// Booking types
export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  passengers: Passenger[];
  totalAmount: number;
  status: 'held' | 'confirmed' | 'cancelled' | 'expired';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentTransactionId?: string;
  ticketCode?: string;
  bookingTime: string;
  heldUntil?: string;
}

// Search types
export interface SearchFilters {
  from: string;
  to: string;
  date: string;
  passengers: number;
  companyIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  departureTimeRange?: {
    start: string;
    end: string;
  };
  vehicleTypes?: string[];
}

export interface SearchResult {
  trip: Trip;
  company: Company;
  vehicle: Vehicle;
  availableSeats: number;
  minPrice: number;
}

// Payment types
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'vnpay' | 'momo' | 'bank_transfer' | 'cash';
  isEnabled: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 