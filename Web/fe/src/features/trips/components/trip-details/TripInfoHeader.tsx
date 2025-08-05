import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CardContent,
  Chip,
  Avatar,
  // Rating,
} from "@mui/material";
import { DirectionsBus, Route, Map } from "@mui/icons-material";
import type { TripDetailView } from "../../../../types";

interface TripInfoHeaderProps {
  trip: TripDetailView;
  onShowRoute: () => void;
}

export const TripInfoHeader: React.FC<TripInfoHeaderProps> = ({
  trip,
  onShowRoute,
}) => {
  return (
    <Paper elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              mr: 3,
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
            }}
            src={trip.companyLogo}
          >
            {/* Fallback nếu không có logo */}
            {trip.companyName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {trip.companyName}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h6" color="text.secondary">
                {trip.vehicleType}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* Giả sử rating sẽ được thêm vào TripDetailView sau */}
                {/* <Rating value={trip.rating} size="small" readOnly /> */}
                {/* <Typography variant="body2">({trip.rating})</Typography> */}
              </Box>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
              >
                {trip.departureTime}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {trip.fromLocation}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
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
                    height: 3,
                    bgcolor: "primary.main",
                    borderRadius: 1,
                  }}
                />
                <DirectionsBus
                  sx={{ mx: 2, color: "primary.main", fontSize: 32 }}
                />
                <Box
                  sx={{
                    flex: 1,
                    height: 3,
                    bgcolor: "primary.main",
                    borderRadius: 1,
                  }}
                />
              </Box>
              <Typography variant="h6" color="text.secondary">
                {trip.duration}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
              >
                {trip.arrivalTime}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {trip.toLocation}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
          {trip.amenities.map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              variant="outlined"
              color="primary"
            />
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Route />}
            onClick={onShowRoute}
            sx={{ borderRadius: 2 }}
          >
            Xem lộ trình
          </Button>
          <Button
            variant="outlined"
            startIcon={<Map />}
            sx={{ borderRadius: 2 }}
          >
            Xem bản đồ
          </Button>
        </Box>
      </CardContent>
    </Paper>
  );
};
