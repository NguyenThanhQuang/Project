import type { LocationData } from "../features/trips/types/location";
import api from "./api";

/**
 * Lấy danh sách các địa điểm phổ biến (bến xe, thành phố)
 */
export const getPopularLocations = async (): Promise<LocationData[]> => {
  const response = await api.get<LocationData[]>("/locations/popular");
  return response.data;
};

/**
 * Lấy TẤT CẢ các địa điểm đang hoạt động trong hệ thống.
 */
export const getAllLocations = async (): Promise<LocationData[]> => {
  const response = await api.get<LocationData[]>("/locations");
  return response.data;
};

/**
 * Tìm kiếm gợi ý địa điểm dựa trên từ khóa
 * @param keyword Từ khóa tìm kiếm
 */
export const searchLocations = async (
  keyword: string
): Promise<LocationData[]> => {
  if (!keyword || keyword.trim().length < 2) return [];
  const response = await api.get<LocationData[]>(
    `/locations/search?q=${keyword}`
  );
  return response.data;
};
