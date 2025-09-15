import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Grid,
  Divider,
  Button,
  Alert,
} from "@mui/material";
import { DirectionsBus, EventSeat, Person } from "@mui/icons-material";
import type { PopulatedBookingLookupResult } from "../types/booking";
import { submitReview } from "../../reviews/services/reviewService";
import type { ReviewFormData } from "../../reviews/types/review";
import { ReviewForm } from "../../reviews/components/ReviewForm";
import { useNotification } from "../../../components/common/NotificationProvider";

interface BookingDetailsCardProps {
  booking: PopulatedBookingLookupResult;
  onReviewSubmitSuccess: () => void;
}

const getStatusChipProps = (status: PopulatedBookingLookupResult["status"]) => {
  switch (status) {
    case "confirmed":
      return { label: "Đã xác nhận", color: "success" as const };
    case "held":
      return { label: "Đang giữ chỗ", color: "warning" as const };
    case "cancelled":
      return { label: "Đã hủy", color: "error" as const };
    case "expired":
      return { label: "Hết hạn", color: "default" as const };
    default:
      return { label: status, color: "info" as const };
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const formatDateTime = (dateTimeString: string) => {
  return new Date(dateTimeString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const BookingDetailsCard: React.FC<BookingDetailsCardProps> = ({
  booking,
  onReviewSubmitSuccess,
}) => {
  const { showNotification } = useNotification();
  const trip = booking.tripId;
  const company = trip.companyId;
  const route = trip.route;
  const statusProps = getStatusChipProps(booking.status);

  const canReview = trip.status === "arrived" && !booking.isReviewed;

  const handleGuestReviewSubmit = async (data: {
    rating: number;
    comment?: string;
    isAnonymous: boolean;
  }) => {
    await submitReview({
      ...data,
      bookingId: booking._id,
      tripId: trip._id,
      contactPhone: booking.contactPhone,
    });
    showNotification("Cảm ơn bạn đã gửi đánh giá!", "success");
    onReviewSubmitSuccess();
  };

  return (
    <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
      <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
        {/* Phần Header của thẻ */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={company.logoUrl}
              sx={{ width: 56, height: 56, mr: 2, bgcolor: "primary.main" }}
            >
              {company.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {company.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mã vé:{" "}
                <Typography component="span" sx={{ fontWeight: "bold" }}>
                  {booking.ticketCode}
                </Typography>
              </Typography>
            </Box>
          </Box>
          <Chip label={statusProps.label} color={statusProps.color} />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Phần thông tin hành trình */}
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 5 }} sx={{ textAlign: "left" }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {formatDateTime(trip.departureTime).split(", ")[1]}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {route.fromLocationId.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDateTime(trip.departureTime).split(", ")[0]}
            </Typography>
          </Grid>
          <Grid size={{ xs: 2 }} sx={{ textAlign: "left" }}>
            <DirectionsBus color="action" />
          </Grid>
          <Grid size={{ xs: 5 }} sx={{ textAlign: "left" }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {formatDateTime(trip.expectedArrivalTime).split(", ")[1]}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {route.toLocationId.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDateTime(trip.expectedArrivalTime).split(", ")[0]}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Thông tin người liên hệ và hành khách */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              Thông tin liên hệ
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Person sx={{ mr: 1, color: "action.active" }} />
              <Typography>
                {booking.contactName} - {booking.contactPhone}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              Hành khách
            </Typography>
            {booking.passengers.map((p, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
              >
                <EventSeat sx={{ mr: 1, color: "action.active" }} />
                <Typography>
                  {p.name} - Ghế: {p.seatNumber}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Tổng cộng
          </Typography>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
            {formatPrice(booking.totalAmount)}
          </Typography>
        </Box>

        {canReview && <ReviewForm onSubmit={handleGuestReviewSubmit} />}

        {booking.isReviewed && (
          <Alert severity="info" sx={{ mt: 3 }}>
            Bạn đã đánh giá cho chuyến đi này.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
