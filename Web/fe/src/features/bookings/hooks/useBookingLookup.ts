import { useState } from "react";
import { lookupBooking } from "../services/bookingService";
import type {
  BookingLookupParams,
  PopulatedBookingLookupResult,
} from "../types/booking";

export const useBookingLookup = () => {
  const [bookingResult, setBookingResult] =
    useState<PopulatedBookingLookupResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performLookup = async (params: BookingLookupParams) => {
    setIsLoading(true);
    setError(null);
    setBookingResult(null);

    try {
      const result = await lookupBooking(params);
      setBookingResult(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearLookup = () => {
    setBookingResult(null);
    setError(null);
  };

  return { bookingResult, isLoading, error, performLookup, clearLookup };
};
