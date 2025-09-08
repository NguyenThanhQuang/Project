import { API_ENDPOINTS } from '../common/configService';
import apiService from '../common/apiService';

export interface SystemStats {
  totalUsers: number;
  totalCompanies: number;
  totalTrips: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  pendingBookings: number;
}

export interface UserManagement {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface CompanyManagement {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  verifiedAt?: string;
}

class AdminService {
  async getDashboardStats(): Promise<SystemStats> {
    try {
      const response = await apiService.get<SystemStats>(API_ENDPOINTS.ADMIN.DASHBOARD);
      return response.data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  }

  async getUsers(page: number = 1, limit: number = 20, search?: string): Promise<{
    users: UserManagement[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const response = await apiService.get(API_ENDPOINTS.ADMIN.USERS, {
        params: { page, limit, search }
      });
      return response.data as {
        users: UserManagement[];
        total: number;
        page: number;
        limit: number;
      };
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    try {
      await apiService.put(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/status`, { isActive });
    } catch (error) {
      console.error('Update user status error:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await apiService.delete(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  async getCompanies(page: number = 1, limit: number = 20, status?: string): Promise<{
    companies: CompanyManagement[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const response = await apiService.get(API_ENDPOINTS.ADMIN.COMPANIES, {
        params: { page, limit, status }
      });
      return response.data as {
        companies: CompanyManagement[];
        total: number;
        page: number;
        limit: number;
      };
    } catch (error) {
      console.error('Get companies error:', error);
      throw error;
    }
  }

  async updateCompanyStatus(companyId: string, status: string): Promise<void> {
    try {
      await apiService.put(`${API_ENDPOINTS.ADMIN.COMPANIES}/${companyId}/status`, { status });
    } catch (error) {
      console.error('Update company status error:', error);
      throw error;
    }
  }

  async verifyCompany(companyId: string): Promise<void> {
    try {
      await apiService.put(`${API_ENDPOINTS.ADMIN.COMPANIES}/${companyId}/verify`);
    } catch (error) {
      console.error('Verify company error:', error);
      throw error;
    }
  }

  async getSystemReports(startDate: string, endDate: string): Promise<any> {
    try {
      const response = await apiService.get(API_ENDPOINTS.ADMIN.REPORTS, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Get system reports error:', error);
      throw error;
    }
  }

  async getSystemLogs(page: number = 1, limit: number = 50, level?: string): Promise<{
    logs: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const response = await apiService.get('/admin/logs', {
        params: { page, limit, level }
      });
      return response.data as {
        logs: any[];
        total: number;
        page: number;
        limit: number;
      };
    } catch (error) {
      console.error('Get system logs error:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
