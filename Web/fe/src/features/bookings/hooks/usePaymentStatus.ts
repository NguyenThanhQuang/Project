import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { lookupBooking } from "../services/bookingService";
import type { LookedUpBooking } from "../types/booking";

type PaymentViewStatus = "loading" | "success" | "cancelled" | "failed";

export const usePaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<PaymentViewStatus>("loading");
  const [bookingDetails, setBookingDetails] = useState<LookedUpBooking | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPaymentResult = async () => {
      const paymentStatus = searchParams.get("status");
      const bookingId = searchParams.get("bookingId");

      if (!bookingId) {
        setError("Không tìm thấy mã đặt vé trong URL.");
        setStatus("failed");
        return;
      }

      if (paymentStatus === "CANCELLED") {
        setStatus("cancelled");
        return;
      }

      if (paymentStatus !== "PAID") {
        setError("Giao dịch thanh toán không thành công.");
        setStatus("failed");
        return;
      }

      try {
        const tempContactPhone = localStorage.getItem("tempContactPhone");
        if (!tempContactPhone) {
          throw new Error("Không tìm thấy thông tin để tra cứu vé.");
        }

        const data = await lookupBooking({
          identifier: bookingId,
          contactPhone: tempContactPhone,
        });

        setBookingDetails(data);
        setStatus("success");
      } catch (err) {
        const errorMessage = getErrorMessage(
          err,
          "Không thể tra cứu thông tin vé. Vui lòng liên hệ hỗ trợ."
        );
        setError(errorMessage);
        setStatus("failed");
      } finally {
        localStorage.removeItem("tempContactPhone");
      }
    };

    processPaymentResult();
  }, [searchParams]);

  return { status, bookingDetails, error };
};
