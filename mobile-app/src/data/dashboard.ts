// Mock Dashboard Data
export interface MockDashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  totalTrips: number;
  activeUsers: number;
  pendingBookings: number;
  completedTrips: number;
  cancelledBookings: number;
}

export interface MockChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

export interface MockRecentActivity {
  id: string;
  type: 'booking' | 'user' | 'trip' | 'payment' | 'review';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  userId?: string;
  bookingId?: string;
  tripId?: string;
}

export interface MockTopRoute {
  id: string;
  from: string;
  to: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  popularity: number; // 1-100
}

export interface MockTopCompany {
  id: string;
  name: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalVehicles: number;
  totalTrips: number;
}

export interface MockRevenueData {
  daily: MockChartData;
  weekly: MockChartData;
  monthly: MockChartData;
  yearly: MockChartData;
}

export interface MockUserGrowth {
  total: number;
  new: number;
  active: number;
  inactive: number;
  premium: number;
}

export interface MockBookingTrends {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
}

// Dashboard Statistics
export const mockDashboardStats: MockDashboardStats = {
  totalUsers: 15420,
  totalBookings: 45678,
  totalRevenue: 2345678900, // VND
  totalTrips: 1234,
  activeUsers: 8920,
  pendingBookings: 1234,
  completedTrips: 1098,
  cancelledBookings: 567,
};

// Revenue Chart Data
export const mockRevenueData: MockRevenueData = {
  daily: {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        label: 'Doanh thu (triệu VND)',
        data: [45, 52, 38, 67, 89, 76, 54],
        backgroundColor: ['rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)'],
        borderWidth: 2,
      },
    ],
  },
  weekly: {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [
      {
        label: 'Doanh thu (triệu VND)',
        data: [320, 450, 380, 520],
        backgroundColor: ['rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(54, 162, 235, 1)'],
        borderWidth: 2,
      },
    ],
  },
  monthly: {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'Doanh thu (tỷ VND)',
        data: [2.1, 2.3, 2.8, 3.2, 3.5, 3.8, 4.1, 4.3, 4.0, 3.7, 3.9, 4.2],
        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)'],
        borderWidth: 2,
      },
    ],
  },
  yearly: {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Doanh thu (tỷ VND)',
        data: [15.2, 18.7, 22.3, 28.9, 35.6],
        backgroundColor: ['rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgba(255, 159, 64, 1)'],
        borderWidth: 2,
      },
    ],
  },
};

// User Growth Data
export const mockUserGrowth: MockUserGrowth = {
  total: 15420,
  new: 1234,
  active: 8920,
  inactive: 4560,
  premium: 1890,
};

// Booking Trends
export const mockBookingTrends: MockBookingTrends = {
  total: 45678,
  confirmed: 38901,
  pending: 1234,
  cancelled: 567,
  completed: 10976,
};

// Top Routes
export const mockTopRoutes: MockTopRoute[] = [
  {
    id: 'route1',
    from: 'Hồ Chí Minh',
    to: 'Đà Lạt',
    totalBookings: 5678,
    totalRevenue: 234567890,
    averageRating: 4.5,
    popularity: 95,
  },
  {
    id: 'route2',
    from: 'Hà Nội',
    to: 'Hạ Long',
    totalBookings: 4321,
    totalRevenue: 189012345,
    averageRating: 4.3,
    popularity: 88,
  },
  {
    id: 'route3',
    from: 'Đà Nẵng',
    to: 'Huế',
    totalBookings: 3456,
    totalRevenue: 156789012,
    averageRating: 4.1,
    popularity: 82,
  },
  {
    id: 'route4',
    from: 'Nha Trang',
    to: 'Đà Lạt',
    totalBookings: 2987,
    totalRevenue: 134567890,
    averageRating: 4.7,
    popularity: 78,
  },
  {
    id: 'route5',
    from: 'Cần Thơ',
    to: 'Hồ Chí Minh',
    totalBookings: 2765,
    totalRevenue: 123456789,
    averageRating: 3.9,
    popularity: 75,
  },
];

// Top Companies
export const mockTopCompanies: MockTopCompany[] = [
  {
    id: 'company1',
    name: 'Phương Trang',
    totalBookings: 15678,
    totalRevenue: 678901234,
    averageRating: 4.6,
    totalVehicles: 234,
    totalTrips: 567,
  },
  {
    id: 'company2',
    name: 'Mai Linh',
    totalBookings: 13456,
    totalRevenue: 567890123,
    averageRating: 4.4,
    totalVehicles: 198,
    totalTrips: 456,
  },
  {
    id: 'company3',
    name: 'Thanh Bưởi',
    totalBookings: 12345,
    totalRevenue: 456789012,
    averageRating: 4.2,
    totalVehicles: 167,
    totalTrips: 345,
  },
  {
    id: 'company4',
    name: 'Hoàng Long',
    totalBookings: 10987,
    totalRevenue: 345678901,
    averageRating: 4.3,
    totalVehicles: 145,
    totalTrips: 298,
  },
  {
    id: 'company5',
    name: 'Sao Việt',
    totalBookings: 9876,
    totalRevenue: 234567890,
    averageRating: 4.1,
    totalVehicles: 123,
    totalTrips: 234,
  },
];

// Recent Activities
export const mockRecentActivities: MockRecentActivity[] = [
  {
    id: 'activity1',
    type: 'booking',
    title: 'Đặt vé mới',
    description: 'Nguyễn Văn A đã đặt vé từ Hồ Chí Minh đến Đà Lạt',
    timestamp: '2024-01-15T15:30:00Z',
    status: 'success',
    userId: 'user1',
    bookingId: 'booking1',
    tripId: 'trip1',
  },
  {
    id: 'activity2',
    type: 'user',
    title: 'Người dùng mới',
    description: 'Trần Thị B đã đăng ký tài khoản mới',
    timestamp: '2024-01-15T14:45:00Z',
    status: 'info',
    userId: 'user2',
  },
  {
    id: 'activity3',
    type: 'payment',
    title: 'Thanh toán thành công',
    description: 'Đã nhận thanh toán 450,000 VND cho booking #BK001',
    timestamp: '2024-01-15T14:20:00Z',
    status: 'success',
    bookingId: 'booking1',
  },
  {
    id: 'activity4',
    type: 'trip',
    title: 'Chuyến xe mới',
    description: 'Công ty Phương Trang đã thêm chuyến xe mới từ Hà Nội đến Hạ Long',
    timestamp: '2024-01-15T13:55:00Z',
    status: 'info',
    tripId: 'trip2',
  },
  {
    id: 'activity5',
    type: 'review',
    title: 'Đánh giá mới',
    description: 'Lê Văn C đã đánh giá 5 sao cho chuyến xe từ Đà Nẵng đến Huế',
    timestamp: '2024-01-15T13:30:00Z',
    status: 'success',
    userId: 'user3',
    tripId: 'trip3',
  },
  {
    id: 'activity6',
    type: 'booking',
    title: 'Hủy vé',
    description: 'Phạm Thị D đã hủy vé từ Vũng Tàu về Hồ Chí Minh',
    timestamp: '2024-01-15T13:15:00Z',
    status: 'warning',
    userId: 'user4',
    bookingId: 'booking2',
  },
  {
    id: 'activity7',
    type: 'trip',
    title: 'Cập nhật lịch trình',
    description: 'Chuyến xe từ Nha Trang đến Đà Lạt đã được cập nhật lịch trình',
    timestamp: '2024-01-15T12:45:00Z',
    status: 'info',
    tripId: 'trip4',
  },
  {
    id: 'activity8',
    type: 'payment',
    title: 'Hoàn tiền',
    description: 'Đã hoàn tiền 380,000 VND cho booking #BK002',
    timestamp: '2024-01-15T12:30:00Z',
    status: 'success',
    bookingId: 'booking2',
  },
];

// Helper functions
export const getDashboardStats = (): MockDashboardStats => {
  return mockDashboardStats;
};

export const getRevenueData = (period: keyof MockRevenueData): MockChartData => {
  return mockRevenueData[period];
};

export const getTopRoutes = (limit: number = 5): MockTopRoute[] => {
  return mockTopRoutes.slice(0, limit);
};

export const getTopCompanies = (limit: number = 5): MockTopCompany[] => {
  return mockTopCompanies.slice(0, limit);
};

export const getRecentActivities = (limit: number = 10): MockRecentActivity[] => {
  return mockRecentActivities.slice(0, limit);
};

export const getUserGrowth = (): MockUserGrowth => {
  return mockUserGrowth;
};

export const getBookingTrends = (): MockBookingTrends => {
  return mockBookingTrends;
};

export const addRecentActivity = (activity: Omit<MockRecentActivity, 'id' | 'timestamp'>): MockRecentActivity => {
  const newActivity: MockRecentActivity = {
    ...activity,
    id: `activity${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  
  mockRecentActivities.unshift(newActivity);
  
  // Giữ chỉ 100 activities gần nhất
  if (mockRecentActivities.length > 100) {
    mockRecentActivities.splice(100);
  }
  
  return newActivity;
};

export const updateDashboardStats = (updates: Partial<MockDashboardStats>): void => {
  Object.assign(mockDashboardStats, updates);
};
