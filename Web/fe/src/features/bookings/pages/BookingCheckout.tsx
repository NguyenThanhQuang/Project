import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  CardContent,
  Divider,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Chip,
  Alert,
} from "@mui/material";
import {
  Person,
  Phone,
  Schedule,
  LocationOn,
  ExpandMore,
  AccessTime,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../../../components/common/NotificationProvider";
import type { TripDetailView, FrontendSeat } from "../../../types";
import { useBookingProcess } from "../hooks/useBookingProcess";
import type { PassengerPayload } from "../types/booking";

const BookingCheckout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Sử dụng hook để quản lý logic API
  const {
    isLoading,
    error,
    startPaymentProcess,
    setError: setApiError,
  } = useBookingProcess();

  // Lấy dữ liệu từ trang chi tiết chuyến đi
  const { trip, selectedSeats } = (location.state || {}) as {
    trip: TripDetailView;
    selectedSeats: FrontendSeat[];
  };

  // State quản lý form
  const [passengers, setPassengers] = useState<PassengerPayload[]>([]);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Khởi tạo state của form khi component được tải
  useEffect(() => {
    if (!trip || !selectedSeats || selectedSeats.length === 0) {
      showNotification(
        "Dữ liệu đặt vé không hợp lệ. Đang quay về trang chủ...",
        "error"
      );
      navigate("/");
      return;
    }

    const initialPassengers = selectedSeats.map((seat) => ({
      name: "",
      phone: "",
      seatNumber: seat.seatNumber,
    }));
    setPassengers(initialPassengers);
  }, [trip, selectedSeats, navigate, showNotification]);

  // Hiển thị lỗi từ API
  useEffect(() => {
    if (error) {
      showNotification(error, "error");
    }
  }, [error, showNotification]);

  // Cập nhật thông tin hành khách khi người dùng nhập liệu
  const handlePassengerChange = (
    index: number,
    field: keyof Omit<PassengerPayload, "seatNumber">,
    value: string
  ) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Kiểm tra xem tất cả các trường bắt buộc đã được điền chưa
  const isFormValid = () => {
    if (!contactInfo.name.trim() || !contactInfo.phone.trim()) return false;
    for (const p of passengers) {
      if (!p.name.trim() || !p.phone.trim()) return false;
    }
    return true;
  };

  // Xử lý khi người dùng nhấn nút "Thanh toán"
  const handleInitiatePayment = async () => {
    if (!isFormValid()) {
      showNotification(
        "Vui lòng điền đầy đủ thông tin hành khách và người liên hệ.",
        "warning"
      );
      return;
    }
    setApiError(null); // Xóa lỗi cũ

    // Lưu SĐT liên hệ vào localStorage để trang PaymentStatus có thể lấy lại
    localStorage.setItem("tempContactPhone", contactInfo.phone);

    const payload = {
      tripId: trip._id,
      passengers,
      contactName: contactInfo.name,
      contactPhone: contactInfo.phone,
      contactEmail: contactInfo.email || undefined,
    };

    try {
      const result = await startPaymentProcess(payload);
      if (result?.paymentLinkData?.checkoutUrl) {
        // Chuyển hướng người dùng đến trang thanh toán của PayOS
        window.location.href = result.paymentLinkData.checkoutUrl;
      } else {
        throw new Error("Không nhận được URL thanh toán từ hệ thống.");
      }
    } catch (err) {
      // Lỗi sẽ được bắt và hiển thị bởi useEffect ở trên
      console.error("Failed to initiate payment:", err);
    }
  };

  // Render loading nếu chưa có dữ liệu
  if (!trip || !selectedSeats) {
    return (
      <Container sx={{ textAlign: "center", py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Cột trái: Form nhập liệu */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Thông báo thời gian giữ chỗ */}
          <Alert 
            severity="info" 
            icon={<AccessTime />}
            sx={{ mb: 3 }}
          >
            <Typography variant="body2" fontWeight="bold">
              Lưu ý: Thời gian giữ chỗ là 15 phút
            </Typography>
            <Typography variant="body2">
              Sau khi thanh toán, bạn có thể xem và quản lý vé trong mục "Vé của tôi"
            </Typography>
          </Alert>

          {/* Thông tin hành khách */}
          <Paper elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
            <Box
              sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Person /> Thông tin hành khách
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              {passengers.map((passenger, index) => (
                <Accordion
                  key={index}
                  defaultExpanded={index === 0}
                  sx={{
                    "&:before": { display: "none" },
                    boxShadow: "none",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Hành khách {index + 1} - Ghế {passenger.seatNumber}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Họ và tên"
                          fullWidth
                          required
                          value={passenger.name}
                          onChange={(e) =>
                            handlePassengerChange(index, "name", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Số điện thoại"
                          fullWidth
                          required
                          value={passenger.phone}
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "phone",
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>

          {/* Thông tin người liên hệ */}
          <Paper elevation={3} sx={{ borderRadius: 3 }}>
            <Box
              sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Phone /> Thông tin người liên hệ (Để nhận vé)
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Tên liên hệ"
                    fullWidth
                    required
                    value={contactInfo.name}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Số điện thoại"
                    fullWidth
                    required
                    value={contactInfo.phone}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phone: e.target.value })
                    }
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    label="Email (Tùy chọn)"
                    type="email"
                    fullWidth
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, email: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Cột phải: Tóm tắt Booking */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              position: "sticky",
              top: 20,
            }}
          >
            <Box
              sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Tóm tắt đặt vé
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              {/* Trip Summary */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  src={trip.companyLogo}
                  sx={{ bgcolor: "primary.main", mr: 2, width: 48, height: 48 }}
                >
                  {trip.companyName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {trip.companyName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trip.vehicleType}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2">
                    {trip.fromLocation} → {trip.toLocation}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Schedule sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2">
                    {trip.departureTime} - {trip.arrivalTime}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 3 }} />

              {/* Selected Seats */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Ghế đã chọn ({selectedSeats.length})
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selectedSeats.map((seat) => (
                    <Chip
                      key={seat.id}
                      label={seat.seatNumber}
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>
              <Divider sx={{ my: 3 }} />

              {/* Price Breakdown */}
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
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

              {/* Payment Button */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading || !isFormValid()}
                onClick={handleInitiatePayment}
                sx={{ py: 2, fontSize: "1.1rem", fontWeight: 700 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Đến trang thanh toán"
                )}
              </Button>

              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate("/my-bookings")}
                >
                  Xem vé đang giữ chỗ của tôi
                </Button>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingCheckout;