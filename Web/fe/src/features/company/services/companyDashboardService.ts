import api from "../../../services/api";
import type { VehiclePayload } from "../../admin/types/vehicle";
import type { CompanyTrip, CompanyVehicle } from "../types/dashboard";

/**
 * Lấy tất cả các chuyến đi của nhà xe đang đăng nhập
 */
export const getMyTrips = async (): Promise<CompanyTrip[]> => {
  const response = await api.get<CompanyTrip[]>("/trips/management/all");
  return response.data;
};

/**
 * Lấy tất cả các xe của nhà xe đang đăng nhập
 */
export const getMyVehicles = async (): Promise<CompanyVehicle[]> => {
  const response = await api.get<CompanyVehicle[]>("/vehicles");
  return response.data;
};

/**
 * Tạo một xe mới cho nhà xe đang đăng nhập
 */
export const createMyVehicle = async (
  data: VehiclePayload
): Promise<CompanyVehicle> => {
  const response = await api.post<CompanyVehicle>("/vehicles", data);
  return response.data;
};
export const updateMyVehicle = async (
  vehicleId: string,
  data: VehiclePayload
): Promise<CompanyVehicle> => {
  const response = await api.patch(`/vehicles/${vehicleId}`, data);
  return response.data;
};