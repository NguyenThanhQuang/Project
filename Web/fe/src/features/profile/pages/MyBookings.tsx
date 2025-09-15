// fe/src/features/profile/pages/MyBookings.tsx

import React from "react";
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
} from "@mui/material";
import {
  History,
  Timer,
  CheckCircle,
  Block,
  Close,
  DirectionsBus,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { ReviewForm } from "../../reviews/components/ReviewForm";
import { MyBookingCard } from "../../bookings/components/MyBookingCard";
import { useMyBookings } from "../../bookings/hooks/useMyBookings";

const MyBookings: React.FC = () => {
  const navigate = useNavigate();

  // Bước 1: Gọi custom hook để lấy tất cả state và logic cần thiết
  const {
    isLoading,
    error,
    bookings,
    filteredBookings,
    activeTab,
    setActiveTab,
    reviewDialogOpen,
    selectedBooking,
    handleOpenReviewDialog,
    handleCloseReviewDialog,
    handleReviewSubmit,
  } = useMyBookings();

  // Bước 2: Xử lý các trạng thái đặc biệt (loading, error)
  if (isLoading) {
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
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Bước 3: Xử lý giao diện khi người dùng chưa có booking nào
  if (!isLoading && bookings.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center" }}>
          <DirectionsBus
            sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Chưa có chuyến đi nào
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Bạn chưa đặt vé xe khách nào. Hãy tìm kiếm và đặt chuyến đi đầu tiên
            của bạn!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            sx={{
              py: 2,
              px: 4,
              background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
            }}
          >
            Đặt vé ngay
          </Button>
        </Box>
      </Container>
    );
  }

  // Bước 4: Hiển thị giao diện chính
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Chuyến xe của tôi
      </Typography>

      <Paper elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              py: 2,
            },
          }}
        >
          <Tab
            icon={<History />}
            iconPosition="start"
            label={`Tất cả (${bookings.length})`}
            value="all"
          />
          <Tab
            icon={<Timer />}
            iconPosition="start"
            label={`Sắp đi (${
              bookings.filter(
                (b) =>
                  b.trip.departureDate >=
                    new Date().toISOString().split("T")[0] &&
                  ["confirmed", "held"].includes(b.status)
              ).length
            })`}
            value="upcoming"
          />
          <Tab
            icon={<CheckCircle />}
            iconPosition="start"
            label={`Đã đi (${
              bookings.filter(
                (b) =>
                  b.trip.departureDate <
                    new Date().toISOString().split("T")[0] ||
                  b.status === "completed"
              ).length
            })`}
            value="completed"
          />
          <Tab
            icon={<Block />}
            iconPosition="start"
            label={`Đã hủy (${
              bookings.filter((b) =>
                ["cancelled", "expired"].includes(b.status)
              ).length
            })`}
            value="cancelled"
          />
        </Tabs>
      </Paper>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <MyBookingCard
              key={booking.id}
              booking={booking}
              onReviewClick={handleOpenReviewDialog}
            />
          ))
        ) : (
          <Typography align="center" color="text.secondary" sx={{ py: 5 }}>
            Không có chuyến đi nào trong danh mục này.
          </Typography>
        )}
      </Box>

      {/* Dialog để hiển thị form đánh giá */}
      <Dialog
        open={reviewDialogOpen}
        onClose={handleCloseReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Đánh giá chuyến đi
          <IconButton
            onClick={handleCloseReviewDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && <ReviewForm onSubmit={handleReviewSubmit} />}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MyBookings;
