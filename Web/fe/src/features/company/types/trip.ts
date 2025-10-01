import type { Dayjs } from "dayjs";

export interface RouteStopFormState {
  id: string;
  locationId: string;
  expectedArrivalTime: Dayjs | null;
  expectedDepartureTime: Dayjs | null;
}

export interface AddTripFormState {
  companyId: string;
  vehicleId: string | null;
  fromLocationId: string | null;
  toLocationId: string | null;
  departureTime: Dayjs | null;
  expectedArrivalTime: Dayjs | null;
  price: number;
  stops: RouteStopFormState[];
  isRecurrenceTemplate: boolean;
}

export interface CreateTripPayload {
  companyId: string;
  vehicleId: string;
  route: {
    fromLocationId: string;
    toLocationId: string;
    stops?: {
      locationId: string;
      expectedArrivalTime: string;
      expectedDepartureTime?: string;
    }[];
  };
  departureTime: string;
  expectedArrivalTime: string;
  price: number;
  isRecurrenceTemplate: boolean;
}
