import apiService from './common/apiService';
import { generateMockTrips } from '../data/trips';

export interface Trip {
  _id: string;
  companyId: {
    _id: string;
    name: string;
    logoUrl?: string;
  };
  vehicleId: {
    _id: string;
    type: string;
    totalSeats: number;
  };
  route: {
    fromLocationId: {
      _id: string;
      name: string;
      province: string;
    };
    toLocationId: {
      _id: string;
      name: string;
      province: string;
    };
    stops: any[];
  };
  departureTime: string;
  expectedArrivalTime: string;
  price: number;
  status: 'scheduled' | 'departed' | 'arrived' | 'cancelled';
  seats: Array<{
    seatNumber: string;
    status: 'available' | 'booked' | 'reserved';
    bookingId?: string;
  }>;
  availableSeats: number;
  createdAt: string;
  updatedAt: string;
}

export interface TripStats {
  totalTrips: number;
  scheduledTrips: number;
  departedTrips: number;
  arrivedTrips: number;
  cancelledTrips: number;
  totalRevenue: number;
  averagePrice: number;
}

export interface TripFilters {
  status?: string;
  companyId?: string;
  fromLocation?: string;
  toLocation?: string;
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
}

class TripAdminService {
  private adaptMockToAdminTrip(mock: any): Trip {
    return {
      _id: mock._id || `mock-${Date.now()}`,
      companyId: {
        _id: mock.company?._id || 'mock-company',
        name: mock.company?.name || 'Mock Company',
        logoUrl: undefined,
      },
      vehicleId: {
        _id: mock.vehicleId?._id || 'mock-vehicle',
        type: mock.vehicleId?.type || 'Xe khách',
        totalSeats: mock.vehicleId?.totalSeats || mock.availableSeats || 45,
      },
      route: {
        fromLocationId: {
          _id: 'mock-from',
          name: mock.from || mock.route?.fromLocationId?.name || 'Điểm đi',
          province: mock.route?.fromLocationId?.province || mock.from || '—',
        },
        toLocationId: {
          _id: 'mock-to',
          name: mock.to || mock.route?.toLocationId?.name || 'Điểm đến',
          province: mock.route?.toLocationId?.province || mock.to || '—',
        },
        stops: mock.route?.stops || [],
      },
      departureTime: mock.departureTime,
      expectedArrivalTime: mock.expectedArrivalTime || mock.arrivalTime,
      price: mock.price || 0,
      status: (mock.status as any) || 'scheduled',
      seats: Array.isArray(mock.seats) ? mock.seats : [],
      availableSeats: mock.availableSeats ?? (Array.isArray(mock.seats) ? mock.seats.filter((s: any) => s.status === 'available').length : 0),
      createdAt: mock.createdAt || new Date().toISOString(),
      updatedAt: mock.updatedAt || new Date().toISOString(),
    };
  }
  // Lấy tất cả chuyến xe
  async getAllTrips(filters?: TripFilters): Promise<Trip[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.companyId) params.append('companyId', filters.companyId);
      if (filters?.fromLocation) params.append('fromLocation', filters.fromLocation);
      if (filters?.toLocation) params.append('toLocation', filters.toLocation);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

      // Use management endpoint for admin access
      const response = await apiService.get(`/trips/management/all?${params.toString()}`);
      return response.data as Trip[];
    } catch (error) {
      console.error('Error getting all trips:', error);
      // Offline fallback using mock data
      const from = filters?.fromLocation || '';
      const to = filters?.toLocation || '';
      const date = filters?.dateFrom || filters?.dateTo || new Date().toISOString().slice(0, 10);
      const mocks = generateMockTrips(from, to, date);
      return mocks.map(m => this.adaptMockToAdminTrip(m));
    }
  }

  // Lấy chuyến xe theo ID
  async getTripById(tripId: string): Promise<Trip> {
    try {
      console.log('Get trip by ID requested for:', tripId);
      // TODO: call backend when available
      return {
        _id: tripId,
        companyId: { _id: 'mock-company', name: 'Mock Company' },
        vehicleId: { _id: 'mock-vehicle', type: 'Mock Vehicle', totalSeats: 45 },
        route: {
          fromLocationId: { _id: 'mock-from', name: 'Mock From', province: 'Mock Province' },
          toLocationId: { _id: 'mock-to', name: 'Mock To', province: 'Mock Province' },
          stops: []
        },
        departureTime: new Date().toISOString(),
        expectedArrivalTime: new Date(Date.now() + 3600000).toISOString(),
        price: 100000,
        status: 'scheduled',
        seats: [],
        availableSeats: 45,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Trip;
    } catch (error) {
      console.error('Error getting trip by id:', error);
      throw new Error('Không thể lấy thông tin chuyến xe');
    }
  }

  // Tạo chuyến xe mới
  async createTrip(tripData: Partial<Trip>): Promise<Trip> {
    try {
      console.log('Create trip requested with data:', tripData);
      // TODO: call backend when available
      return {
        _id: 'mock-trip-id',
        companyId: { _id: 'mock-company', name: 'Mock Company' },
        vehicleId: { _id: 'mock-vehicle', type: 'Mock Vehicle', totalSeats: 45 },
        route: {
          fromLocationId: { _id: 'mock-from', name: 'Mock From', province: 'Mock Province' },
          toLocationId: { _id: 'mock-to', name: 'Mock To', province: 'Mock Province' },
          stops: []
        },
        departureTime: new Date().toISOString(),
        expectedArrivalTime: new Date(Date.now() + 3600000).toISOString(),
        price: 100000,
        status: 'scheduled',
        seats: [],
        availableSeats: 45,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Trip;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw new Error('Không thể tạo chuyến xe mới');
    }
  }

  // Cập nhật chuyến xe
  async updateTrip(tripId: string, tripData: Partial<Trip>): Promise<Trip> {
    try {
      console.log('Update trip requested for:', tripId, 'with data:', tripData);
      // TODO: call backend when available
      return {
        _id: tripId,
        companyId: { _id: 'mock-company', name: 'Mock Company' },
        vehicleId: { _id: 'mock-vehicle', type: 'Mock Vehicle', totalSeats: 45 },
        route: {
          fromLocationId: { _id: 'mock-from', name: 'Mock From', province: 'Mock Province' },
          toLocationId: { _id: 'mock-to', name: 'Mock To', province: 'Mock Province' },
          stops: []
        },
        departureTime: new Date().toISOString(),
        expectedArrivalTime: new Date(Date.now() + 3600000).toISOString(),
        price: 100000,
        status: tripData.status || 'scheduled',
        seats: [],
        availableSeats: 45,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Trip;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw new Error('Không thể cập nhật chuyến xe');
    }
  }

  // Cập nhật trạng thái chuyến xe
  async updateTripStatus(tripId: string, status: string): Promise<Trip> {
    try {
      console.log('Update status requested for trip:', tripId, 'to status:', status);
      // TODO: call backend when available
      return {
        _id: tripId,
        companyId: { _id: 'mock-company', name: 'Mock Company' },
        vehicleId: { _id: 'mock-vehicle', type: 'Mock Vehicle', totalSeats: 45 },
        route: {
          fromLocationId: { _id: 'mock-from', name: 'Mock From', province: 'Mock Province' },
          toLocationId: { _id: 'mock-to', name: 'Mock To', province: 'Mock Province' },
          stops: []
        },
        departureTime: new Date().toISOString(),
        expectedArrivalTime: new Date(Date.now() + 3600000).toISOString(),
        price: 100000,
        status: status,
        seats: [],
        availableSeats: 45,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Trip;
    } catch (error) {
      console.error('Error updating trip status:', error);
      throw new Error('Không thể cập nhật trạng thái chuyến xe');
    }
  }

  // Xóa chuyến xe
  async deleteTrip(tripId: string): Promise<void> {
    try {
      console.log('Delete requested for trip:', tripId);
      // TODO: call backend when available
      return;
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw new Error('Không thể xóa chuyến xe');
    }
  }

  // Lấy thống kê chuyến xe
  async getTripStats(): Promise<TripStats> {
    try {
      const allTrips = await this.getAllTrips();
      
      const stats: TripStats = {
        totalTrips: allTrips.length,
        scheduledTrips: allTrips.filter(t => t.status === 'scheduled').length,
        departedTrips: allTrips.filter(t => t.status === 'departed').length,
        arrivedTrips: allTrips.filter(t => t.status === 'arrived').length,
        cancelledTrips: allTrips.filter(t => t.status === 'cancelled').length,
        totalRevenue: allTrips.reduce((sum, t) => sum + (t.price || 0), 0),
        averagePrice: allTrips.length > 0 ? allTrips.reduce((sum, t) => sum + (t.price || 0), 0) / allTrips.length : 0
      };
      
      return stats;
    } catch (error) {
      console.error('Error getting trip stats:', error);
      throw new Error('Không thể lấy thống kê chuyến xe');
    }
  }

  // Lấy chuyến xe theo nhà xe
  async getTripsByCompany(companyId: string): Promise<Trip[]> {
    try {
      const response = await apiService.get(`/trips/management/all?companyId=${companyId}`);
      return response.data as Trip[];
    } catch (error) {
      console.error('Error getting trips by company:', error);
      // Fallback: return generic mocks
      const date = new Date().toISOString().slice(0, 10);
      const mocks = generateMockTrips('', '', date);
      return mocks.map(m => this.adaptMockToAdminTrip(m));
    }
  }

  // Lấy chuyến xe theo tuyến đường
  async getTripsByRoute(fromLocation: string, toLocation: string): Promise<Trip[]> {
    try {
      const response = await apiService.get(`/trips/management/all`, {
        params: { fromLocation, toLocation }
      });
      return response.data as Trip[];
    } catch (error) {
      console.error('Error getting trips by route:', error);
      const date = new Date().toISOString().slice(0, 10);
      const mocks = generateMockTrips(fromLocation, toLocation, date);
      return mocks.map(m => this.adaptMockToAdminTrip(m));
    }
  }

  // Lấy chuyến xe theo ngày
  async getTripsByDate(date: string): Promise<Trip[]> {
    try {
      const response = await apiService.get(`/trips/management/all`, {
        params: { date }
      });
      return response.data as Trip[];
    } catch (error) {
      console.error('Error getting trips by date:', error);
      const mocks = generateMockTrips('', '', date);
      return mocks.map(m => this.adaptMockToAdminTrip(m));
    }
  }

  // Lấy chuyến xe theo khoảng thời gian
  async getTripsByDateRange(startDate: string, endDate: string): Promise<Trip[]> {
    try {
      const response = await apiService.get(`/trips/management/all`, {
        params: { startDate, endDate }
      });
      return response.data as Trip[];
    } catch (error) {
      console.error('Error getting trips by date range:', error);
      const mocks = generateMockTrips('', '', startDate);
      return mocks.map(m => this.adaptMockToAdminTrip(m));
    }
  }

  // Lấy chuyến xe theo khoảng giá
  async getTripsByPriceRange(minPrice: number, maxPrice: number): Promise<Trip[]> {
    try {
      const response = await apiService.get(`/trips/management/all`, {
        params: { minPrice, maxPrice }
      });
      return response.data as Trip[];
    } catch (error) {
      console.error('Error getting trips by price range:', error);
      const date = new Date().toISOString().slice(0, 10);
      const mocks = generateMockTrips('', '', date).map(m => ({ ...m, price: Math.max(minPrice, Math.min(maxPrice, m.price || 0)) }));
      return mocks.map(m => this.adaptMockToAdminTrip(m));
    }
  }

  // Tìm kiếm chuyến xe
  async searchTrips(query: string): Promise<Trip[]> {
    try {
      const response = await apiService.get(`/trips/management/all`, {
        params: { search: query }
      });
      return response.data as Trip[];
    } catch (error) {
      console.error('Error searching trips:', error);
      const date = new Date().toISOString().slice(0, 10);
      const mocks = generateMockTrips(query, '', date);
      return mocks.map(m => this.adaptMockToAdminTrip(m));
    }
  }

  // Lấy chuyến xe đang hoạt động (scheduled, departed)
  async getActiveTrips(): Promise<Trip[]> {
    try {
      const response = await apiService.get('/trips/management/all?status=scheduled,departed');
      return response.data as Trip[];
    } catch (error) {
      console.error('Error getting active trips:', error);
      const date = new Date().toISOString().slice(0, 10);
      const mocks = generateMockTrips('', '', date);
      return mocks.map(m => this.adaptMockToAdminTrip(m));
    }
  }

  // Lấy chuyến xe đã hoàn thành
  async getCompletedTrips(): Promise<Trip[]> {
    try {
      const response = await apiService.get('/trips/management/all?status=arrived');
      return response.data as Trip[];
    } catch (error) {
      console.error('Error getting completed trips:', error);
      const date = new Date().toISOString().slice(0, 10);
      const mocks = generateMockTrips('', '', date);
      return mocks.map(m => this.adaptMockToAdminTrip(m));
    }
  }

  // Lấy chuyến xe bị hủy
  async getCancelledTrips(): Promise<Trip[]> {
    try {
      const response = await apiService.get('/trips/management/all?status=cancelled');
      return response.data as Trip[];
    } catch (error) {
      console.error('Error getting cancelled trips:', error);
      const date = new Date().toISOString().slice(0, 10);
      const mocks = generateMockTrips('', '', date);
      return mocks.map(m => this.adaptMockToAdminTrip(m));
    }
  }

  // Xuất dữ liệu chuyến xe
  async exportTrips(format: 'csv' | 'excel' | 'pdf', filters?: TripFilters): Promise<string> {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.companyId) params.append('companyId', filters.companyId);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);

      console.log('Export requested with format:', format, 'and filters:', filters);
      return 'export-placeholder-url';
    } catch (error) {
      console.error('Error exporting trips:', error);
      throw new Error('Không thể xuất dữ liệu chuyến xe');
    }
  }

  // Gửi thông báo cho hành khách
  async sendTripNotification(tripId: string, message: string): Promise<void> {
    try {
      console.log('Notification for trip:', tripId, 'Message:', message);
      // TODO: call backend when available
      return;
    } catch (error) {
      console.error('Error sending trip notification:', error);
      throw new Error('Không thể gửi thông báo');
    }
  }

  // Kiểm tra trạng thái chuyến xe
  async checkTripStatus(tripId: string): Promise<{ status: string; lastUpdated: string }> {
    try {
      const trip = await this.getTripById(tripId);
      return {
        status: trip.status,
        lastUpdated: trip.updatedAt
      };
    } catch (error) {
      console.error('Error checking trip status:', error);
      throw new Error('Không thể kiểm tra trạng thái chuyến xe');
    }
  }
}

export const tripAdminService = new TripAdminService();
export default tripAdminService;
