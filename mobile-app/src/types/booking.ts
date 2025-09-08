export interface Booking {
  _id: string;
  userId: string;
  tripId: string;
  selectedSeats?: string[];
  seats?: string[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'held';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  tripId: string;
  selectedSeats: string[];
  passengerInfo: {
    name: string;
    phone: string;
    email: string;
    idNumber: string;
  }[];
}


