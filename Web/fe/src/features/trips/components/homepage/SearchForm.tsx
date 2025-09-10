import React, { useState, useCallback } from "react";
import {
  Grid,
  Button,
  TextField,
  Autocomplete,
  Paper,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Search, SwapHoriz, LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { searchLocations } from "../../../../services/locationService";
import type { Location } from "../../../../types";

interface SearchFormProps {
  searchData: {
    from: Location | null;
    to: Location | null;
    date: Dayjs;
    passengers: number;
  };
  setSearchData: React.Dispatch<
    React.SetStateAction<{
      from: Location | null;
      to: Location | null;
      date: Dayjs;
      passengers: number;
    }>
  >;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  searchData,
  setSearchData,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [fromOptions, setFromOptions] = useState<readonly Location[]>([]);
  const [toOptions, setToOptions] = useState<readonly Location[]>([]);
  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);

  const handleDataChange = <K extends keyof typeof searchData>(
    field: K,
    value: (typeof searchData)[K]
  ) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSwapLocations = () => {
    setSearchData((prev) => ({ ...prev, from: prev.to, to: prev.from }));
  };

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
      from: searchData.from._id,
      to: searchData.to._id,
      date: searchData.date.format("YYYY-MM-DD"),
      passengers: searchData.passengers.toString(),
    });

    navigate(`/trips/search-results?${searchParams.toString()}`);
  };

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

  const debouncedFetchFrom = useCallback(
    debounce(
      (query) => fetchLocations(query, setFromOptions, setLoadingFrom),
      300
    ),
    []
  );
  const debouncedFetchTo = useCallback(
    debounce((query) => fetchLocations(query, setToOptions, setLoadingTo), 300),
    []
  );

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
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 5.5 }}>
          <Autocomplete
            options={fromOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={searchData.from}
            onChange={(_, newValue) => handleDataChange("from", newValue)}
            onInputChange={(_, newInputValue) =>
              debouncedFetchFrom(newInputValue)
            }
            loading={loadingFrom}
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
        <Grid size={{ xs: 12, md: 1 }} sx={{ textAlign: "center" }}>
          <IconButton
            onClick={handleSwapLocations}
            color="primary"
            aria-label="đảo chiều"
          >
            <SwapHoriz />
          </IconButton>
        </Grid>
        <Grid size={{ xs: 12, md: 5.5 }}>
          {/* [SỬA ĐỔI] Autocomplete cho điểm đến */}
          <Autocomplete
            options={toOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={searchData.to}
            onChange={(_, newValue) => handleDataChange("to", newValue)}
            onInputChange={(_, newInputValue) =>
              debouncedFetchTo(newInputValue)
            }
            loading={loadingTo}
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
          {/* [SỬA ĐỔI] DatePicker */}
          <DatePicker
            label="Ngày đi"
            value={searchData.date}
            onChange={(newValue) =>
              handleDataChange("date", newValue || dayjs())
            }
            minDate={dayjs()}
            slotProps={{ textField: { fullWidth: true, required: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          {/* [SỬA ĐỔI] TextField số lượng khách */}
          <TextField
            label="Số lượng khách"
            type="number"
            fullWidth
            value={searchData.passengers}
            onChange={(e) =>
              handleDataChange("passengers", parseInt(e.target.value) || 1)
            }
            inputProps={{ min: 1, max: 10 }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
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
              "&:disabled": { background: "rgba(0, 0, 0, 0.12)" },
            }}
          >
            Tìm chuyến xe
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
