export interface PassengerPayload {
  name: string;
  phone: string;
  seatNumber: string;
}

export interface CreateHoldPayload {
  tripId: string;
  passengers: PassengerPayload[];
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
}
export interface HeldBookingResponse {
  _id: string;
  status: "pending" | "held" | "confirmed" | "cancelled" | "expired";
  heldUntil: string;
  totalAmount: number;
  passengers: {
    name: string;
    phone: string;
    seatNumber: string;
    price: number;
  }[];
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  companyId: string;
  tripId: string;
  createdAt: string;
  updatedAt: string;
}
export interface PaymentLinkResponse {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  qrCode: string;
  checkoutUrl: string;
}

export interface LookupBookingPayload {
  bookingId: string;
  contactPhone: string;
}

export interface LookedUpBooking {
  _id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  ticketCode?: string;
  contactName: string;
  contactPhone: string;
  passengers: {
    name: string;
    phone: string;
    seatNumber: string;
    price: number;
  }[];
  tripId: {
    _id: string;
    departureTime: string;
    expectedArrivalTime: string;
    price: number;
    companyId: {
      _id: string;
      name: string;
      logoUrl?: string;
    };
    route: {
      fromLocationId: {
        _id: string;
        name: string;
        fullAddress: string;
      };
      toLocationId: {
        _id: string;
        name: string;
        fullAddress: string;
      };
    };
  };
}
