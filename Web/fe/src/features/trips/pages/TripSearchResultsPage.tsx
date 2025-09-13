import React from "react";
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
  SearchBar,
  FilterSidebar,
  TripCard,
} from "../components/search-results";
import { useTripSearch } from "../hooks/useTripSearch";
import { useLocationSearch } from "../hooks/useLocationSearch";

export const TripSearchResultsPage: React.FC = () => {
  const {
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
  } = useTripSearch();

  const fromLocationSearch = useLocationSearch();
  const toLocationSearch = useLocationSearch();

  const handleSwapLocations = () => {
    setSearchData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* SearchBar được cung cấp đầy đủ dữ liệu và hàm xử lý từ các hooks */}
      <SearchBar
        searchData={searchData}
        onSearchDataChange={(field, value) =>
          setSearchData((prev) => ({ ...prev, [field]: value }))
        }
        onSearch={handleSearch}
        onSwapLocations={handleSwapLocations}
        fromOptions={fromLocationSearch.options}
        toOptions={toLocationSearch.options}
        onFromInputChange={fromLocationSearch.handleInputChange}
        onToInputChange={toLocationSearch.handleInputChange}
        loadingFrom={fromLocationSearch.loading}
        loadingTo={toLocationSearch.loading}
      />

      <Grid container spacing={4}>
        {/* Sidebar Lọc */}
        <Grid size={{ xs: 12, md: 3 }}>
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            filterOptions={filterOptions}
          />
        </Grid>

        {/* Khu vực hiển thị kết quả */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {isLoading
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
                <MenuItem value="duration">Thời gian di chuyển</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Xử lý các trạng thái: Lỗi, Loading, Rỗng, và Có kết quả */}
          {error && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {isLoading ? (
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
