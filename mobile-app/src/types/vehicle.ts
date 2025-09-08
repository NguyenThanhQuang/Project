export interface Vehicle {
  _id: string;
  companyId: string;
  type: string;
  vehicleNumber: string;
  status: 'active' | 'inactive';
  description?: string;
  floors: number;
  seatColumns: number;
  seatRows: number;
  aislePositions: number[];
  totalSeats: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehiclePayload {
  companyId: string;
  type: string;
  vehicleNumber: string;
  status: 'active' | 'inactive';
  description?: string;
  floors: number;
  seatColumns: number;
  seatRows: number;
  aislePositions: number[];
}

export interface VehicleResponse {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
}


