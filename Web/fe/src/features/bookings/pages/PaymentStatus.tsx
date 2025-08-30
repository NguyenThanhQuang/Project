import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CardContent,
  Divider,
  Avatar,
  Chip,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  Cancel,
  Download,
  Home,
  Receipt,
  DirectionsBus,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { usePaymentStatus } from "../hooks/usePaymentStatus";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const PaymentStatus: React.FC = () => {
  const navigate = useNavigate();
  const { status, bookingDetails, error } = usePaymentStatus();

  // --- RENDER LOADING ---
  if (status === "loading") {
    return (
      <Container sx={{ textAlign: "center", py: 10 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Đang xác thực thông tin thanh toán...
        </Typography>
      </Container>
    );
  }

  // --- RENDER FAILED / CANCELLED ---
  if (status === "failed" || status === "cancelled") {
    const isCancelled = status === "cancelled";
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
        {isCancelled ? (
          <Cancel sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
        ) : (
          <Error sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
        )}
        <Typography
          variant="h3"
          sx={{ fontWeight: 700, mb: 2 }}
          color={isCancelled ? "warning.main" : "error.main"}
        >
          {isCancelled ? "Giao dịch đã bị hủy" : "Thanh toán không thành công"}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          {error ||
            (isCancelled
              ? "Bạn đã hủy giao dịch thanh toán."
              : "Rất tiếc, giao dịch của bạn không thể hoàn tất.")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate("/")}
          size="large"
        >
          Về trang chủ
        </Button>
      </Container>
    );
  }

  // --- RENDER SUCCESS ---
  if (status === "success" && bookingDetails) {
    const {
      tripId: trip,
      passengers,
      contactName,
      contactPhone,
      totalAmount,
      ticketCode,
    } = bookingDetails;
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 2, color: "success.main" }}
          >
            Thanh toán thành công!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Chúc mừng bạn đã đặt vé thành công! Vé điện tử đã được gửi đến email
            (nếu có).
          </Typography>
          {ticketCode && (
            <Chip
              label={`Mã vé: ${ticketCode}`}
              color="primary"
              sx={{ fontSize: "1.2rem", py: 2.5, px: 2, fontWeight: 600 }}
            />
          )}
        </Box>

        <Grid container spacing={4}>
          {/* Ticket Information */}
          <Grid size={{ xs: 12, lg: 8 }}>
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
                  <Receipt /> Thông tin vé điện tử
                </Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                {/* Trip Details */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Avatar
                    src={trip.companyId.logoUrl}
                    sx={{
                      bgcolor: "primary.main",
                      mr: 3,
                      width: 64,
                      height: 64,
                    }}
                  >
                    {trip.companyId.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {trip.companyId.name}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3} sx={{ textAlign: "center" }}>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "primary.main" }}
                    >
                      {new Date(trip.departureTime).toLocaleTimeString(
                        "vi-VN",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {trip.route.fromLocationId.name}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 2 }}>
                    <DirectionsBus
                      sx={{ color: "primary.main", fontSize: 32 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "primary.main" }}
                    >
                      {new Date(trip.expectedArrivalTime).toLocaleTimeString(
                        "vi-VN",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {trip.route.toLocationId.name}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />

                {/* Passenger Details */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Thông tin hành khách
                </Typography>
                {passengers.map((p, index) => (
                  <Box
                    key={index}
                    sx={{ mb: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}
                  >
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography>
                          <b>{p.name}</b>
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography>
                          Ghế: <b>{p.seatNumber}</b>
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography>
                          SĐT: <b>{p.phone}</b>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </CardContent>
            </Paper>
          </Grid>

          {/* Action & Summary */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={3}
              sx={{ borderRadius: 3, position: "sticky", top: 20 }}
            >
              <Box
                sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Tóm tắt
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography color="text.secondary">Liên hệ:</Typography>
                  <Typography>
                    <b>{contactName}</b> - {contactPhone}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography color="text.secondary">
                    Tổng thanh toán:
                  </Typography>
                  <Typography
                    variant="h5"
                    color="primary.main"
                    sx={{ fontWeight: 700 }}
                  >
                    {formatPrice(totalAmount)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Download />}
                    sx={{ py: 1.5 }}
                  >
                    Tải vé PDF
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Home />}
                    onClick={() => navigate("/")}
                    sx={{ py: 1.5 }}
                  >
                    Về trang chủ
                  </Button>
                </Box>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  // Fallback case
  return (
    <Container sx={{ textAlign: "center", py: 10 }}>
      <Alert severity="error">
        Đã có lỗi không mong muốn xảy ra. Vui lòng quay về trang chủ.
      </Alert>
      <Button variant="contained" onClick={() => navigate("/")} sx={{ mt: 2 }}>
        Về trang chủ
      </Button>
    </Container>
  );
};

export default PaymentStatus;
