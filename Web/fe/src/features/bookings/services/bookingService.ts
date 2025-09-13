import api from "../../../services/api";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import type {
  BookingLookupParams,
  CreateHoldPayload,
  HeldBookingResponse,
  PaymentLinkResponse,
  PopulatedBookingLookupResult,
} from "../types/booking";

/**
 * @description Gửi yêu cầu giữ chỗ (tạo booking với trạng thái 'HELD')
 * @param payload - Thông tin chi tiết để tạo booking giữ chỗ
 * @returns Thông tin của booking vừa được tạo
 */
export const holdSeats = async (
  payload: CreateHoldPayload
): Promise<HeldBookingResponse> => {
  const response = await api.post<HeldBookingResponse>(
    "/bookings/hold",
    payload
  );
  return response.data;
};

/**
 * @description Yêu cầu tạo link thanh toán PayOS cho một booking đã được giữ chỗ
 * @param bookingId - ID của booking có trạng thái 'HELD'
 * @returns Dữ liệu link thanh toán từ PayOS
 */
export const createPaymentLink = async (
  bookingId: string
): Promise<PaymentLinkResponse> => {
  const response = await api.post<PaymentLinkResponse>(
    "/payments/create-link",
    {
      bookingId,
    }
  );
  return response.data;
};

/**
 * @description Tra cứu thông tin chi tiết của một vé/booking
 * @param payload - Thông tin để tra cứu (bookingId và contactPhone)
 * @returns Dữ liệu chi tiết của booking đã được populate
 */
export const lookupBooking = async (
  params: BookingLookupParams
): Promise<PopulatedBookingLookupResult> => {
  try {
    const response = await api.post<PopulatedBookingLookupResult>(
      "/bookings/lookup",
      params
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Không thể tra cứu thông tin vé."));
  }
};
