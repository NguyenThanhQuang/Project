import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchLocations } from "../../../services/locationService";
import type {
  FilterOptions,
  Filters,
  SearchData,
  TripSearchResult,
} from "../../../types";
import { searchTrips } from "../services/tripService";

export const useTripSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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

  const [searchData, setSearchData] = useState<SearchData>({
    from: null,
    to: null,
    date: dayjs(searchParams.get("date") || undefined),
    passengers: parseInt(searchParams.get("passengers") || "1"),
  });

  useEffect(() => {
    const initLocations = async () => {
      const fromQuery = searchParams.get("from");
      const toQuery = searchParams.get("to");
      if (fromQuery && toQuery) {
        try {
          const [fromResult, toResult] = await Promise.all([
            searchLocations(fromQuery),
            searchLocations(toQuery),
          ]);
          setSearchData((prev) => ({
            ...prev,
            from: fromResult[0] || null,
            to: toResult[0] || null,
          }));
        } catch (e) {
          console.error("Failed to initialize locations from URL", e);
        }
      }
    };
    initLocations();
  }, [searchParams]);

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
            priceRange: [0, response.filters.maxPrice],
          }));
        })
        .catch((err: any) => setError(err.message))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      setError("Thông tin tìm kiếm không đầy đủ trên URL.");
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
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
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

  const handleSearch = () => {
    if (searchData.from && searchData.to) {
      setSearchParams({
        from: searchData.from.province,
        to: searchData.to.province,
        date: searchData.date.format("YYYY-MM-DD"),
        passengers: String(searchData.passengers),
      });
    }
  };

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
  }, []);

  const handleSearchDataChange = useCallback(
    <K extends keyof SearchData>(field: K, value: SearchData[K]) => {
      setSearchData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return {
    isLoading,
    error,
    displayedTrips,
    searchData,
    setSearchData,
    handleSearch,
    filters,
    setFilters,
    filterOptions,
    sortBy,
    setSortBy,
  };
};
