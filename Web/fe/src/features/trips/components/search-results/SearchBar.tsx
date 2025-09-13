import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Autocomplete,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Search, SwapHoriz, LocationOn } from "@mui/icons-material";
import type { SearchData } from "../../../../types";
import type { LocationData } from "../../../trips/types/location";
import dayjs from "dayjs";

interface SearchBarProps {
  searchData: SearchData;
  onSearchDataChange: <K extends keyof SearchData>(
    field: K,
    value: SearchData[K]
  ) => void;
  onSearch: () => void;
  onSwapLocations: () => void;
  // Props cho Autocomplete
  fromOptions: readonly LocationData[];
  toOptions: readonly LocationData[];
  onFromInputChange: (value: string) => void;
  onToInputChange: (value: string) => void;
  loadingFrom: boolean;
  loadingTo: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchData,
  onSearchDataChange,
  onSearch,
  onSwapLocations,
  fromOptions,
  toOptions,
  onFromInputChange,
  onToInputChange,
  loadingFrom,
  loadingTo,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Tìm kiếm chuyến đi
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 2.5 }}>
          <Autocomplete
            options={fromOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={searchData.from}
            onChange={(_, newValue) => onSearchDataChange("from", newValue)}
            onInputChange={(_, newInputValue) =>
              onFromInputChange(newInputValue)
            }
            loading={loadingFrom}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Điểm đi"
                size="small"
                fullWidth
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
        <Grid size={{ xs: 12, md: 0.5 }} sx={{ textAlign: "center" }}>
          <IconButton onClick={onSwapLocations} color="primary">
            <SwapHoriz />
          </IconButton>
        </Grid>
        <Grid size={{ xs: 12, md: 2.5 }}>
          <Autocomplete
            options={toOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={searchData.to}
            onChange={(_, newValue) => onSearchDataChange("to", newValue)}
            onInputChange={(_, newInputValue) => onToInputChange(newInputValue)}
            loading={loadingTo}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Điểm đến"
                size="small"
                fullWidth
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
        <Grid size={{ xs: 12, md: 2 }}>
          <DatePicker
            label="Ngày đi"
            value={searchData.date}
            onChange={(newValue) =>
              onSearchDataChange("date", newValue || dayjs())
            }
            minDate={dayjs()}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 1.5 }}>
          <TextField
            label="Số khách"
            type="number"
            size="small"
            fullWidth
            value={searchData.passengers}
            onChange={(e) =>
              onSearchDataChange("passengers", parseInt(e.target.value) || 1)
            }
            inputProps={{ min: 1, max: 10 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<Search />}
            onClick={onSearch}
            sx={{
              py: 1.2,
              background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
            }}
          >
            Tìm kiếm
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
