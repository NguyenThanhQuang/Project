export type VehicleStatus = "active" | "maintenance" | "inactive";

export type SeatMapLayout = Array<Array<string | number | null>>;

export interface SeatMap {
  rows: number;
  cols: number;
  layout: SeatMapLayout;
}

export interface Vehicle {
  _id: string;
  companyId: string;
  vehicleNumber: string;
  type: string;
  description?: string;
  seatMap?: SeatMap;
  totalSeats: number;
  floors: number;
  status: VehicleStatus;
}

export interface VehiclePayload {
  companyId: string;
  vehicleNumber: string;
  type: string;
  totalSeats: number;
  description?: string;
  status: VehicleStatus;
  floors?: number;
  seatMap?: SeatMap;
}
