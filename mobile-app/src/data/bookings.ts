export interface MockBooking {
  _id: string;
  userId: string;
  tripId: string;
  selectedSeats: string[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  passengerInfo: {
    name: string;
    phone: string;
    email: string;
    idNumber: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const mockBookings: MockBooking[] = [
  {
    _id: 'booking1',
    userId: 'user1',
    tripId: 'trip1',
    selectedSeats: ['A1', 'A2'],
    totalAmount: 500000,
    status: 'confirmed',
    passengerInfo: [
      {
        name: 'Nguyễn Văn A',
        phone: '0123456789',
        email: 'user@example.com',
        idNumber: '123456789'
      },
      {
        name: 'Nguyễn Thị B',
        phone: '0987654321',
        email: 'user2@example.com',
        idNumber: '987654321'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
