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
import type { LocationData } from "../../../trips/types/location";

interface ScheduleStepProps {
  formData: AddTripFormState;
  onFormChange: <K extends keyof AddTripFormState>(
    field: K,
    value: AddTripFormState[K]
  ) => void;
  onAddStop: () => void;
  onRemoveStop: (stopId: string) => void;
  onUpdateStop: <K extends keyof RouteStopFormState>(
    stopId: string,
    field: K,
    value: RouteStopFormState[K]
  ) => void;
  allLocations: LocationData[];
  isCalculating: boolean;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({
  formData,
  onFormChange,
  onAddStop,
  onRemoveStop,
  onUpdateStop,
  allLocations,
  isCalculating,
}) => {
  return (
    <Grid container spacing={3}>
      {/* Lựa chọn Ngày và Giờ */}
      <Grid size={{ xs: 12, md: 4 }}>
        <DatePicker
          label="Ngày khởi hành"
          value={formData.departureTime}
          onChange={(value) => onFormChange("departureTime", value)}
          sx={{ width: "100%" }}
          disablePast
          slotProps={{
            textField: {
              required: true,
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TimePicker
          label="Giờ khởi hành"
          value={formData.departureTime}
          onChange={(value) => onFormChange("departureTime", value)}
          sx={{ width: "100%" }}
          slotProps={{
            textField: {
              required: true,
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TimePicker
          label="Giờ đến dự kiến"
          value={formData.expectedArrivalTime}
          onChange={(value) => onFormChange("expectedArrivalTime", value)}
          sx={{ width: "100%" }}
          readOnly
          slotProps={{
            textField: {
              required: true,
              helperText: isCalculating ? " " : "Tự động tính toán",
            },
          }}
        />
      </Grid>

      {/* Phần quản lý trạm dừng */}
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
          <Typography variant="h6">Trạm dừng trung gian (tùy chọn)</Typography>
          <Button startIcon={<Add />} onClick={onAddStop} variant="outlined">
            Thêm trạm dừng
          </Button>
        </Box>

        {/* Lặp qua danh sách các trạm dừng để hiển thị */}
        {formData.stops.map((stop, index) => {
          const stopOptions = allLocations.filter((loc) => {
            if (
              loc._id === formData.fromLocationId ||
              loc._id === formData.toLocationId
            ) {
              return false;
            }
            const otherSelectedStopIds = formData.stops
              .filter((s) => s.id !== stop.id)
              .map((s) => s.locationId);
            if (otherSelectedStopIds.includes(loc._id)) {
              return false;
            }
            return true;
          });

          return (
            <Card key={stop.id} sx={{ mb: 2 }} variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Trạm dừng {index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => onRemoveStop(stop.id)}
                    color="error"
                    size="small"
                    aria-label={`Xóa trạm dừng ${index + 1}`}
                  >
                    <Delete />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Autocomplete
                      fullWidth
                      options={stopOptions}
                      getOptionLabel={(option) => option.name}
                      value={
                        allLocations.find((l) => l._id === stop.locationId) ||
                        null
                      }
                      onChange={(_, val) =>
                        onUpdateStop(stop.id, "locationId", val?._id || "")
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Chọn địa điểm dừng" />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TimePicker
                      label="Giờ đến trạm (dự kiến)"
                      value={stop.expectedArrivalTime}
                      onChange={(value) =>
                        onUpdateStop(stop.id, "expectedArrivalTime", value)
                      }
                      sx={{ width: "100%" }}
                      slotProps={{
                        textField: {
                          required: true,
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TimePicker
                      label="Giờ rời trạm (dự kiến)"
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
          );
        })}
      </Grid>
    </Grid>
  );
};

export default ScheduleStep;
