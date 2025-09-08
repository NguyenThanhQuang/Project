import { API_ENDPOINTS } from '../common/configService';
import apiService from '../common/apiService';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  bookingReminders: boolean;
  tripUpdates: boolean;
  promotions: boolean;
}

class NotificationService {
  async getNotifications(limit: number = 20, page: number = 1): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const response = await apiService.get('/notifications', {
        params: { limit, page }
      });
      return response.data as {
        notifications: Notification[];
        total: number;
        page: number;
        limit: number;
      };
    } catch (error) {
      console.error('Get notifications error:', error);
      return {
        notifications: [],
        total: 0,
        page,
        limit
      };
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiService.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await apiService.put('/notifications/read-all');
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await apiService.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await apiService.get('/notifications/settings');
      return response.data as NotificationSettings;
    } catch (error) {
      console.error('Get notification settings error:', error);
      // Return default settings
      return {
        pushNotifications: true,
        emailNotifications: true,
        smsNotifications: false,
        bookingReminders: true,
        tripUpdates: true,
        promotions: false
      };
    }
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    try {
      const response = await apiService.put('/notifications/settings', settings);
      return response.data as NotificationSettings;
    } catch (error) {
      console.error('Update notification settings error:', error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiService.get('/notifications/unread-count');
      return (response.data as { count: number }).count;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }
}

export const notificationService = new NotificationService();
