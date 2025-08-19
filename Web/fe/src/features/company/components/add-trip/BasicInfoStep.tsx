import React, { useMemo } from "react";
import { Grid, TextField, Autocomplete, Box, Typography } from "@mui/material";
import type { AddTripFormState } from "../../types/trip";
import type { Location } from "../../../../types";
import type { Vehicle } from "../../../admin/types/vehicle";

interface BasicInfoStepProps {
  formData: AddTripFormState;
  onFormChange: <K extends keyof AddTripFormState>(
    field: K,
    value: AddTripFormState[K]
  ) => void;
  companyVehicles: Vehicle[];
  allLocations: Location[];
  loadingVehicles: boolean;
  loadingLocations: boolean;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  onFormChange,
  companyVehicles,
  allLocations,
  loadingVehicles,
  loadingLocations,
}) => {
  const selectedVehicle = companyVehicles.find(
    (v) => v._id === formData.vehicleId
  );
  const fromLocation = allLocations.find(
    (l) => l._id === formData.fromLocationId
  );
  const toLocation = allLocations.find((l) => l._id === formData.toLocationId);

  const selectedLocationIds = useMemo(() => {
    const ids = new Set<string | null>();
    if (formData.toLocationId) ids.add(formData.toLocationId);
    formData.stops.forEach((stop) => ids.add(stop.locationId));
    return ids;
  }, [formData.toLocationId, formData.stops]);

  const fromLocationOptions = useMemo(() => {
    return allLocations.filter((loc) => !selectedLocationIds.has(loc._id));
  }, [allLocations, selectedLocationIds]);

  const toLocationOptions = useMemo(() => {
    const ids = new Set<string | null>();
    if (formData.fromLocationId) ids.add(formData.fromLocationId);
    formData.stops.forEach((stop) => ids.add(stop.locationId));
    return allLocations.filter((loc) => !ids.has(loc._id));
  }, [allLocations, formData.fromLocationId, formData.stops]);

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
          options={fromLocationOptions}
          loading={loadingLocations}
          getOptionLabel={(option) => option.name}
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
          options={toLocationOptions}
          loading={loadingLocations}
          getOptionLabel={(option) => option.name}
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
