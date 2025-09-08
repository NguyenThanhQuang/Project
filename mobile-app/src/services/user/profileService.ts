import { API_ENDPOINTS } from '../common/configService';
import apiService from '../common/apiService';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class ProfileService {
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiService.get<UserProfile>(API_ENDPOINTS.USER.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async updateProfile(profileData: UpdateProfileData): Promise<UserProfile> {
    try {
      const response = await apiService.put<UserProfile>(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    try {
      await apiService.put(API_ENDPOINTS.USER.CHANGE_PASSWORD, passwordData);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiService.post<{ avatarUrl: string }>(
        API_ENDPOINTS.USER.UPLOAD_AVATAR,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  }

  async deleteAvatar(): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.USER.UPLOAD_AVATAR);
    } catch (error) {
      console.error('Delete avatar error:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
