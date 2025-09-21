import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { FilterOptions, Filters, TripSearchResult } from "../../../types";
import { searchTrips } from "../services/tripService";

/**
 * 1. Đọc query params từ URL.
 * 2. Gọi API để lấy danh sách chuyến đi gốc.
 * 3. Quản lý state cho việc LỌC và SẮP XẾP kết quả.
 */
export const useTripSearch = () => {
  const [searchParams] = useSearchParams();

  const [originalTrips, setOriginalTrips] = useState<TripSearchResult[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    companies: [],
    vehicleTypes: [],
    maxPrice: 1000000,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    companies: [],
    timeSlots: [],
    vehicleTypes: [],
    priceRange: [0, 1000000],
  });
  const [sortBy, setSortBy] = useState("departureTime");

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const date = searchParams.get("date");
    const passengers = searchParams.get("passengers");

    if (from && to && date) {
      setIsLoading(true);
      setError(null);
      searchTrips({ from, to, date, passengers: parseInt(passengers || "1") })
        .then((response) => {
          setOriginalTrips(response.trips);
          setFilterOptions(response.filters);
          setFilters((prev) => ({
            ...prev,
            priceRange: [0, response.filters.maxPrice || 1000000],
          }));
        })
        .catch((err: any) =>
          setError(err.message || "Lỗi khi tìm kiếm chuyến đi.")
        )
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      setOriginalTrips([]);
    }
  }, [searchParams]);

  const displayedTrips = useMemo(() => {
    let result = [...originalTrips];

    if (filters.companies.length > 0) {
      result = result.filter((trip) =>
        filters.companies.includes(trip.companyId._id)
      );
    }
    if (filters.vehicleTypes.length > 0) {
      result = result.filter((trip) =>
        filters.vehicleTypes.includes(trip.vehicleId.type)
      );
    }
    result = result.filter(
      (trip) =>
        trip.price >= filters.priceRange[0] &&
        trip.price <= filters.priceRange[1]
    );

    if (filters.timeSlots.length > 0) {
      result = result.filter((trip) => {
        const hour = dayjs(trip.departureTime).hour();
        return filters.timeSlots.some((slot) => {
          if (slot === "morning") return hour >= 5 && hour < 12;
          if (slot === "afternoon") return hour >= 12 && hour < 18;
          if (slot === "evening") return hour >= 18 && hour < 22;
          if (slot === "night") return hour >= 22 || hour < 5;
          return false;
        });
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "duration":
          const durationA = dayjs(a.expectedArrivalTime).diff(
            dayjs(a.departureTime)
          );
          const durationB = dayjs(b.expectedArrivalTime).diff(
            dayjs(b.departureTime)
          );
          return durationA - durationB;
        case "departureTime":
        default:
          return (
            new Date(a.departureTime).getTime() -
            new Date(b.departureTime).getTime()
          );
      }
    });

    return result;
  }, [originalTrips, filters, sortBy]);

  return {
    isLoading,
    error,
    displayedTrips,
    filters,
    setFilters,
    filterOptions,
    sortBy,
    setSortBy,
  };
};
