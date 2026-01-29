// Configuration constants for the mobile app
export const APP_CONFIG = {
  // App Info
  APP_NAME: 'Bus Booking App',
  APP_VERSION: '1.0.0',
  BUILD_NUMBER: '1',
  
  // API Configuration
  API: {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },
  
  // Storage Keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_DATA: 'userData',
    RECENT_SEARCHES: 'recentTripSearches',
    BOOKING_HISTORY: 'bookingHistory',
    APP_SETTINGS: 'appSettings',
  },
  
  // Validation Rules
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 50,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 100,
    PHONE_REGEX: /^[0-9]{10,11}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  
  // UI Configuration
  UI: {
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 300,
    LOADING_TIMEOUT: 10000,
    ERROR_DISPLAY_DURATION: 5000,
  },
  
  // Business Rules
  BUSINESS: {
    MAX_PASSENGERS: 10,
    MIN_BOOKING_ADVANCE: 1, // hours
    MAX_BOOKING_ADVANCE: 30, // days
    SEAT_SELECTION_TIMEOUT: 300, // seconds
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // User
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
  },
  
  // Locations
  LOCATIONS: {
    BASE: '/locations',
    SEARCH: '/locations/search',
    POPULAR: '/locations/popular',
    BY_PROVINCE: '/locations/province',
  },
  
  // Trips
  TRIPS: {
    BASE: '/trips',
    SEARCH: '/trips/search',
    AVAILABLE: '/trips/available',
    POPULAR: '/trips/popular',
    BY_COMPANY: '/companies/:companyId/trips',
  },
  
  // Bookings
  BOOKINGS: {
    BASE: '/bookings',
    CREATE: '/bookings',
    USER_BOOKINGS: '/bookings/user',
    CANCEL: '/bookings/:id/cancel',
    REFUND: '/bookings/:id/refund',
  },
  
  // Companies
  COMPANIES: {
    BASE: '/companies',
    PROFILE: '/companies/profile',
    UPDATE: '/companies/profile',
    UPLOAD_LOGO: '/companies/logo',
  },
  
  // Vehicles
  VEHICLES: {
    BASE: '/vehicles',
    SEARCH: '/vehicles/search',
    STATS: '/vehicles/stats',
  },
  
  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    COMPANIES: '/admin/companies',
    TRIPS: '/admin/trips',
    BOOKINGS: '/admin/bookings',
    REPORTS: '/admin/reports',
  },
  
  // Company Admin
  COMPANY_ADMIN: {
    DASHBOARD: '/company-admin/dashboard',
    TRIPS: '/company-admin/trips',
    VEHICLES: '/company-admin/vehicles',
    DRIVERS: '/company-admin/drivers',
    BOOKINGS: '/company-admin/bookings',
    REPORTS: '/company-admin/reports',
  },
  
  // System
  SYSTEM: {
    HEALTH: '/health',
    CONFIG: '/config',
    VERSION: '/version',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: {
    CONNECTION_FAILED: 'Không thể kết nối đến máy chủ',
    TIMEOUT: 'Yêu cầu quá thời gian chờ',
    SERVER_ERROR: 'Lỗi máy chủ, vui lòng thử lại sau',
  },
  
  AUTH: {
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
    TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
    UNAUTHORIZED: 'Bạn không có quyền truy cập',
  },
  
  VALIDATION: {
    REQUIRED_FIELD: 'Trường này là bắt buộc',
    INVALID_EMAIL: 'Email không hợp lệ',
    INVALID_PHONE: 'Số điện thoại không hợp lệ',
    PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 6 ký tự',
  },
  
  BUSINESS: {
    TRIP_NOT_FOUND: 'Không tìm thấy chuyến xe phù hợp',
    SEAT_NOT_AVAILABLE: 'Ghế đã được đặt',
    BOOKING_FAILED: 'Không thể đặt vé, vui lòng thử lại',
    PAYMENT_FAILED: 'Thanh toán thất bại',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Đăng nhập thành công',
    REGISTER_SUCCESS: 'Đăng ký thành công',
    PASSWORD_CHANGED: 'Đổi mật khẩu thành công',
  },
  
  BOOKING: {
    BOOKING_SUCCESS: 'Đặt vé thành công',
    CANCELLATION_SUCCESS: 'Hủy vé thành công',
    REFUND_SUCCESS: 'Hoàn tiền thành công',
  },
  
  PROFILE: {
    UPDATE_SUCCESS: 'Cập nhật thông tin thành công',
    AVATAR_UPLOADED: 'Cập nhật ảnh đại diện thành công',
  },
} as const;

// Default values
export const DEFAULT_VALUES = {
  USER: {
    AVATAR: 'https://via.placeholder.com/150',
    LANGUAGE: 'vi',
    THEME: 'light',
  },
  
  TRIP: {
    DEFAULT_PASSENGERS: 1,
    DEFAULT_DATE: new Date().toISOString().split('T')[0],
  },
  
  UI: {
    DEFAULT_ANIMATION: true,
    DEFAULT_NOTIFICATIONS: true,
    DEFAULT_SOUND: true,
  },
} as const;
