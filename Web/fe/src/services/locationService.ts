import type { Location } from "../types";
import api from "./api";

export const searchLocations = async (keyword: string): Promise<Location[]> => {
  if (!keyword || keyword.trim().length < 2) {
    return [];
  }
  try {
    const response = await api.get<Location[]>(`/locations/search`, {
      params: { q: keyword },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching locations:", error);
    return [];
  }
};

export const getPopularLocations = async (): Promise<Location[]> => {
  try {
    const response = await api.get<Location[]>("/locations/popular");
    return response.data;
  } catch (error) {
    console.error("Error fetching popular locations:", error);
    return [];
  }
};
