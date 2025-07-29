import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { NotificationItem } from '../types/notification';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Mock data cho demo
  useEffect(() => {
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Tải cao trên server',
        message: 'Hệ thống đang gặp tải cao, thời gian phản hồi có thể chậm hơn bình thường.',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 phút trước
        isRead: false,
        category: 'system',
      },
      {
        id: '2',
        type: 'success',
        title: 'Nhà xe mới đăng ký',
        message: 'Xe Khách ABC đã đăng ký thành công và đang chờ phê duyệt.',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 phút trước
        isRead: false,
        category: 'company',
      },
      {
        id: '3',
        type: 'info',
        title: 'Backup thành công',
        message: 'Hệ thống đã sao lưu dữ liệu thành công lúc 03:00 AM.',
        timestamp: new Date(Date.now() - 4 * 60 * 60000).toISOString(), // 4 giờ trước
        isRead: false,
        category: 'system',
      },
      {
        id: '4',
        type: 'error',
        title: 'Lỗi thanh toán',
        message: 'Phát hiện 3 giao dịch thanh toán thất bại cần được xử lý.',
        timestamp: new Date(Date.now() - 6 * 60 * 60000).toISOString(), // 6 giờ trước
        isRead: false,
        category: 'finance',
      },
      {
        id: '5',
        type: 'info',
        title: 'Người dùng mới',
        message: '25 người dùng mới đã đăng ký trong 24 giờ qua.',
        timestamp: new Date(Date.now() - 12 * 60 * 60000).toISOString(), // 12 giờ trước
        isRead: true,
        category: 'user',
      },
      {
        id: '6',
        type: 'warning',
        title: 'Cần phê duyệt',
        message: 'Có 5 nhà xe mới cần được phê duyệt.',
        timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 ngày trước
        isRead: true,
        category: 'company',
      },
      {
        id: '7',
        type: 'success',
        title: 'Doanh thu tăng',
        message: 'Doanh thu tháng này tăng 15% so với tháng trước.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), // 2 ngày trước
        isRead: true,
        category: 'finance',
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = useCallback((notificationData: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const newNotification: NotificationItem = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance to add a new notification
      if (Math.random() > 0.95) { // 5% chance every interval
        const types: NotificationItem['type'][] = ['info', 'warning', 'success', 'error'];
        const categories: NotificationItem['category'][] = ['system', 'user', 'company', 'finance'];
        
        const messages = [
          { title: 'Người dùng mới', message: 'Có người dùng mới vừa đăng ký tài khoản.', category: 'user' as const, type: 'info' as const },
          { title: 'Đặt vé mới', message: 'Có đơn đặt vé mới cần xử lý.', category: 'company' as const, type: 'info' as const },
          { title: 'Cảnh báo bảo mật', message: 'Phát hiện hoạt động đăng nhập bất thường.', category: 'system' as const, type: 'warning' as const },
          { title: 'Thanh toán thành công', message: 'Giao dịch thanh toán được xử lý thành công.', category: 'finance' as const, type: 'success' as const },
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        addNotification({
          ...randomMessage,
          isRead: false,
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext; 