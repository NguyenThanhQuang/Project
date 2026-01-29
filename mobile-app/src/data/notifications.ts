// Mock Notifications Data
export interface MockNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'booking' | 'promotion';
  isRead: boolean;
  createdAt: string;
  data?: {
    bookingId?: string;
    tripId?: string;
    actionUrl?: string;
  };
}

export const mockNotifications: MockNotification[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Đặt vé thành công',
    message: 'Bạn đã đặt vé thành công cho chuyến xe từ Hồ Chí Minh đến Đà Lạt',
    type: 'success',
    isRead: false,
    createdAt: '2024-01-15T10:30:00Z',
    data: {
      bookingId: 'booking1',
      tripId: 'trip1',
    },
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Nhắc nhở chuyến xe',
    message: 'Chuyến xe của bạn sẽ khởi hành trong 2 giờ nữa',
    type: 'warning',
    isRead: false,
    createdAt: '2024-01-15T08:00:00Z',
    data: {
      bookingId: 'booking1',
      tripId: 'trip1',
    },
  },
  {
    id: '3',
    userId: 'user1',
    title: 'Khuyến mãi đặc biệt',
    message: 'Giảm 20% cho tất cả chuyến xe trong tháng này',
    type: 'promotion',
    isRead: true,
    createdAt: '2024-01-14T15:00:00Z',
    data: {
      actionUrl: '/promotions',
    },
  },
  {
    id: '4',
    userId: 'user1',
    title: 'Cập nhật trạng thái',
    message: 'Chuyến xe của bạn đã đến điểm đến',
    type: 'info',
    isRead: true,
    createdAt: '2024-01-13T18:30:00Z',
    data: {
      bookingId: 'booking1',
      tripId: 'trip1',
    },
  },
  {
    id: '5',
    userId: 'user1',
    title: 'Hủy vé thành công',
    message: 'Bạn đã hủy vé thành công và sẽ được hoàn tiền trong 3-5 ngày làm việc',
    type: 'info',
    isRead: true,
    createdAt: '2024-01-12T14:20:00Z',
    data: {
      bookingId: 'booking2',
    },
  },
  {
    id: '6',
    userId: 'user1',
    title: 'Đánh giá chuyến xe',
    message: 'Hãy đánh giá chuyến xe vừa qua để chúng tôi có thể cải thiện dịch vụ',
    type: 'info',
    isRead: false,
    createdAt: '2024-01-11T20:00:00Z',
    data: {
      bookingId: 'booking3',
      tripId: 'trip3',
    },
  },
  {
    id: '7',
    userId: 'user1',
    title: 'Thông báo bảo trì',
    message: 'Hệ thống sẽ bảo trì từ 02:00-04:00 sáng mai',
    type: 'warning',
    isRead: true,
    createdAt: '2024-01-10T16:00:00Z',
  },
  {
    id: '8',
    userId: 'user1',
    title: 'Chào mừng bạn',
    message: 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi',
    type: 'info',
    isRead: true,
    createdAt: '2024-01-09T09:00:00Z',
  },
];

// Helper functions
export const getNotificationsByUserId = (userId: string): MockNotification[] => {
  return mockNotifications.filter(notification => notification.userId === userId);
};

export const getUnreadNotifications = (userId: string): MockNotification[] => {
  return mockNotifications.filter(
    notification => notification.userId === userId && !notification.isRead
  );
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
};

export const markAllNotificationsAsRead = (userId: string): void => {
  mockNotifications.forEach(notification => {
    if (notification.userId === userId) {
      notification.isRead = true;
    }
  });
};

export const deleteNotification = (notificationId: string): void => {
  const index = mockNotifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    mockNotifications.splice(index, 1);
  }
};

export const getNotificationCount = (userId: string): number => {
  return mockNotifications.filter(n => n.userId === userId).length;
};

export const getUnreadCount = (userId: string): number => {
  return mockNotifications.filter(n => n.userId === userId && !n.isRead).length;
};
