import axios from 'axios';

// Lấy địa chỉ API từ biến môi trường
// Nếu không có biến môi trường thì fallback về localhost:3000/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout sau 10s để tránh treo
});

// 1. Request Interceptor: Tự động đính kèm Token vào Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Xử lý lỗi trả về (ví dụ: 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu API trả về lỗi 401 (Hết hạn token hoặc chưa đăng nhập)
    if (error.response && error.response.status === 401) {
      console.warn('Phiên đăng nhập hết hạn, đang đăng xuất...');
      
      // Xóa thông tin user cũ
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Chuyển hướng về trang chủ hoặc trang login (tùy chọn reload)
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;