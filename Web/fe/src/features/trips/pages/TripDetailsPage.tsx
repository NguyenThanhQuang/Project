import React, { useState, useEffect } from "react";
import { Container, Grid, CircularProgress, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"; // Giữ lại useNavigate vì sẽ dùng
import {
  TripInfoHeader,
  SeatMap,
  BookingSummary,
  RouteStepperModal,
} from "../components/trip-details";

import { getTripDetails } from "../../../services/tripService";
import type { TripDetailView, FrontendSeat, SeatStatus } from "../../../types"; // Bỏ FrontendRouteStop nếu không dùng trực tiếp

const SEAT_HOLD_DURATION = 15 * 60; // 15 phút

const TripDetailsPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate(); // Giữ lại useNavigate để dùng trong handleContinue

  // --- STATE MANAGEMENT ---
  const [trip, setTrip] = useState<TripDetailView | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSeats, setSelectedSeats] = useState<FrontendSeat[]>([]);
  const [showRouteModal, setShowRouteModal] = useState<boolean>(false);
  const [holdTimer, setHoldTimer] = useState<number>(SEAT_HOLD_DURATION);

  // --- DATA FETCHING ---
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

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setHoldTimer(SEAT_HOLD_DURATION);
      return;
    }

    const timerId = setInterval(() => {
      setHoldTimer((prev) => {
        if (prev <= 1) {
          setSelectedSeats([]);
          // Cân nhắc dùng một thư viện thông báo (toast) thay vì alert
          alert("Thời gian giữ ghế đã hết hạn. Vui lòng chọn lại.");
          return SEAT_HOLD_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [selectedSeats]);

  // --- EVENT HANDLERS ---
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
          alert("Bạn chỉ có thể chọn tối đa 4 ghế cho mỗi lần đặt vé.");
          return prevSelected;
        }
        return [...prevSelected, seatToToggle];
      }
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0 || !trip) return;

    // TODO: Gọi API giữ chỗ (POST /api/bookings/hold)
    console.log("Navigating to checkout with:", {
      tripId: trip._id,
      selectedSeats: selectedSeats.map((s) => ({
        seatNumber: s.seatNumber,
        name: "Hành khách",
        phone: "0123456789",
      })), // Dữ liệu mẫu
      totalPrice: selectedSeats.reduce((total, seat) => total + seat.price, 0),
    });

    // Sau khi API giữ chỗ thành công, navigate đến trang checkout
    // Ví dụ: const { bookingId } = await holdSeatsApi(...);
    // navigate(`/booking/${bookingId}/checkout`);

    // Tạm thời dùng navigate để kiểm tra biến navigate không bị unused
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

  // --- RENDER LOGIC ---
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
        {/* Cột trái - Thông tin và Sơ đồ ghế */}
        <Grid size={{ xs: 12, sm: 8 }}>
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

        {/* Cột phải - Tóm tắt Booking */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <BookingSummary
            trip={trip}
            selectedSeats={selectedSeats}
            holdTimer={holdTimer}
            onContinue={handleContinue}
            onRemoveSeat={handleRemoveSeat}
          />
        </Grid>
      </Grid>

      {/* Modal Lộ trình */}
      <RouteStepperModal
        open={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        routeStops={trip.routeStops}
      />
    </Container>
  );
};

export default TripDetailsPage;
