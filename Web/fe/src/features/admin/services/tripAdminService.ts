import api from "../../../services/api";
import type { CreateTripPayload } from "../../company/types/trip";
import type { PopulatedTrip } from "../../trips/types/trip";
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

export const updateTrip = async (
  tripId: string,
  payload: UpdateTripPayload
): Promise<AdminTrip> => {
  const response = await api.put<AdminTrip>(`/trips/${tripId}`, payload);
  return response.data;
};

export type UpdateTripPayload = Partial<CreateTripPayload> & {
  isRecurrenceTemplate?: boolean;
};

/**
 * Cập nhật trạng thái kích hoạt của một mẫu chuyến đi lặp lại.
 * @param tripId ID của chuyến đi mẫu
 * @param isActive Trạng thái mới (true: kích hoạt, false: vô hiệu hóa)
 * @returns Promise chứa thông tin chuyến đi đã được cập nhật
 */
export const toggleTripRecurrence = async (
  tripId: string,
  isActive: boolean
): Promise<AdminTrip> => {
  const response = await api.patch<AdminTrip>(
    `/trips/${tripId}/toggle-recurrence`,
    {
      isActive,
    }
  );
  return response.data;
};

export const getTripForEditing = async (
  tripId: string
): Promise<PopulatedTrip> => {
  const response = await api.get<PopulatedTrip>(`/trips/${tripId}`);
  return response.data;
};
