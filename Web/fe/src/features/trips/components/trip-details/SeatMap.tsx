import React from "react";
import { Box, Typography, Grid, CardContent, Paper } from "@mui/material";
import type { FrontendSeat, TripDetailView } from "../../../../types";

interface SeatMapProps {
  trip: TripDetailView;
  selectedSeats: string[];
  onSeatSelect: (
    seatId: string,
    seatStatus: "available" | "held" | "booked"
  ) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  trip,
  selectedSeats,
  onSeatSelect,
}) => {
  const getSeatColor = (seat: FrontendSeat) => {
    if (selectedSeats.includes(seat.id)) {
      return "#2196f3";
    }
    switch (seat.status) {
      case "available":
        return "#e8f5e8";
      case "held":
        return "#ffecb3";
      case "booked":
        return "#e0e0e0";
      default:
        return "#f5f5f5";
    }
  };

  const getSeatBorderColor = (seat: FrontendSeat) => {
    if (selectedSeats.includes(seat.id)) {
      return "#2196f3";
    }
    switch (seat.status) {
      case "available":
        return "#4caf50";
      case "held":
        return "#ff9800";
      case "booked":
        return "#9e9e9e";
      default:
        return "#bdbdbd";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderFloor = (seats: FrontendSeat[], floorName: string) => {
    const { seatLayout } = trip;
    const maxColumns = seatLayout.columns;
    const aislePosition = seatLayout.aisleAfterColumn ?? 2;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}
        >
          {floorName}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${maxColumns}, 1fr)`,
            gap: 1,
            maxWidth: seatLayout.floors === 2 ? 400 : 500,
            mx: "auto",
            p: 2,
            border: "2px solid #e0e0e0",
            borderRadius: 2,
            position: "relative",
          }}
        >
          {/* Driver area */}
          <Box
            sx={{
              gridColumn: "1 / -1",
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.100",
              borderRadius: 1,
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              🚗 Tài xế
            </Typography>
          </Box>

          {seats.map((seat) => (
            <Box
              key={seat.id}
              sx={{
                gridColumn: `${seat.position.column + 1} / span 1`, // Vị trí cột
                gridRow: `${seat.position.row + 2} / span 1`, // Vị trí hàng (cộng 2 vì có khu vực tài xế)
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: getSeatColor(seat),
                border: `2px solid ${getSeatBorderColor(seat)}`,
                borderRadius: 1,
                cursor: seat.status === "available" ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                position: "relative",
                "&:hover":
                  seat.status === "available"
                    ? {
                        transform: "scale(1.05)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      }
                    : {},
                // Một chút margin để tạo lối đi
                ...(seat.position.column === aislePosition - 1 && {
                  marginRight: "24px",
                }),
              }}
              onClick={() => onSeatSelect(seat.id, seat.status)}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  color: selectedSeats.includes(seat.id)
                    ? "white"
                    : seat.status === "booked"
                    ? "#666"
                    : "text.primary",
                }}
              >
                {seat.seatNumber}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const firstFloorSeats = trip.seats.filter((seat) => seat.floor === 1);
  const secondFloorSeats =
    trip.seatLayout.floors === 2
      ? trip.seats.filter((seat) => seat.floor === 2)
      : [];

  return (
    <Paper elevation={3} sx={{ borderRadius: 3 }}>
      <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Sơ đồ ghế
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          💡 Nhấp vào ghế{" "}
          <span style={{ color: "#4caf50", fontWeight: "bold" }}>xanh lá</span>{" "}
          (ghế trống) để chọn.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ⚠️ Tối đa 4 ghế/lần đặt. Ghế{" "}
          <span style={{ color: "#9e9e9e", fontWeight: "bold" }}>xám</span> đã
          được bán.
        </Typography>
      </Box>
      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
        {trip.seatLayout.floors === 2 ? (
          <>
            {renderFloor(
              firstFloorSeats,
              `Tầng 1 (${formatPrice(trip.price)})`
            )}
            {renderFloor(
              secondFloorSeats,
              `Tầng 2 (${formatPrice(trip.price)})`
            )}
          </>
        ) : (
          renderFloor(
            firstFloorSeats,
            `Xe ghế ngồi (${formatPrice(trip.price)})`
          )
        )}

        {/* Legend */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}
          >
            Chú thích
          </Typography>
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#e8f5e8",
                    border: "2px solid #4caf50",
                    borderRadius: 0.5,
                  }}
                />
                <Typography variant="caption">Ghế trống</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#2196f3",
                    border: "2px solid #2196f3",
                    borderRadius: 0.5,
                  }}
                />
                <Typography variant="caption">Đã chọn</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#ffecb3",
                    border: "2px solid #ff9800",
                    borderRadius: 0.5,
                  }}
                />
                <Typography variant="caption">Đang giữ</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#e0e0e0",
                    border: "2px solid #9e9e9e",
                    borderRadius: 0.5,
                  }}
                />
                <Typography variant="caption">Đã bán</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Paper>
  );
};
