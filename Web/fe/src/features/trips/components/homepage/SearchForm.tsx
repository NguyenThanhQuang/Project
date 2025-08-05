import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Button,
  TextField,
  Autocomplete,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Search, LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import {
  getPopularLocations,
  searchLocations,
} from "../../../../services/locationService";
import type { Location, SearchState } from "../../../../types";
import dayjs from "dayjs";

export const SearchForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState<SearchState>({
    from: null,
    to: null,
    date: dayjs(),
    passengers: 1,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fromOptions, setFromOptions] = useState<readonly Location[]>([]);
  const [toOptions, setToOptions] = useState<readonly Location[]>([]);
  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);
  const [popularLocations, setPopularLocations] = useState<readonly Location[]>(
    []
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const filteredToOptions = (
    toOptions.length > 0 ? toOptions : popularLocations
  ).filter((option) => searchData.from?._id !== option._id);

  useEffect(() => {
    const fetchPopular = async () => {
      const locations = await getPopularLocations();
      setPopularLocations(locations);
    };
    fetchPopular();
  }, []);

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

  const handleSearch = () => {
    setError(null);
    if (!searchData.from || !searchData.to) {
      setError("Vui lòng chọn điểm đi và điểm đến.");
      return;
    }
    if (searchData.from._id === searchData.to._id) {
      setError("Điểm đi và điểm đến không được trùng nhau.");
      return;
    }

    const searchParams = new URLSearchParams({
      from: searchData.from.province,
      to: searchData.to.province,
      date: searchData.date.format("YYYY-MM-DD"),
      passengers: searchData.passengers.toString(),
    });

    navigate(`/trips/search-results?${searchParams.toString()}`, {
      state: {
        searchQuery: {
          from: searchData.from,
          to: searchData.to,
          date: searchData.date.format("YYYY-MM-DD"),
          passengers: searchData.passengers,
        },
      },
    });
  };

  return (
    <Paper
      elevation={20}
      sx={{
        p: 4,
        borderRadius: 4,
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 20px 40px rgba(0, 119, 190, 0.3)",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          color: "text.primary",
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        Tìm chuyến xe lý tưởng
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            getOptionLabel={(option) => option.name || ""}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            options={filteredToOptions}
            loading={loadingFrom}
            value={searchData.from}
            onChange={(_, newValue) =>
              setSearchData({ ...searchData, from: newValue })
            }
            onInputChange={(_, newInputValue) => {
              debouncedFetchFrom(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Điểm đi"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingFrom ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option._id}>
                <LocationOn sx={{ mr: 1.5, color: "text.secondary" }} />
                <Box>
                  <Typography variant="body1">{option.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.province}
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            options={filteredToOptions}
            loading={loadingTo}
            value={searchData.to}
            onChange={(_, newValue) =>
              setSearchData({ ...searchData, to: newValue })
            }
            onInputChange={(_, newInputValue) => {
              debouncedFetchTo(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Điểm đến"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingTo ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option._id}>
                <LocationOn sx={{ mr: 1.5, color: "text.secondary" }} />
                <Box>
                  <Typography variant="body1">{option.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.province}
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label="Ngày đi"
            value={searchData.date}
            onChange={(newValue) =>
              setSearchData({
                ...searchData,
                date: newValue || dayjs(),
              })
            }
            minDate={dayjs()}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Số lượng khách"
            type="number"
            fullWidth
            value={searchData.passengers}
            onChange={(e) =>
              setSearchData({
                ...searchData,
                passengers: parseInt(e.target.value) || 1,
              })
            }
            inputProps={{ min: 1, max: 10 }}
          />
        </Grid>
        <Grid size={12}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<Search />}
            onClick={handleSearch}
            disabled={!searchData.from || !searchData.to}
            sx={{
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #004c8b 0%, #003366 100%)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                background: "rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            Tìm chuyến xe ngay
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
