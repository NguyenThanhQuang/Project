import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Divider,
} from "@mui/material";
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  DirectionsBus,
  Schedule,
  LocationOn,
  AttachMoney,
  EventSeat,
  Pause,
  PlayArrow,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../components/common/NotificationProvider";

interface Trip {
  id: string;
  tripName: string;
  fromCity: string;
  toCity: string;
  vehicleType: "Giường nằm" | "Ghế ngồi";
  vehicleNumber: string;
  seatCount: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  basePrice: number;
  discountPrice?: number;
  amenities: string[];
  status: "active" | "inactive" | "suspended";
  bookingCount: number;
  revenue: number;
  lastModified: string;
}

const ManageTrips: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Mock data - trong thực tế sẽ fetch từ API
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: "1",
      tripName: "HCM - Đà Lạt Express",
      fromCity: "TP. Hồ Chí Minh",
      toCity: "Đà Lạt",
      vehicleType: "Giường nằm",
      vehicleNumber: "79B-12345",
      seatCount: 40,
      departureTime: "08:00",
      arrivalTime: "14:00",
      duration: "6h",
      basePrice: 150000,
      discountPrice: 135000,
      amenities: ["WiFi miễn phí", "Điều hòa", "Nước uống", "Chăn gối"],
      status: "active",
      bookingCount: 156,
      revenue: 23400000,
      lastModified: "2024-01-15",
    },
    {
      id: "2",
      tripName: "Hà Nội - Hải Phòng",
      fromCity: "Hà Nội",
      toCity: "Hải Phòng",
      vehicleType: "Ghế ngồi",
      vehicleNumber: "30A-67890",
      seatCount: 45,
      departureTime: "06:30",
      arrivalTime: "08:30",
      duration: "2h",
      basePrice: 120000,
      amenities: ["WiFi miễn phí", "Điều hòa", "Nước uống"],
      status: "active",
      bookingCount: 89,
      revenue: 10680000,
      lastModified: "2024-01-10",
    },
    {
      id: "3",
      tripName: "Nha Trang - Quy Nhon",
      fromCity: "Nha Trang",
      toCity: "Quy Nhon",
      vehicleType: "Ghế ngồi",
      vehicleNumber: "86C-11111",
      seatCount: 45,
      departureTime: "14:00",
      arrivalTime: "17:30",
      duration: "3h 30m",
      basePrice: 100000,
      amenities: ["WiFi miễn phí", "Điều hòa"],
      status: "inactive",
      bookingCount: 12,
      revenue: 1200000,
      lastModified: "2024-01-08",
    },
  ]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, trip: Trip) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrip(trip);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTrip(null);
  };

  const handleStatusToggle = (tripId: string) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              status: trip.status === "active" ? "inactive" : "active",
            }
          : trip
      )
    );
    showNotification(
      `Trạng thái chuyến xe đã được ${
        selectedTrip?.status === "active" ? "tạm dừng" : "kích hoạt"
      }`,
      "success"
    );
    handleMenuClose();
  };

  const handleDeleteTrip = () => {
    if (selectedTrip) {
      setTrips((prev) => prev.filter((trip) => trip.id !== selectedTrip.id));
      showNotification("Xóa chuyến xe thành công", "success");
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "suspended":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Tạm dừng";
      case "suspended":
        return "Bị đình chỉ";
      default:
        return status;
    }
  };

  const filterTripsByStatus = (status?: string) => {
    if (!status || status === "all") return trips;
    return trips.filter((trip) => trip.status === status);
  };

  const getFilteredTrips = () => {
    switch (tabValue) {
      case 0:
        return filterTripsByStatus("all");
      case 1:
        return filterTripsByStatus("active");
      case 2:
        return filterTripsByStatus("inactive");
      default:
        return trips;
    }
  };

  const getTotalStats = () => {
    const filteredTrips = getFilteredTrips();
    return {
      totalTrips: filteredTrips.length,
      totalBookings: filteredTrips.reduce(
        (sum, trip) => sum + trip.bookingCount,
        0
      ),
      totalRevenue: filteredTrips.reduce((sum, trip) => sum + trip.revenue, 0),
    };
  };

  const stats = getTotalStats();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Quản lý chuyến xe
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Quản lý và theo dõi các chuyến xe của bạn
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/add-trip")}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
            }}
          >
            Thêm chuyến xe mới
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "primary.main" }}
                    >
                      {stats.totalTrips}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tổng chuyến xe
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <DirectionsBus />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "success.main" }}
                    >
                      {stats.totalBookings}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tổng lượt đặt
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "success.main" }}>
                    <EventSeat />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "warning.main" }}
                    >
                      {formatPrice(stats.totalRevenue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tổng doanh thu
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "warning.main" }}>
                    <AttachMoney />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filter Tabs */}
        <Paper elevation={1} sx={{ borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ px: 2 }}
          >
            <Tab label="Tất cả" />
            <Tab label="Hoạt động" />
            <Tab label="Tạm dừng" />
          </Tabs>
        </Paper>
      </Box>

      {/* Trips List */}
      <Grid container spacing={3}>
        {getFilteredTrips().length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Không có chuyến xe nào trong danh mục này.
            </Alert>
          </Grid>
        ) : (
          getFilteredTrips().map((trip) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={trip.id}>
              <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {trip.tripName}
                      </Typography>
                      <Chip
                        label={getStatusText(trip.status)}
                        color={getStatusColor(trip.status) as any}
                        size="small"
                      />
                    </Box>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, trip)}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn
                      sx={{ fontSize: 18, color: "text.secondary", mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {trip.fromCity} → {trip.toCity}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Schedule
                      sx={{ fontSize: 18, color: "text.secondary", mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {trip.departureTime} - {trip.arrivalTime} ({trip.duration}
                      )
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <DirectionsBus
                      sx={{ fontSize: 18, color: "text.secondary", mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {trip.vehicleType} - {trip.vehicleNumber} (
                      {trip.seatCount} ghế)
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AttachMoney
                      sx={{ fontSize: 18, color: "text.secondary", mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {formatPrice(trip.basePrice)}
                      {trip.discountPrice && (
                        <span style={{ color: "#f44336", marginLeft: 8 }}>
                          → {formatPrice(trip.discountPrice)}
                        </span>
                      )}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Lượt đặt
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {trip.bookingCount}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Doanh thu
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatPrice(trip.revenue)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Tiện ích:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      {trip.amenities.slice(0, 3).map((amenity) => (
                        <Chip
                          key={amenity}
                          label={amenity}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {trip.amenities.length > 3 && (
                        <Chip
                          label={`+${trip.amenities.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/edit-trip/${trip.id}`)}
                  >
                    Chỉnh sửa
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate(`/trips/${selectedTrip?.id}`)}>
          <Visibility sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={() => navigate(`/edit-trip/${selectedTrip?.id}`)}>
          <Edit sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() => selectedTrip && handleStatusToggle(selectedTrip.id)}
        >
          {selectedTrip?.status === "active" ? (
            <>
              <Pause sx={{ mr: 1 }} />
              Tạm dừng
            </>
          ) : (
            <>
              <PlayArrow sx={{ mr: 1 }} />
              Kích hoạt
            </>
          )}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => setDeleteDialogOpen(true)}
          sx={{ color: "error.main" }}
        >
          <Delete sx={{ mr: 1 }} />
          Xóa chuyến xe
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa chuyến xe</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa chuyến xe "{selectedTrip?.tripName}"? Hành
            động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleDeleteTrip} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageTrips;
