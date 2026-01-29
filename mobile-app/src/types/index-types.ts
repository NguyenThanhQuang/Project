// Core Types
export interface Location {
  _id: string;
  name: string;
  province: string;
  type: string;
}

export interface Trip {
  _id: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  expectedArrivalTime: string;
  price: number;
  availableSeats: number;
  company: {
    name: string;
  };
  seats?: any[];
  route?: {
    fromLocationId: { name: string; province: string };
    toLocationId: { name: string; province: string };
    stops: any[];
  };
  companyId?: { name: string; _id: string };
  vehicleId?: { type: string; totalSeats: number; _id: string };
  status?: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin' | 'company';
  companyId?: string;
}

export interface Booking {
  _id: string;
  userId: string;
  tripId: string;
  selectedSeats: string[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Vehicle {
  _id: string;
  type: string;
  totalSeats: number;
  companyId: string;
  licensePlate: string;
  status: 'active' | 'inactive' | 'maintenance';
}

// Form Types
export interface SearchFormData {
  from: string;
  to: string;
  departureDate: string;
  passengers: string;
}

export interface BookingFormData {
  selectedSeats: string[];
  totalAmount: number;
  passengerInfo?: {
    name: string;
    phone: string;
    email: string;
  };
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  SearchTrips: undefined;
  TripDetails: { trip: Trip };
  BookingCheckout: { trip: Trip; selectedSeats: string[]; totalAmount: number };
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  MyBookings: undefined;
  AdminDashboard: undefined;
  AdminManageTrips: undefined;
  AddTrip: undefined;
  AddVehicle: undefined;
  AddCompany: undefined;
  ManageUsers: undefined;
  ManageCompanies: undefined;
  CompanyRegistration: undefined;
  CompanyRegistrationSuccess: undefined;
  ChangePassword: undefined;
  ForgotPassword: undefined;
  BusTracking: undefined;
  LoyaltyProgram: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Component Props Types
export interface SearchFormProps {
  formData: SearchFormData;
  onFormChange: (field: string, value: any) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export interface TripCardProps {
  trip: Trip;
  onPress: (trip: Trip) => void;
  onBookNow?: (trip: Trip) => void;
}

export interface LocationPickerProps {
  value: string;
  placeholder: string;
  onLocationSelect: (location: Location) => void;
  suggestions: Location[];
  showSuggestions: boolean;
  onQueryChange: (query: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

// Hook Return Types
export interface UseSearchTripsReturn {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  searchTrips: (params: SearchFormData) => Promise<void>;
  clearResults: () => void;
}

export interface UseLocationSearchReturn {
  locations: Location[];
  suggestions: Location[];
  loading: boolean;
  searchLocations: (query: string) => Promise<void>;
  clearSuggestions: () => void;
}

export interface UseBookingReturn {
  booking: Booking | null;
  loading: boolean;
  error: string | null;
  createBooking: (data: BookingFormData) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
}
