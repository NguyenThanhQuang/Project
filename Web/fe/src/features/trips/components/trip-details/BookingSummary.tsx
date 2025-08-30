import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import type { TripDetailView, FrontendSeat } from "../../../../types";

interface BookingSummaryProps {
  trip: TripDetailView;
  selectedSeats: FrontendSeat[];
  onContinue: () => void;
  onRemoveSeat: (seatId: string) => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  trip,
  selectedSeats,
  onRemoveSeat,
  onContinue,
}) => {
  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        position: "sticky",
        top: 20,
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Thông tin đặt vé
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Chuyến đi
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {trip.fromLocation} → {trip.toLocation}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {trip.departureTime} - {trip.arrivalTime}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Ghế đã chọn
          </Typography>
          {selectedSeats.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Chưa chọn ghế nào
            </Typography>
          ) : (
            <Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {selectedSeats.map((seat) => (
                  <Chip
                    key={seat.id}
                    label={seat.seatNumber}
                    color="primary"
                    onDelete={() => onRemoveSeat(seat.id)}
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Số ghế: {selectedSeats.length}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1">
              Giá vé ({selectedSeats.length} ghế)
            </Typography>
            <Typography variant="body1">
              {formatPrice(getTotalPrice())}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Tổng cộng
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {formatPrice(getTotalPrice())}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={selectedSeats.length === 0}
          onClick={onContinue}
          sx={{
            py: 2,
            fontSize: "1.1rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #004c8b 0%, #003366 100%)",
            },
            "&:disabled": {
              background: "rgba(0, 0, 0, 0.12)",
            },
          }}
        >
          Tiếp tục
        </Button>
      </CardContent>
    </Paper>
  );
};
