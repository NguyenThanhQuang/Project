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
    _id?: string;
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

export interface SearchTripsParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

export interface SearchTripsResponse {
  trips: Trip[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTripPayload {
  companyId: string;
  vehicleId: string;
  fromLocationId: string;
  toLocationId: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  description?: string;
  status: 'active' | 'inactive';
}


