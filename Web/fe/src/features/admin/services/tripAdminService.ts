import api from "../../../services/api";
import type { CreateTripPayload } from "../../company/types/trip";
import type { AdminTrip } from "../types/trip";

/**
 * Lấy danh sách chuyến đi của một nhà xe cụ thể cho Admin.
 * @param companyId ID của nhà xe
 * @returns Promise chứa mảng các chuyến đi
 */
export const getTripsByCompany = async (
  companyId: string
): Promise<AdminTrip[]> => {
  const response = await api.get<AdminTrip[]>("/trips/management/all", {
    params: { companyId },
  });
  return response.data;
};

/**
 * Gửi yêu cầu hủy một chuyến đi.
 * @param tripId ID của chuyến đi cần hủy
 * @returns Promise chứa thông tin chuyến đi đã được cập nhật
 */
export const cancelTrip = async (tripId: string): Promise<AdminTrip> => {
  const response = await api.patch<AdminTrip>(`/trips/${tripId}/cancel`);
  return response.data;
};

/**
 * Admin tạo một chuyến đi mới cho một nhà xe cụ thể.
 * Endpoint này giống hệt endpoint của company_admin.
 * @param payload Dữ liệu chuyến đi mới
 * @returns Promise chứa thông tin chuyến đi đã tạo
 */
export const createTripForCompany = async (
  payload: CreateTripPayload
): Promise<AdminTrip> => {
  const response = await api.post<AdminTrip>("/trips", payload);
  return response.data;
};
