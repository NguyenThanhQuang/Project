import React from "react";
import {
  Grid,
  Button,
  TextField,
  Autocomplete,
  Paper,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Search, LocationOn, SwapHoriz } from "@mui/icons-material";
import type { useSharedSearchForm } from "../../hooks/useSharedSearchForm";
import dayjs from "dayjs";

type SharedSearchFormProps = ReturnType<typeof useSharedSearchForm> & {
  variant: "hero" | "searchBar";
};

export const SharedSearchForm: React.FC<SharedSearchFormProps> = ({
  variant,
  searchData,
  handleSearchDataChange,
  handleSearch,
  handleSwapLocations,
  fromProps,
  toProps,
}) => {
  const paperStyles =
    variant === "hero"
      ? {
          p: 4,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 20px 40px rgba(0, 119, 190, 0.3)",
        }
      : {
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)",
          boxShadow: 3,
        };

  return (
    <Paper elevation={variant === "hero" ? 20 : 3} sx={paperStyles}>
      <Typography
        variant={variant === "hero" ? "h4" : "h5"}
        sx={{
          mb: 3,
          color: "text.primary",
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {variant === "hero" ? "Tìm chuyến xe lý tưởng" : "Tìm kiếm chuyến đi"}
      </Typography>

      <Grid container spacing={2} alignItems="center">
        {/* Điểm đi */}
        <Grid size={{ xs: 12, md: variant === "hero" ? 12 : 2.5 }}>
          <Autocomplete
            options={fromProps.options}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={searchData.from}
            onChange={(_, newValue) => handleSearchDataChange("from", newValue)}
            onInputChange={(_, newInputValue) =>
              fromProps.onInputChange(newInputValue)
            }
            loading={fromProps.loading}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField {...params} label="Điểm đi" required />
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

        {/* Nút Swap */}
        {variant === "searchBar" && (
          <Grid size={{ xs: 12, md: 0.5 }} sx={{ textAlign: "center" }}>
            <IconButton onClick={handleSwapLocations} color="primary">
              <SwapHoriz />
            </IconButton>
          </Grid>
        )}

        {/* Điểm đến */}
        <Grid size={{ xs: 12, md: variant === "hero" ? 12 : 2.5 }}>
          <Autocomplete
            options={toProps.options}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={searchData.to}
            onChange={(_, newValue) => handleSearchDataChange("to", newValue)}
            onInputChange={(_, newInputValue) =>
              toProps.onInputChange(newInputValue)
            }
            loading={toProps.loading}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField {...params} label="Điểm đến" required />
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

        {/* Ngày đi */}
        <Grid size={{ xs: 12, sm: 6, md: variant === "hero" ? 6 : 2 }}>
          <DatePicker
            label="Ngày đi"
            value={searchData.date}
            onChange={(newValue) => {
              if (newValue) handleSearchDataChange("date", newValue);
            }}
            minDate={dayjs()}
            slotProps={{ textField: { fullWidth: true, required: true } }}
          />
        </Grid>

        {/* Số khách */}
        <Grid size={{ xs: 12, sm: 6, md: variant === "hero" ? 6 : 1.5 }}>
          <TextField
            label="Số khách"
            type="number"
            fullWidth
            value={searchData.passengers}
            onChange={(e) =>
              handleSearchDataChange(
                "passengers",
                parseInt(e.target.value) || 1
              )
            }
            inputProps={{ min: 1, max: 10 }}
          />
        </Grid>

        {/* Nút tìm kiếm */}
        <Grid size={{ xs: 12, md: variant === "hero" ? 12 : 2.5 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<Search />}
            onClick={handleSearch}
            disabled={!searchData.from || !searchData.to}
            sx={{
              py: variant === "hero" ? 2 : 1.8,
              fontSize: "1.1rem",
              fontWeight: 700,
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
