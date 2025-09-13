import api from "../../../services/api";
import type { Trip } from "../../../types";
import type { Vehicle } from "../../admin/types/vehicle";
import type { LocationData } from "../../trips/types/location";
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

export const searchTripLocations = async (
  query: string
): Promise<LocationData[]> => {
  const response = await api.get<LocationData[]>(
    `/locations/search?q=${query}`
  );
  return response.data;
};
