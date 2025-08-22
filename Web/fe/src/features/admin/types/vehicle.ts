export type VehicleStatus = "active" | "maintenance" | "inactive";

export type SeatMapLayout = Array<Array<string | number | null>>;

export interface SeatMap {
  rows: number;
  cols: number;
  layout: SeatMapLayout;
}

export interface CompanyReference {
  _id: string;
  name: string;
  code: string;
}

export interface Vehicle {
  _id: string;
  companyId: CompanyReference;
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

  createdAt: string;
  updatedAt: string;
}

export interface VehiclePayload {
  companyId: string;
  vehicleNumber: string;
  type: string;
  description?: string;
  status: VehicleStatus;

  floors: number;
  seatColumns: number;
  seatRows: number;
  aislePositions: number[];
}
