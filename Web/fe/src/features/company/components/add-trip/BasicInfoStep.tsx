import React from "react";
import { Grid, TextField, Autocomplete, Box, Typography } from "@mui/material";
import type { AddTripFormState } from "../../types/trip";
import type { Vehicle, Location } from "../../../../types";

interface BasicInfoStepProps {
  formData: AddTripFormState;
  onFormChange: (field: keyof AddTripFormState, value: any) => void;
  // Giả sử có các props này được truyền từ page sau khi fetch dữ liệu
  companyVehicles: Vehicle[];
  searchedLocations: Location[];
  onLocationSearch: (query: string) => void;
  loadingVehicles: boolean;
  loadingLocations: boolean;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  onFormChange,
  companyVehicles,
  searchedLocations,
  onLocationSearch,
  loadingVehicles,
  loadingLocations,
}) => {
  // Tìm object đầy đủ của vehicle và location đã chọn để hiển thị
  const selectedVehicle = companyVehicles.find(
    (v) => v._id === formData.vehicleId
  );
  const fromLocation = searchedLocations.find(
    (l) => l._id === formData.fromLocationId
  );
  const toLocation = searchedLocations.find(
    (l) => l._id === formData.toLocationId
  );

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Autocomplete
          fullWidth
          options={companyVehicles}
          loading={loadingVehicles}
          getOptionLabel={(option) =>
            `${option.type} - ${option.totalSeats} ghế`
          }
          value={selectedVehicle || null}
          onChange={(_, newValue) =>
            onFormChange("vehicleId", newValue?._id || null)
          }
          renderInput={(params) => (
            <TextField {...params} label="Chọn xe" required />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option._id}>
              <Box>
                <Typography variant="body1">{option.type}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Số ghế: {option.totalSeats}
                </Typography>
              </Box>
            </Box>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Autocomplete
          fullWidth
          options={searchedLocations}
          loading={loadingLocations}
          getOptionLabel={(option) => option.name}
          onInputChange={(_, newInputValue) => onLocationSearch(newInputValue)}
          value={fromLocation || null}
          onChange={(_, newValue) =>
            onFormChange("fromLocationId", newValue?._id || null)
          }
          renderInput={(params) => (
            <TextField {...params} label="Điểm khởi hành" required />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option._id}>
              {option.name}, {option.province}
            </Box>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Autocomplete
          fullWidth
          options={searchedLocations}
          loading={loadingLocations}
          getOptionLabel={(option) => option.name}
          onInputChange={(_, newInputValue) => onLocationSearch(newInputValue)}
          value={toLocation || null}
          onChange={(_, newValue) =>
            onFormChange("toLocationId", newValue?._id || null)
          }
          renderInput={(params) => (
            <TextField {...params} label="Điểm đến" required />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option._id}>
              {option.name}, {option.province}
            </Box>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default BasicInfoStep;
