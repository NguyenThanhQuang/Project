import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  Rating,
} from "@mui/material";
import { AirlineSeatReclineNormal, DirectionsBus } from "@mui/icons-material";
import type { TripSearchResult } from "../../../../types";
import { useNavigate } from "react-router-dom";

interface TripCardProps {
  trip: TripSearchResult;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate = useNavigate();

  const handleTripSelect = () => {
    navigate(`/trips/${trip._id}`);
  };

  const calculateDuration = (start: string, end: string): string => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    let diff = endTime.getTime() - startTime.getTime();
    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000;
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`.trim();
  };

  const departureTime = new Date(trip.departureTime).toLocaleTimeString(
    "vi-VN",
    { hour: "2-digit", minute: "2-digit" }
  );
  const arrivalTime = new Date(trip.expectedArrivalTime).toLocaleTimeString(
    "vi-VN",
    { hour: "2-digit", minute: "2-digit" }
  );
  const duration = calculateDuration(
    trip.departureTime,
    trip.expectedArrivalTime
  );

  return (
    <Card
      sx={{
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 30px rgba(0, 119, 190, 0.15)",
        },
        border: "1px solid rgba(0, 119, 190, 0.1)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  mr: 2,
                  width: 48,
                  height: 48,
                  background:
                    "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                }}
                src={trip.companyId.logoUrl}
              >
                {/* Fallback: Lấy 2 chữ cái đầu của tên nhà xe */}
                {trip.companyId.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {trip.companyId.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {trip.vehicleId.type}
                  </Typography>
                  <Typography color="text.secondary">•</Typography>
                  {trip.companyReviewCount > 0 ? (
                    <>
                      <Rating
                        value={trip.companyAvgRating}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({trip.companyReviewCount} đánh giá)
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Chưa có đánh giá
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 5, sm: 4 }}>
                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {departureTime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trip.route.fromLocationId.name}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 2, sm: 4 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        height: 2,
                        bgcolor: "divider",
                        borderRadius: 1,
                      }}
                    />
                    <DirectionsBus
                      sx={{ mx: 1, color: "text.secondary", fontSize: "1rem" }}
                    />
                    <Box
                      sx={{
                        flex: 1,
                        height: 2,
                        bgcolor: "divider",
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {duration}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 5, sm: 4 }}>
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {arrivalTime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trip.route.toLocationId.name}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {trip.amenities.map((amenity) => (
                <Chip key={amenity} label={amenity} size="small" variant="outlined" />
              ))}
            </Box> */}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
              >
                {formatPrice(trip.price)}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  mb: 2,
                }}
              >
                <AirlineSeatReclineNormal
                  sx={{ mr: 1, fontSize: 20, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  Còn {trip.availableSeatsCount} ghế trống
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleTripSelect}
                sx={{
                  py: 1.5,
                  background:
                    "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #004c8b 0%, #003366 100%)",
                  },
                }}
              >
                Chọn ghế
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
