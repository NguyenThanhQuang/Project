import api from "../../../services/api";
import type { Company } from "../types/company";
import type { Vehicle, VehiclePayload } from "../types/vehicle";

/**
 * Lấy danh sách xe của một nhà xe cụ thể.
 * @param companyId ID của nhà xe cần lấy danh sách xe.
 * @returns Promise chứa một mảng các Vehicle.
 */
export const getVehiclesByCompany = async (
  companyId: string
): Promise<Vehicle[]> => {
  const response = await api.get<Vehicle[]>("/vehicles", {
    params: { companyId },
  });
  return response.data;
};

/**
 * Lấy thông tin chi tiết của một nhà xe.
 * @param companyId ID của nhà xe.
 * @returns Promise chứa thông tin chi tiết của Company.
 */
export const getCompanyDetails = async (
  companyId: string
): Promise<Company> => {
  const response = await api.get<Company>(`/companies/${companyId}`);
  return response.data;
};

/**
 * Tạo một xe mới.
 * @param data Dữ liệu của xe mới cần tạo.
 * @returns Promise chứa thông tin Vehicle vừa được tạo.
 */
export const createVehicle = async (data: VehiclePayload): Promise<Vehicle> => {
  const response = await api.post<Vehicle>("/vehicles", data);
  return response.data;
};

/**
 * Cập nhật thông tin xe.
 * @param id ID của xe cần cập nhật.
 * @param data Dữ liệu cần cập nhật.
 * @returns Promise chứa thông tin Vehicle sau khi đã cập nhật.
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
 * @param id ID của xe cần xóa.
 * @returns Promise rỗng.
 */
export const deleteVehicle = async (id: string): Promise<void> => {
  await api.delete(`/vehicles/${id}`);
};
