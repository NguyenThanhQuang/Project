import React from "react";
import { Box, Typography, CardContent, Paper, Grid } from "@mui/material";
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
    const maxColumns = Math.max(...seats.map((s) => s.position.column)) + 1;

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
            gap: { xs: "6px", sm: "8px" },
            maxWidth: 350,
            mx: "auto",
            p: 2,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            position: "relative",
          }}
        >
          {seats.map((seat) => (
            <Box
              key={seat.id}
              sx={{
                gridColumn: `${seat.position.column + 1} / span 1`,
                gridRow: `${seat.position.row + 1} / span 1`,
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: getSeatColor(seat),
                border: `1px solid ${getSeatBorderColor(seat)}`,
                borderRadius: "4px",
                cursor: seat.status === "available" ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                "&:hover":
                  seat.status === "available"
                    ? {
                        transform: "scale(1.1)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }
                    : {},
              }}
              onClick={() => onSeatSelect(seat.id, seat.status)}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.65rem", // Chữ nhỏ hơn
                  color: selectedSeats.includes(seat.id)
                    ? "white"
                    : seat.status === "booked"
                    ? "#757575" // Màu chữ cho ghế đã bán
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
        {/* --- THAY ĐỔI CHÍNH NẰM Ở ĐÂY --- */}
        {trip.seatLayout.floors === 2 ? (
          <Grid container spacing={4} justifyContent="center">
            {/* Cột cho Tầng 1 */}
            <Grid size={{ xs: 12, md: 6 }}>
              {renderFloor(firstFloorSeats, `Tầng 1`)}
            </Grid>
            {/* Cột cho Tầng 2 */}
            <Grid size={{ xs: 12, md: 6 }}>
              {renderFloor(secondFloorSeats, `Tầng 2`)}
            </Grid>
          </Grid>
        ) : (
          // Nếu chỉ có 1 tầng thì render như cũ
          renderFloor(
            firstFloorSeats,
            `Xe ghế ngồi (${formatPrice(trip.price)})`
          )
        )}
        {/* Legend */}
        Chú thích:
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Ghế trống", color: "#e8f5e8", borderColor: "#4caf50" },
            { label: "Đã chọn", color: "#2196f3", borderColor: "#2196f3" },
            { label: "Đang giữ", color: "#ffecb3", borderColor: "#ff9800" },
            { label: "Đã bán", color: "#e0e0e0", borderColor: "#9e9e9e" },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  bgcolor: item.color,
                  border: `1px solid ${item.borderColor}`,
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="body2">{item.label}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Paper>
  );
};
