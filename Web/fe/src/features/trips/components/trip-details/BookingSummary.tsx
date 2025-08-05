import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CardContent,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import { Timer } from "@mui/icons-material";
import type { TripDetailView, FrontendSeat } from "../../../../types";

interface BookingSummaryProps {
  trip: TripDetailView;
  selectedSeats: FrontendSeat[];
  holdTimer: number;
  onContinue: () => void;
  onRemoveSeat: (seatId: string) => void;
}

const SEAT_HOLD_DURATION = 15 * 60;

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  trip,
  selectedSeats,
  onRemoveSeat,
  onContinue,
}) => {
  const [holdTimer, setHoldTimer] = useState<number>(SEAT_HOLD_DURATION);

  useEffect(() => {
    // Chỉ chạy timer khi có ghế được chọn
    if (selectedSeats.length > 0) {
      const timer = setInterval(() => {
        setHoldTimer((prev) => {
          if (prev <= 1) {
            // Khi hết giờ, component cha sẽ xử lý việc xóa ghế
            // Ở đây chỉ reset timer
            // onTimeExpire(); // Có thể thêm callback này nếu cần
            return SEAT_HOLD_DURATION;
          }
          return prev - 1;
        });
      }, 1000);

      // Reset timer mỗi khi danh sách ghế thay đổi
      setHoldTimer(SEAT_HOLD_DURATION);

      return () => clearInterval(timer);
    } else {
      // Nếu không có ghế nào được chọn, reset timer
      setHoldTimer(SEAT_HOLD_DURATION);
    }
  }, [selectedSeats]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

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

        {selectedSeats.length > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Timer />
              <Typography variant="body2">
                Thời gian giữ ghế: <strong>{formatTime(holdTimer)}</strong>
              </Typography>
            </Box>
          </Alert>
        )}

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
