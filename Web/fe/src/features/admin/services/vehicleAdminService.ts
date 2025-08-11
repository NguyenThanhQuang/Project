import api from "../../../services/api";
import type { Vehicle } from "../../../types";

export interface VehiclePayload {
  companyId: string;
  type: string;
  totalSeats: number;
  description?: string;
}

/**
 * Lấy danh sách xe.
 * @param companyId - (Tùy chọn) Lọc xe theo ID của nhà xe.
 */
export const getVehicles = async (companyId?: string): Promise<Vehicle[]> => {
  const params = companyId ? { companyId } : {};
  const response = await api.get<Vehicle[]>("/vehicles", { params });
  return response.data;
};

/**
 * Lấy thông tin chi tiết của một nhà xe.
 * Cần thiết để hiển thị tên nhà xe khi quản lý xe của riêng họ.
 */
export const getCompanyDetails = async (
  companyId: string
): Promise<{ _id: string; name: string }> => {
  const response = await api.get(`/companies/${companyId}`);
  return response.data;
};

/**
 * Tạo một xe mới.
 */
export const createVehicle = async (data: VehiclePayload): Promise<Vehicle> => {
  const response = await api.post<Vehicle>("/vehicles", data);
  return response.data;
};

/**
 * Cập nhật thông tin xe.
 */
export const updateVehicle = async (
  id: string,
  data: Partial<VehiclePayload>
): Promise<Vehicle> => {
  const response = await api.patch<Vehicle>(`/vehicles/${id}`, data);
  return response.data;
};

/**
 * Xóa một xe.
 */
export const deleteVehicle = async (id: string): Promise<void> => {
  await api.delete(`/vehicles/${id}`);
};
