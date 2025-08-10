import api from "../../../services/api";
import type { Location, Trip, Vehicle } from "../../../types";
import type { CreateTripPayload } from "../types/trip";

export const createTrip = async (payload: CreateTripPayload): Promise<Trip> => {
  const response = await api.post<Trip>("/trips", payload);
  return response.data;
};

export const getVehiclesByCompany = async (
  companyId: string
): Promise<Vehicle[]> => {
  const response = await api.get<Vehicle[]>(`/vehicles?companyId=${companyId}`);
  return response.data;
};

// đã có ở locationService, tạo ở đây để tập trung)
export const searchTripLocations = async (
  query: string
): Promise<Location[]> => {
  const response = await api.get<Location[]>(`/locations/search?q=${query}`);
  return response.data;
};
