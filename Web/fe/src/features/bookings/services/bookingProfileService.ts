import api from "../../../services/api";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import type { MyBooking } from "../types/booking";

/**
 * Lấy danh sách tất cả các booking của người dùng đang đăng nhập.
 */
export const getMyBookings = async (): Promise<MyBooking[]> => {
  try {
    const response = await api.get<MyBooking[]>("/users/me/bookings");
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Không thể tải danh sách chuyến đi.")
    );
  }
};
