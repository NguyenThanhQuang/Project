import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { DirectionsBus, EventSeat, RateReview } from "@mui/icons-material";
import type { MyBooking } from "../types/booking";

interface MyBookingCardProps {
  booking: MyBooking;
  onReviewClick: (booking: MyBooking) => void;
  // onViewDetailsClick: (booking: MyBooking) => void;
  // onCancelClick: (booking: MyBooking) => void;
}

const getStatusChipProps = (status: MyBooking["status"]) => {
  switch (status) {
    case "confirmed":
      return { label: "Đã xác nhận", color: "success" as const };
    case "held":
      return { label: "Đang giữ chỗ", color: "warning" as const };
    case "cancelled":
      return { label: "Đã hủy", color: "error" as const };
    case "expired":
      return { label: "Hết hạn", color: "default" as const };
    case "completed":
      return { label: "Hoàn thành", color: "info" as const };
    default:
      return { label: status, color: "primary" as const };
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const MyBookingCard: React.FC<MyBookingCardProps> = ({
  booking,
  onReviewClick,
}) => {
  const trip = booking.trip;
  const statusProps = getStatusChipProps(booking.status);
  const canReview = trip.status === "arrived" && !booking.isReviewed;

  return (
    <Card
      sx={{
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": { transform: "translateY(-2px)", boxShadow: 6 },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header: Tên nhà xe và trạng thái */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={trip.companyLogo}
              sx={{ width: 48, height: 48, mr: 2, bgcolor: "primary.light" }}
            >
              {trip.companyName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {trip.companyName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mã vé: {booking.ticketCode}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={statusProps.label}
            color={statusProps.color}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Thông tin hành trình */}
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 5, sm: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {formatTime(trip.departureTime)}
            </Typography>
            <Typography color="text.secondary">{trip.fromLocation}</Typography>
          </Grid>
          <Grid size={{ xs: 2, sm: 4 }} sx={{ textAlign: "center" }}>
            <DirectionsBus color="action" />
            <Typography variant="caption" display="block">
              {formatDate(trip.departureTime)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 5, sm: 4 }} sx={{ textAlign: "right" }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {formatTime(trip.arrivalTime)}
            </Typography>
            <Typography color="text.secondary">{trip.toLocation}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Thông tin hành khách và tổng tiền */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              Hành khách:
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {booking.seats.map((seat, index) => (
                <Chip
                  key={index}
                  icon={<EventSeat />}
                  label={`${seat.passengerName} (${seat.seatNumber})`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Tổng cộng
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              {formatPrice(booking.totalAmount)}
            </Typography>
          </Box>
        </Box>

        {/* Nút Đánh giá (chỉ hiển thị khi đủ điều kiện) */}
        {canReview && (
          <Box
            sx={{
              mt: 3,
              borderTop: "1px dashed",
              borderColor: "divider",
              pt: 2,
              textAlign: "center",
            }}
          >
            <Button
              variant="contained"
              startIcon={<RateReview />}
              onClick={() => onReviewClick(booking)}
              sx={{ borderRadius: "20px" }}
            >
              Viết đánh giá
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
