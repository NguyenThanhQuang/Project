import apiService from './common/apiService';
import { Vehicle, VehiclePayload, VehicleResponse } from '../types/vehicle';


export const vehicleService = {
  // Lấy danh sách xe
  async getVehicles(page: number = 1, limit: number = 10): Promise<VehicleResponse> {
    try {
      const response = await apiService.get(`/vehicles?page=${page}&limit=${limit}`);
      return response.data as VehicleResponse;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error('Không thể tải danh sách xe');
    }
  },

  // Lấy xe theo ID
  async getVehicleById(vehicleId: string): Promise<Vehicle> {
    try {
      const response = await apiService.get(`/vehicles/${vehicleId}`);
      return response.data as Vehicle;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error('Không thể tải thông tin xe');
    }
  },

  // Lấy xe theo nhà xe
  async getVehiclesByCompany(companyId: string, page: number = 1, limit: number = 10): Promise<VehicleResponse> {
    try {
      const response = await apiService.get(`/vehicles?companyId=${companyId}&page=${page}&limit=${limit}`);
      return response.data as VehicleResponse;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error('Không thể tải danh sách xe của nhà xe');
    }
  },

  // Tạo xe mới
  async createVehicle(vehicleData: VehiclePayload): Promise<Vehicle> {
    try {
      const response = await apiService.post('/vehicles', vehicleData);
      return response.data as Vehicle;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error('Không thể tạo xe mới');
    }
  },

  // Cập nhật xe
  async updateVehicle(vehicleId: string, vehicleData: Partial<VehiclePayload>): Promise<Vehicle> {
    try {
      const response = await apiService.patch(`/vehicles/${vehicleId}`, vehicleData);
      return response.data as Vehicle;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error('Không thể cập nhật xe');
    }
  },

  // Xóa xe
  async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      await apiService.delete(`/vehicles/${vehicleId}`);
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error('Không thể xóa xe');
    }
  },

  // Thay đổi trạng thái xe
  async updateVehicleStatus(vehicleId: string, status: 'active' | 'inactive'): Promise<Vehicle> {
    try {
      const response = await apiService.patch(`/vehicles/${vehicleId}`, { status });
      return response.data as Vehicle;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error('Không thể cập nhật trạng thái xe');
    }
  },

  // Lấy xe theo loại
  async getVehiclesByType(type: string, page: number = 1, limit: number = 10): Promise<VehicleResponse> {
    try {
      const response = await apiService.get(`/vehicles?type=${type}&page=${page}&limit=${limit}`);
      return response.data as VehicleResponse;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error('Không thể tải danh sách xe theo loại');
    }
  },

  // Tìm kiếm xe
  async searchVehicles(query: string, page: number = 1, limit: number = 10): Promise<VehicleResponse> {
    try {
      const response = await apiService.get(`/vehicles/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      return response.data as VehicleResponse;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error('Không thể tìm kiếm xe');
    }
  },

  // Lấy thống kê xe
  async getVehicleStats(): Promise<{
    totalVehicles: number;
    activeVehicles: number;
    inactiveVehicles: number;
    vehiclesByType: Record<string, number>;
  }> {
    try {
      const response = await apiService.get('/vehicles/stats');
      return response.data as {
        totalVehicles: number;
        activeVehicles: number;
        inactiveVehicles: number;
        vehiclesByType: Record<string, number>;
      };
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error('Không thể tải thống kê xe');
    }
  },
};
