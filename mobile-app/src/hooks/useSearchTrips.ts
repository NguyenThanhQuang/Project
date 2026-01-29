import { useCallback, useState } from "react";
import { generateMockTrips } from "../data";
import {
  SearchFormData,
  Trip,
  UseSearchTripsReturn,
} from "../types/index-types";

export const useSearchTrips = (): UseSearchTripsReturn => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTrips = useCallback(async (params: SearchFormData) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Searching trips with params:", params);

      const results = generateMockTrips(
        params.from,
        params.to,
        params.departureDate
      );
      setTrips(results || []);

      if (!results || results.length === 0) {
        setError("Không tìm thấy chuyến đi phù hợp");
      }
    } catch (err) {
      console.error("Error searching trips:", err);
      setError("Có lỗi xảy ra khi tìm kiếm chuyến đi");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setTrips([]);
    setError(null);
  }, []);

  return {
    trips,
    loading,
    error,
    searchTrips,
    clearResults,
  };
};
