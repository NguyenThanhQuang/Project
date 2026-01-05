import api from './api';

// Định nghĩa kiểu dữ liệu User dựa trên backend của bạn
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  avatar?: string;
}

export const userService = {
  // Lấy thông tin cá nhân của user đang đăng nhập
  getMe: async () => {
    const response = await api.get<UserProfile>('/users/me');
    return response.data;
  },

  // Cập nhật thông tin cá nhân
  updateProfile: async (data: Partial<UserProfile>) => {
    const response = await api.patch<UserProfile>('/users/me', data);
    return response.data;
  }
};