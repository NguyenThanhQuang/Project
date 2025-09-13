import React from "react";
import { useNavigate } from "react-router-dom";
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
import dayjs from "dayjs";
import type { SearchData } from "../../../../types";
import type { LocationData } from "../../../trips/types/location";
interface SearchFormProps {
  searchData: SearchData;
  setSearchData: React.Dispatch<React.SetStateAction<SearchData>>;
  fromOptions: readonly LocationData[];
  fromLoading: boolean;
  onFromInputChange: (value: string) => void;
  toOptions: readonly LocationData[];
  toLoading: boolean;
  onToInputChange: (value: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  searchData,
  setSearchData,
  fromOptions,
  fromLoading,
  onFromInputChange,
  toOptions,
  toLoading,
  onToInputChange,
}) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchData.from && searchData.to) {
      const params = new URLSearchParams({
        from: searchData.from.province,
        to: searchData.to.province,
        date: searchData.date.format("YYYY-MM-DD"),
        passengers: String(searchData.passengers),
      });
      navigate(`/trips/search-results?${params.toString()}`);
    }
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
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Autocomplete
            options={fromOptions}
            filterOptions={(x) => x}
            value={searchData.from}
            onChange={(_, newValue) =>
              setSearchData((prev) => ({ ...prev, from: newValue }))
            }
            onInputChange={(_, newInputValue) =>
              onFromInputChange(newInputValue)
            }
            loading={fromLoading}
            autoHighlight
            includeInputInList
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option;
              }
              return option.name || "";
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Điểm đi"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {fromLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        {/* Lặp lại logic tương tự cho Autocomplete "Điểm đến" */}
        <Grid size={{ xs: 12 }}>
          <Autocomplete
            options={toOptions}
            filterOptions={(x) => x}
            value={searchData.to}
            onChange={(_, newValue) =>
              setSearchData((prev) => ({ ...prev, to: newValue }))
            }
            onInputChange={(_, newInputValue) => onToInputChange(newInputValue)}
            loading={toLoading}
            autoHighlight
            includeInputInList
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name || ""
            }
            isOptionEqualToValue={(option, value) => option._id === value._id}
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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Điểm đến"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {toLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label="Ngày đi"
            value={searchData.date}
            onChange={(newValue) =>
              setSearchData((prev) => ({ ...prev, date: newValue || dayjs() }))
            }
            minDate={dayjs()}
            slotProps={{ textField: { fullWidth: true, required: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Số lượng khách"
            type="number"
            fullWidth
            value={searchData.passengers}
            onChange={(e) =>
              setSearchData((prev) => ({
                ...prev,
                passengers: parseInt(e.target.value) || 1,
              }))
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
