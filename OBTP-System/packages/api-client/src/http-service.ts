import axios, { AxiosInstance } from "axios";

/**
 * Cấu hình Instance Axios dùng chung
 * Tự động gắn Bearer Token nếu có trong localStorage
 */
export const createHttpClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Gắn Token vào Header trước mỗi Request (dành cho phía Web)
  client.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  return client;
};
