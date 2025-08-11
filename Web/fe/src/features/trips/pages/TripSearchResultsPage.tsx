/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  useSearchParams,
  useLocation as useReactRouterLocation,
} from "react-router-dom";
import dayjs from "dayjs";
import { debounce } from "lodash";

import {
  SearchBar,
  FilterSidebar,
  TripCard,
} from "../components/search-results";
import { searchTrips } from "../services/tripService";
import {
  getPopularLocations,
  searchLocations,
} from "../../../services/locationService";
import type {
  TripSearchResult,
  Location,
  SearchData,
  Filters,
  FilterOptions,
} from "../../../types";

export const TripSearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const reactRouterLocation = useReactRouterLocation();

  // --- STATE CHO DỮ LIỆU CHÍNH ---
  const [originalTrips, setOriginalTrips] = useState<TripSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popularLocations, setPopularLocations] = useState<readonly Location[]>(
    []
  );

  // --- STATE CHO CÁC COMPONENT CON ---
  const [searchData, setSearchData] = useState<SearchData>({
    from: reactRouterLocation.state?.searchQuery?.from || null,
    to: reactRouterLocation.state?.searchQuery?.to || null,
    date: dayjs(searchParams.get("date") || dayjs()),
    passengers: parseInt(searchParams.get("passengers") || "1"),
  });

  const [filters, setFilters] = useState<Filters>({
    companies: [],
    timeSlots: [],
    vehicleTypes: [],
    priceRange: [0, 1000000],
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    companies: [],
    vehicleTypes: [],
    maxPrice: 1000000,
  });

  const [sortBy, setSortBy] = useState("departureTime");

  // State cho Autocomplete trong SearchBar
  const [fromOptions, setFromOptions] = useState<readonly Location[]>([]);
  const [toOptions, setToOptions] = useState<readonly Location[]>([]);
  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);

  // --- FETCH DỮ LIỆU TỪ BACKEND ---
  useEffect(() => {
    const fetchTripData = async () => {
      const fromProvince = searchParams.get("from");
      const toProvince = searchParams.get("to");
      const date = searchParams.get("date");
      const passengers = searchParams.get("passengers");

      if (!fromProvince || !toProvince || !date) {
        setError("Thông tin tìm kiếm không đầy đủ.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await searchTrips({
          from: fromProvince,
          to: toProvince,
          date,
          passengers: parseInt(passengers || "1"),
        });
        // Giả sử response có dạng { trips: [], filters: {} }
        // setOriginalTrips(response.trips);
        // setFilterOptions(response.filters);
        // setFilters({...filters, priceRange: [0, response.filters.maxPrice]}); // Cập nhật slider

        // Tạm thời dùng mock
        setOriginalTrips(response.trips);
        // Gán dữ liệu cho bộ lọc
        setFilterOptions({
          ...response.filters,
          companies: response.filters.companies.map(
            (c: { _id: string; name: string }) => ({
              _id: c._id,
              name: c.name,
              code: "",
              isActive: true,
            })
          ),
        });
        // Cập nhật khoảng giá cho slider dựa trên giá cao nhất từ kết quả
        setFilters((prevFilters) => ({
          ...prevFilters,
          priceRange: [0, response.filters.maxPrice],
        }));
      } catch (err) {
        setError("Không thể tải danh sách chuyến đi. Vui lòng thử lại.");
        setOriginalTrips([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTripData();
  }, [searchParams]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const locations = await getPopularLocations();
        setPopularLocations(locations);
      } catch (e) {
        console.error("Failed to fetch popular locations:", e);
      }
    };
    fetchPopular();
  }, []);

  // --- LOGIC LỌC VÀ SẮP XẾP ---
  const displayedTrips = useMemo(() => {
    let result = [...originalTrips];
    const fromAutocompleteOptions =
      fromOptions.length > 0 ? fromOptions : popularLocations;
    const toAutocompleteOptions = (
      toOptions.length > 0 ? toOptions : popularLocations
    ).filter((option) => searchData.from?._id !== option._id);
    // Lọc theo nhà xe
    if (filters.companies.length > 0) {
      result = result.filter((trip) =>
        filters.companies.includes(trip.companyId._id)
      );
    }

    // Lọc theo loại xe
    if (filters.vehicleTypes.length > 0) {
      result = result.filter((trip) =>
        filters.vehicleTypes.includes(trip.vehicleId.type)
      );
    }

    // Lọc theo giờ khởi hành
    if (filters.timeSlots.length > 0) {
      result = result.filter((trip) => {
        const departureHour = new Date(trip.departureTime).getHours();
        return filters.timeSlots.some((slot) => {
          if (slot === "morning")
            return departureHour >= 6 && departureHour < 12;
          if (slot === "afternoon")
            return departureHour >= 12 && departureHour < 18;
          if (slot === "evening")
            return departureHour >= 18 && departureHour < 24;
          if (slot === "night") return departureHour >= 0 && departureHour < 6;
          return false;
        });
      });
    }

    // Lọc theo khoảng giá
    result = result.filter(
      (trip) =>
        trip.price >= filters.priceRange[0] &&
        trip.price <= filters.priceRange[1]
    );

    // Sắp xếp
    result.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "duration":
          /* TODO */ return 0;
        default:
          return (
            new Date(a.departureTime).getTime() -
            new Date(b.departureTime).getTime()
          );
      }
    });

    return result;
  }, [
    originalTrips,
    fromOptions,
    popularLocations,
    toOptions,
    filters.companies,
    filters.vehicleTypes,
    filters.timeSlots,
    filters.priceRange,
    searchData.from?._id,
    sortBy,
  ]);

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
  const handleSearchDataChange = (
    field: keyof SearchData,
    value: SearchData[keyof SearchData]
  ) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    if (!searchData.from || !searchData.to) return;
    setSearchParams({
      from: searchData.from.province,
      to: searchData.to.province,
      date: searchData.date.format("YYYY-MM-DD"),
      passengers: searchData.passengers.toString(),
    });
  };

  const handleSwapLocations = () => {
    setSearchData((prev) => ({ ...prev, from: prev.to, to: prev.from }));
  };

  // Logic cho Autocomplete (giống Homepage)
  const fetchLocations = async (
    inputValue: string,
    setOptions: React.Dispatch<React.SetStateAction<readonly Location[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoading(true);
    const results = await searchLocations(inputValue);
    setOptions(results);
    setLoading(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchFrom = useCallback(
    debounce(
      (query) => fetchLocations(query, setFromOptions, setLoadingFrom),
      300
    ),
    []
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchTo = useCallback(
    debounce((query) => fetchLocations(query, setToOptions, setLoadingTo), 300),
    []
  );
  const fromAutocompleteOptions =
    fromOptions.length > 0 ? fromOptions : popularLocations;
  const toAutocompleteOptions = (
    toOptions.length > 0 ? toOptions : popularLocations
  ).filter((option) => searchData.from?._id !== option._id);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <SearchBar
        searchData={searchData}
        onSearchDataChange={handleSearchDataChange}
        onSearch={handleSearch}
        onSwapLocations={handleSwapLocations}
        fromOptions={fromAutocompleteOptions}
        toOptions={toAutocompleteOptions}
        onFromInputChange={debouncedFetchFrom}
        onToInputChange={debouncedFetchTo}
        loadingFrom={loadingFrom}
        loadingTo={loadingTo}
      />

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          {/* <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            filterOptions={filterOptions}
          /> */}
        </Grid>

        <Grid size={{ xs: 12, md: 12 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {loading
                ? "Đang tìm kiếm..."
                : `Tìm thấy ${displayedTrips.length} chuyến đi`}
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Sắp xếp theo</InputLabel>
              <Select
                value={sortBy}
                label="Sắp xếp theo"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="departureTime">Giờ khởi hành</MenuItem>
                <MenuItem value="price">Giá vé</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {error && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : displayedTrips.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Không tìm thấy chuyến đi phù hợp
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {displayedTrips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default TripSearchResultsPage;
