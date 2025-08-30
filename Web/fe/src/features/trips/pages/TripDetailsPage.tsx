import React, { useState, useEffect } from "react";
import { Container, Grid, CircularProgress, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  TripInfoHeader,
  SeatMap,
  BookingSummary,
  RouteStepperModal,
} from "../components/trip-details";

import { getTripDetails } from "../../trips/services/tripService";
import type { TripDetailView, FrontendSeat, SeatStatus } from "../../../types";

const TripDetailsPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<TripDetailView | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSeats, setSelectedSeats] = useState<FrontendSeat[]>([]);
  const [showRouteModal, setShowRouteModal] = useState<boolean>(false);

  useEffect(() => {
    if (!tripId) {
      setError("Không tìm thấy ID chuyến đi trong URL.");
      setLoading(false);
      return;
    }

    const fetchTripData = async () => {
      try {
        setLoading(true);
        const data = await getTripDetails(tripId);
        if (data) {
          setTrip(data);
        } else {
          setError("Không tìm thấy thông tin cho chuyến đi này.");
        }
      } catch (err) {
        setError("Không thể tải thông tin chuyến đi. Vui lòng thử lại sau.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  const handleSeatSelect = (seatId: string, seatStatus: SeatStatus) => {
    if (seatStatus !== "available" || !trip) return;

    const seatToToggle = trip.seats.find((s) => s.id === seatId);
    if (!seatToToggle) return;

    setSelectedSeats((prevSelected) => {
      const isSelected = prevSelected.some((s) => s.id === seatId);
      if (isSelected) {
        return prevSelected.filter((s) => s.id !== seatId);
      } else {
        if (prevSelected.length >= 4) {
          // Dùng thư viện notification thay cho alert "use NotificationProvider.tsx"
          alert("Bạn chỉ có thể chọn tối đa 4 ghế cho mỗi lần đặt vé.");
          return prevSelected;
        }
        return [...prevSelected, seatToToggle];
      }
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0 || !trip) return;

    navigate("/bookings/checkout", {
      state: {
        trip,
        selectedSeats,
      },
    });
  };

  const handleRemoveSeat = (seatId: string) => {
    setSelectedSeats((prev) => prev.filter((s) => s.id !== seatId));
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!trip) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">Không tìm thấy thông tin chuyến đi.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <TripInfoHeader
            trip={trip}
            onShowRoute={() => setShowRouteModal(true)}
          />
          <SeatMap
            trip={trip}
            selectedSeats={selectedSeats.map((s) => s.id)}
            onSeatSelect={handleSeatSelect}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <BookingSummary
            trip={trip}
            selectedSeats={selectedSeats}
            onContinue={handleContinue}
            onRemoveSeat={handleRemoveSeat}
          />
        </Grid>
      </Grid>

      <RouteStepperModal
        open={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        routeStops={trip.routeStops}
      />
    </Container>
  );
};

export default TripDetailsPage;
