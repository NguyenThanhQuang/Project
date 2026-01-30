// src/services/api.ts
import axios from "axios";
import { store } from "../store";

// Kiểm tra environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

if (!API_BASE_URL) {
  console.error(
    "VITE_API_BASE_URL is not defined in your environment variables."
  );
  throw new Error(
    "API base URL is not configured. Please check your environment variables."
  );
}

// Tạo instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Interceptor cho request: thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response: xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      const { dispatch } = store;
      
      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      
      // Dispatch logout action
      dispatch({ type: "auth/logout" });
      
      // Redirect đến trang login nếu không phải trang auth
      const currentPath = window.location.pathname;
      const authPaths = ["/login", "/register", "/auth/verify-email", "/forgot-password"];
      
      if (!authPaths.some(path => currentPath.startsWith(path))) {
        window.location.href = "/login";
      }
    }
    
    // Xử lý lỗi network
    if (!error.response) {
      console.error("Network error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;