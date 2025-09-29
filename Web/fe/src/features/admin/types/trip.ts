export type TripStatus = "scheduled" | "departed" | "arrived" | "cancelled";

export interface AdminTrip {
  _id: string;
  route: {
    fromLocationId: { name: string; province: string };
    toLocationId: { name: string; province: string };
  };
  vehicleId: {
    type: string;
    vehicleNumber: string;
  };
  departureTime: string;
  price: number;
  status: TripStatus;
  seats: {
    seatNumber: string;
    status: "available" | "held" | "booked";
  }[];
  createdAt: string;
  updatedAt: string;
  isRecurrenceTemplate: boolean;
}

export type UpdateTripPayload = {
  isRecurrenceTemplate?: boolean;
};
