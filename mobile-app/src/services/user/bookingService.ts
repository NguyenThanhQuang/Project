import { API_ENDPOINTS } from '../common/configService';
import apiService from '../common/apiService';
import { Booking, CreateBookingPayload } from '../../types/booking';
import { SearchTripsParams, SearchTripsResponse } from '../../types/trip';


class BookingService {
  async searchTrips(params: SearchTripsParams): Promise<SearchTripsResponse> {
    try {
      console.log('🔍 BookingService: Searching trips with params:', params);
      const response = await apiService.get<SearchTripsResponse>(API_ENDPOINTS.TRIPS.SEARCH, {
        params: {
          from: params.from,
          to: params.to,
          date: params.date,
          passengers: params.passengers
        }
      });
      console.log('✅ BookingService: API search successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ BookingService: Error searching trips:', error);
      console.log('🔄 BookingService: Using mock data as fallback');
      
      // Import and use mock data with improved search logic
      const { generateMockTrips } = require('../../data/trips');
      const mockTrips = generateMockTrips(params.from, params.to, params.date);
      
      return {
        trips: mockTrips,
        total: mockTrips.length,
        page: 1,
        limit: 10
      };
    }
  }

  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    try {
      const response = await apiService.post<Booking>(API_ENDPOINTS.BOOKINGS.CREATE, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getUserBookings(): Promise<Booking[]> {
    try {
      const response = await apiService.get<Booking[]>(API_ENDPOINTS.BOOKINGS.USER_BOOKINGS);
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  }

  async cancelBooking(bookingId: string): Promise<void> {
    try {
      await apiService.put(`${API_ENDPOINTS.BOOKINGS.CANCEL.replace(':id', bookingId)}`);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    try {
      const response = await apiService.get<Booking>(`${API_ENDPOINTS.BOOKINGS.BASE}/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  // Added helpers for screens
  async getTripDetails(tripId: string): Promise<any> {
    try {
      console.log('🔍 Fetching trip details for ID:', tripId);
      const response = await apiService.get(`/trips/${tripId}`);
      console.log('✅ Trip details fetched successfully:', response.data);
      return response.data as any;
    } catch (error: any) {
      console.error('❌ Error fetching trip details:', error);
      
      // Return mock trip data as fallback
      console.log('🔄 Using mock trip data as fallback');
      const mockTrip = {
        _id: tripId,
        from: 'Hà Nội',
        to: 'TP. Hồ Chí Minh',
        departureTime: new Date().toISOString(),
        expectedArrivalTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
        price: 500000,
        availableSeats: 45,
        status: 'scheduled',
        company: { name: 'Nhà xe ABC', _id: 'mock-company' },
        companyId: { name: 'Nhà xe ABC', _id: 'mock-company' },
        vehicleId: { type: 'Xe khách', totalSeats: 45, _id: 'mock-vehicle' },
        route: {
          fromLocationId: { name: 'Hà Nội', province: 'Hà Nội' },
          toLocationId: { name: 'TP. Hồ Chí Minh', province: 'TP. Hồ Chí Minh' },
          stops: []
        },
        seats: this.generateMockSeats(45, 500000),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return mockTrip;
    }
  }

  // Helper method to generate mock seats
  private generateMockSeats(totalSeats: number, price: number): any[] {
    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      const row = Math.ceil(i / 4);
      const col = ((i - 1) % 4) + 1;
      const seatNumber = `${String.fromCharCode(64 + row)}${col}`; // A1, A2, A3, A4, B1, B2, etc.
      
      seats.push({
        _id: `seat-${i}`,
        seatNumber,
        status: Math.random() > 0.3 ? 'available' : 'booked', // 70% available, 30% booked
        price,
        isWindow: col === 1 || col === 4,
        isAisle: col === 2 || col === 3,
        row,
        column: col,
      });
    }
    return seats;
  }

  async createHold(payload: { tripId: string; passengers: Array<{ name: string; phone: string; email?: string; idNumber?: string; seatNumber: string }>; contactName: string; contactPhone: string; contactEmail?: string; }): Promise<{ _id: string } & Partial<Booking>> {
    try {
      console.log('🎫 Creating booking hold:', payload);
      
      // Check if user is authenticated
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const token = await AsyncStorage.getItem('accessToken');
      
      // Prepare request with optional auth header
      const config: any = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
        console.log('🔐 Authenticated user - creating booking with user account');
      } else {
        console.log('👤 Guest user - creating anonymous booking');
      }
      
      const response = await apiService.post(`/bookings/hold`, payload, config);
      console.log('✅ Booking hold created:', response.data);
      return response.data as { _id: string } & Partial<Booking>;
    } catch (error: any) {
      // Offline-first: if network error, return mock booking without logging an error
      if (error.message === 'Network Error') {
        console.warn('🔄 Network offline - returning mock booking hold');
        const mockBooking = {
          _id: `mock-${Date.now()}`,
          tripId: payload.tripId,
          selectedSeats: payload.passengers.map(p => p.seatNumber),
          totalAmount: 0,
          status: 'held' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        console.log('✅ Mock booking hold created (offline):', mockBooking._id);
        return mockBooking as any;
      }

      // Server/validation errors: log and throw user-friendly messages
      console.error('❌ Error creating booking hold:', error);
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Thông tin đặt vé không hợp lệ');
      }
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy chuyến xe');
      }
      if (error.response?.status >= 500) {
        throw new Error('Lỗi máy chủ, vui lòng thử lại sau');
      }
      throw new Error(error.message || 'Không thể tạo đặt vé');
    }
  }

  async confirmPaymentMock(bookingId: string): Promise<void> {
    try {
      console.log('💳 Confirming payment for booking:', bookingId);
      
      // If booking is mock, just simulate
      if (bookingId.startsWith('mock-')) {
        console.log('🎭 Mock booking - simulating payment confirmation');
        await new Promise((res) => setTimeout(res, 1000));
        return;
      }
      
      // Real booking - call backend API
      const response = await apiService.patch(`/bookings/${bookingId}/mock-confirm-payment`);
      console.log('✅ Payment confirmed:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error confirming payment:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy đặt vé');
      } else if (error.response?.status >= 500) {
        throw new Error('Lỗi máy chủ, vui lòng thử lại sau');
      } else if (error.message === 'Network Error') {
        // For demo purposes, simulate success when offline
        console.warn('🔄 Network error - simulating payment success for demo');
        await new Promise((res) => setTimeout(res, 1000));
        return;
      }
      
      throw new Error(error.message || 'Không thể xác nhận thanh toán');
    }
  }
}

export const bookingService = new BookingService();
