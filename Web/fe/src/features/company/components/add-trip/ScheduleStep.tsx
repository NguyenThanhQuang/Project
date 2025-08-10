import React from "react";
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  TextField,
  Autocomplete,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { Add, Delete } from "@mui/icons-material";
import type { AddTripFormState, RouteStopFormState } from "../../types/trip";
import type { Location } from "../../../../types";

interface ScheduleStepProps {
  formData: AddTripFormState;
  onFormChange: (field: keyof AddTripFormState, value: any) => void;
  onAddStop: () => void;
  onRemoveStop: (stopId: string) => void;
  onUpdateStop: (
    stopId: string,
    field: keyof RouteStopFormState,
    value: any
  ) => void;
  // Props giả định
  searchedLocations: Location[];
  onLocationSearch: (query: string) => void;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({
  formData,
  onFormChange,
  onAddStop,
  onRemoveStop,
  onUpdateStop,
  searchedLocations,
  onLocationSearch,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <DatePicker
          label="Ngày khởi hành"
          value={formData.departureTime}
          onChange={(value) => onFormChange("departureTime", value)}
          sx={{ width: "100%" }}
          disablePast
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TimePicker
          label="Giờ khởi hành"
          value={formData.departureTime}
          onChange={(value) => onFormChange("departureTime", value)}
          sx={{ width: "100%" }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TimePicker
          label="Giờ đến dự kiến"
          value={formData.expectedArrivalTime}
          onChange={(value) => onFormChange("expectedArrivalTime", value)}
          sx={{ width: "100%" }}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            mb: 2,
          }}
        >
          <Typography variant="h6">Trạm dừng trung gian</Typography>
          <Button startIcon={<Add />} onClick={onAddStop} variant="outlined">
            Thêm trạm dừng
          </Button>
        </Box>

        {formData.stops.map((stop, index) => (
          <Card key={stop.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1">
                  Trạm dừng {index + 1}
                </Typography>
                <IconButton
                  onClick={() => onRemoveStop(stop.id)}
                  color="error"
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    fullWidth
                    options={searchedLocations}
                    getOptionLabel={(option) => option.name}
                    onInputChange={(_, val) => onLocationSearch(val)}
                    onChange={(_, val) =>
                      onUpdateStop(stop.id, "locationId", val?._id || "")
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Địa điểm dừng" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TimePicker
                    label="Giờ đến trạm"
                    value={stop.expectedArrivalTime}
                    onChange={(value) =>
                      onUpdateStop(stop.id, "expectedArrivalTime", value)
                    }
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TimePicker
                    label="Giờ rời trạm"
                    value={stop.expectedDepartureTime}
                    onChange={(value) =>
                      onUpdateStop(stop.id, "expectedDepartureTime", value)
                    }
                    sx={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
};

export default ScheduleStep;
