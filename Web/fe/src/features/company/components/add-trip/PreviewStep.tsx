import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import {
  DirectionsBus,
  LocationOn,
  Schedule,
  AttachMoney,
} from "@mui/icons-material";
import type { AddTripFormState } from "../../types/trip";
import type { Location } from "../../../../types";
import type { Vehicle } from "../../../admin/types/vehicle";

interface PreviewStepProps {
  formData: AddTripFormState;
  vehicleData?: Vehicle;
  fromLocationData?: Location;
  toLocationData?: Location;
  stopsData: (Location & { arrivalTime?: string; departureTime?: string })[];
}

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right" }}>
      {value}
    </Typography>
  </Box>
);

const PreviewStep: React.FC<PreviewStepProps> = ({
  formData,
  vehicleData,
  fromLocationData,
  toLocationData,
  stopsData,
}) => {
  const formatTime = (date: Date | null) =>
    date
      ? new Date(date).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";
  const formatDate = (date: Date | null) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container spacing={3}>
          {/* Cột trái */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <DirectionsBus sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Thông tin chuyến và xe</Typography>
            </Box>
            <InfoRow
              label="Nhà xe"
              value={vehicleData?.companyId || "Đang tải..."}
            />
            <InfoRow label="Loại xe" value={vehicleData?.type || "N/A"} />
            <InfoRow label="Số ghế" value={vehicleData?.totalSeats || "N/A"} />
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AttachMoney sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Giá vé</Typography>
            </Box>
            <InfoRow
              label="Giá vé cơ bản"
              value={formData.price.toLocaleString("vi-VN") + " VNĐ"}
            />
          </Grid>

          {/* Cột phải */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Schedule sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Lịch trình</Typography>
            </Box>
            <InfoRow label="Điểm đi" value={fromLocationData?.name || "N/A"} />
            <InfoRow label="Điểm đến" value={toLocationData?.name || "N/A"} />
            <InfoRow
              label="Ngày khởi hành"
              value={formatDate(formData.departureTime)}
            />
            <InfoRow
              label="Thời gian đi - đến"
              value={`${formatTime(formData.departureTime)} - ${formatTime(
                formData.expectedArrivalTime
              )}`}
            />
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Các điểm dừng</Typography>
            </Box>
            {stopsData.length > 0 ? (
              stopsData.map((stop) => (
                <Chip key={stop._id} label={stop.name} sx={{ mr: 1, mb: 1 }} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Không có điểm dừng trung gian.
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PreviewStep;
