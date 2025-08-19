import type { Location } from "../types";
import api from "./api";

/**
 * Lấy danh sách các địa điểm phổ biến (bến xe, thành phố)
 */
export const getPopularLocations = async (): Promise<Location[]> => {
  const response = await api.get<Location[]>("/locations/popular");
  return response.data;
};

/**
 * Lấy TẤT CẢ các địa điểm đang hoạt động trong hệ thống.
 */
export const getAllLocations = async (): Promise<Location[]> => {
  const response = await api.get<Location[]>("/locations");
  return response.data;
};

/**
 * Tìm kiếm gợi ý địa điểm dựa trên từ khóa
 * @param keyword Từ khóa tìm kiếm
 */
export const searchLocations = async (keyword: string): Promise<Location[]> => {
  if (!keyword || keyword.trim().length < 2) return [];
  const response = await api.get<Location[]>(`/locations/search?q=${keyword}`);
  return response.data;
};
