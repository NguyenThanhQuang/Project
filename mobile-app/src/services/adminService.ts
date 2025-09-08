import { store } from "../store/index-store";
import { Booking } from "../types/booking";
import { Company } from "../types/company";
import { User } from "../types/user";
import apiService from "./common/apiService";

// Helper function to get auth token
const getAuthToken = () => {
  const state = store.getState();
  return state.auth.token;
};

// Helper function to create authenticated request
const createAuthRequest = (config: any) => {
  const token = getAuthToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
};

// Helper function to handle API errors
const handleApiError = (error: any, defaultMessage: string): Error => {
  console.error("API Error:", error);

  // Provide specific error messages based on error type
  if (error.message === "Network Error") {
    return new Error("Lỗi kết nối mạng - vui lòng kiểm tra internet");
  } else if (error.code === "ECONNABORTED") {
    return new Error("Yêu cầu quá thời gian chờ - vui lòng thử lại");
  } else if (error.response?.status === 404) {
    return new Error("Không tìm thấy dữ liệu yêu cầu");
  } else if (error.response?.status === 401) {
    return new Error("Phiên đăng nhập hết hạn - vui lòng đăng nhập lại");
  } else if (error.response?.status === 403) {
    return new Error("Không có quyền truy cập");
  } else if (error.response?.status >= 500) {
    return new Error("Lỗi máy chủ - vui lòng thử lại sau");
  }

  // Return server error message if available, otherwise use default
  return new Error(error.response?.data?.message || defaultMessage);
};

export interface AdminStats {
  totalCompanies: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  todayBookings: number;
  activeTrips: number;
  newCompaniesToday: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  isEmailVerified: boolean;
  accountStatus?: "active" | "temporary_ban" | "permanent_ban";
  bannedUntil?: string;
  banReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  _id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: "pending" | "active" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  userId: string;
  tripId: string;
  seats: string[];
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}

export const adminService = {
  // Test endpoint public để kiểm tra backend có hoạt động không
  async testPublicEndpoint(): Promise<any> {
    try {
      console.log("Testing public endpoint...");
      const response = await apiService.get("/dashboard/public-test");
      console.log("Public endpoint response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Public endpoint failed:", error);
      throw handleApiError(error, "Không thể kết nối đến máy chủ");
    }
  },

  // Test endpoint để kiểm tra authentication
  async testAuth(): Promise<any> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Không có token xác thực");
      }

      console.log("Testing auth with token:", token.substring(0, 20) + "...");

      // Test với một endpoint đơn giản
      const response = await apiService.get("/companies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error testing auth:", error);
      throw handleApiError(error, "Không thể xác thực người dùng");
    }
  },

  // Lấy thống kê tổng quan
  async getAdminStats(): Promise<AdminStats> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Không có token xác thực");
      }

      console.log(
        "Getting admin stats with token:",
        token.substring(0, 20) + "..."
      );

      const response = await apiService.get("/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as AdminStats;
    } catch (error: any) {
      console.error("Error fetching admin stats:", error);
      throw new Error("Không thể tải thống kê quản trị");
    }
  },

  // Lấy danh sách người dùng
  async getUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: User[]; total: number }> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Không có token xác thực");
      }

      const response = await apiService.get(
        `/users?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data as { users: User[]; total: number };
    } catch (error: any) {
      console.error("Error fetching users:", error);
      throw new Error("Không thể tải danh sách người dùng");
    }
  },

  // Cập nhật người dùng bởi Admin (roles, accountStatus, bannedUntil, banReason)
  async adminUpdateUser(
    userId: string,
    payload: Partial<{
      roles: string[];
      accountStatus: "active" | "temporary_ban" | "permanent_ban";
      bannedUntil: string | null;
      banReason: string | null;
    }>
  ): Promise<User> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Không có token xác thực");
      }
      const response = await apiService.patch(
        `/users/${userId}/admin`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data as User;
    } catch (error: any) {
      console.error("Error admin updating user:", error);
      throw new Error("Không thể cập nhật người dùng");
    }
  },

  // Tiện ích nhanh
  async banTemporary(userId: string, untilISO: string, reason?: string) {
    return this.adminUpdateUser(userId, {
      accountStatus: "temporary_ban",
      bannedUntil: untilISO,
      banReason: reason || null,
    });
  },

  async banPermanent(userId: string, reason?: string) {
    return this.adminUpdateUser(userId, {
      accountStatus: "permanent_ban",
      bannedUntil: null,
      banReason: reason || null,
    });
  },

  async unbanUser(userId: string) {
    return this.adminUpdateUser(userId, {
      accountStatus: "active",
      bannedUntil: null,
      banReason: null,
    });
  },

  // Lấy danh sách công ty
  async getCompanies(
    page: number = 1,
    limit: number = 10
  ): Promise<{ companies: Company[]; total: number }> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Không có token xác thực");
      }

      const response = await apiService.get(
        `/companies?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data as { companies: Company[]; total: number };
    } catch (error: any) {
      console.error("Error fetching companies:", error);
      throw new Error("Không thể tải danh sách công ty");
    }
  },

  // Lấy danh sách đặt vé
  async getBookings(
    page: number = 1,
    limit: number = 10
  ): Promise<{ bookings: Booking[]; total: number }> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Không có token xác thực");
      }

      const response = await apiService.get(
        `/bookings?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data as { bookings: Booking[]; total: number };
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      throw new Error("Không thể tải danh sách đặt vé");
    }
  },

  // Phê duyệt/từ chối công ty
  async updateCompanyStatus(
    companyId: string,
    status: "active" | "rejected"
  ): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Không có token xác thực");
      }

      await apiService.patch(
        `/companies/${companyId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      console.error("Error updating company status:", error);
      throw new Error("Không thể cập nhật trạng thái công ty");
    }
  },

  // Cập nhật trạng thái người dùng
  async updateUserStatus(
    userId: string,
    status: "active" | "suspended"
  ): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Không có token xác thực");
      }

      await apiService.patch(
        `/users/${userId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      console.error("Error updating user status:", error);
      throw new Error("Không thể cập nhật trạng thái người dùng");
    }
  },
};
