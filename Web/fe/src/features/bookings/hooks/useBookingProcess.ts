import { useState } from "react";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { createPaymentLink, holdSeats } from "../services/bookingService";
import type {
  CreateHoldPayload,
  HeldBookingResponse,
  PaymentLinkResponse,
} from "../types/booking";

/**
 * @description Interface để đóng gói kết quả trả về từ quy trình
 * Chứa cả dữ liệu link thanh toán và dữ liệu booking (quan trọng là `heldUntil`)
 */
export interface PaymentProcessResult {
  paymentLinkData: PaymentLinkResponse;
  bookingData: HeldBookingResponse;
}

export const useBookingProcess = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processResult, setProcessResult] =
    useState<PaymentProcessResult | null>(null);

  /**
   * @description Bắt đầu toàn bộ quy trình: giữ chỗ -> tạo link thanh toán
   * @param payload - Dữ liệu đầy đủ từ form checkout
   * @returns Một object chứa cả paymentLinkData và bookingData
   */
  const startPaymentProcess = async (
    payload: CreateHoldPayload
  ): Promise<PaymentProcessResult> => {
    setIsLoading(true);
    setError(null);
    setProcessResult(null);

    try {
      const heldBooking = await holdSeats(payload);
      const bookingId = heldBooking._id;

      if (!bookingId) {
        throw new Error("Không nhận được ID booking sau khi giữ chỗ.");
      }

      const paymentLinkData = await createPaymentLink(bookingId);

      const result: PaymentProcessResult = {
        paymentLinkData,
        bookingData: heldBooking,
      };

      setProcessResult(result);
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(
        err,
        "Đã có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại."
      );
      setError(errorMessage);

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    processResult,
    startPaymentProcess,
    setError,
  };
};
