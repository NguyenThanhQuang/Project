import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Avatar,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import {
  Add,
  MoreVert,
  Edit,
  DirectionsBus,
  EventSeat,
  AttachMoney,
  Schedule,
  Visibility,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCompanyDashboard } from "../hooks/useCompanyDashboard";
import AddVehicleDialog from "../../admin/components/AddVehicleDialog";
import type { CompanyTrip, CompanyVehicle } from "../types/dashboard";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN").format(amount) + " đ";
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
const getStatusInfo = (status: string) => {
  switch (status) {
    case "scheduled":
      return { text: "Đã lên lịch", color: "info" as const };
    case "departed":
      return { text: "Đang chạy", color: "warning" as const };
    case "arrived":
      return { text: "Đã đến", color: "success" as const };
    case "cancelled":
      return { text: "Đã hủy", color: "error" as const };
    default:
      return { text: "Không xác định", color: "default" as const };
  }
};

const TripsView: React.FC<{ trips: CompanyTrip[] }> = ({ trips }) => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3}>
      {trips.length === 0 ? (
        <Grid size={{ xs: 12 }}>
          <Alert severity="info">
            Bạn chưa có chuyến xe nào. Hãy tạo một chuyến mới!
          </Alert>
        </Grid>
      ) : (
        trips.map((trip) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={trip._id}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {trip.route.fromLocationId.name} -{" "}
                      {trip.route.toLocationId.name}
                    </Typography>
                    <Chip
                      label={getStatusInfo(trip.status).text}
                      color={getStatusInfo(trip.status).color}
                      size="small"
                    />
                  </Box>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    color: "text.secondary",
                  }}
                >
                  <Schedule sx={{ fontSize: 18, mr: 1.5 }} />
                  <Typography variant="body2">
                    {formatDate(trip.departureTime)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    color: "text.secondary",
                  }}
                >
                  <DirectionsBus sx={{ fontSize: 18, mr: 1.5 }} />
                  <Typography variant="body2">
                    {trip.vehicleId.type} - {trip.vehicleId.vehicleNumber}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    color: "text.secondary",
                  }}
                >
                  <AttachMoney sx={{ fontSize: 18, mr: 1.5 }} />
                  <Typography variant="body2">
                    {formatCurrency(trip.price)}
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => navigate(`/trips/${trip._id}`)}
                >
                  Xem chi tiết
                </Button>
                <Button size="small" startIcon={<Edit />}>
                  Chỉnh sửa
                </Button>
              </Box>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

const VehiclesView: React.FC<{
  vehicles: CompanyVehicle[];
  onEditClick: (vehicle: CompanyVehicle) => void;
  isActionLoading: boolean;
}> = ({ vehicles, onEditClick, isActionLoading }) => (
  <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f5f7fa" }}>
            <TableCell sx={{ fontWeight: 600 }}>Biển số xe</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Loại xe</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Số ghế</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
              Thao tác
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle._id} hover>
              <TableCell sx={{ fontWeight: 500 }}>
                {vehicle.vehicleNumber}
              </TableCell>
              <TableCell>{vehicle.type}</TableCell>
              <TableCell>{vehicle.totalSeats}</TableCell>
              <TableCell>
                <Chip label={vehicle.status} size="small" variant="outlined" />
              </TableCell>
              <TableCell align="center">
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => onEditClick(vehicle)}
                  disabled={isActionLoading}
                >
                  Sửa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

// --- Main Component ---
const ManageTrips: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    loading,
    isActionLoading,
    activeTab,
    setActiveTab,
    trips,
    vehicles,
    tripStats,
    vehicleDialogOpen,
    setVehicleDialogOpen,
    vehicleToEdit,
    handleSaveVehicle,
    handleOpenCreateDialog,
    handleOpenEditDialog,
  } = useCompanyDashboard();

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
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
            Quản lý kinh doanh
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tổng quan về chuyến xe và đội xe của bạn
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => navigate("/add-trip")}
        >
          Thêm chuyến xe mới
        </Button>
      </Box>

      {/* Stats Cards with correct Grid syntax */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.light",
                  color: "primary.main",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <DirectionsBus fontSize="large" />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {tripStats.total}
              </Typography>
              <Typography color="text.secondary">Tổng chuyến xe</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "success.light",
                  color: "success.main",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <EventSeat fontSize="large" />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {tripStats.bookings}
              </Typography>
              <Typography color="text.secondary">Tổng lượt đặt</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "warning.light",
                  color: "warning.main",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <AttachMoney fontSize="large" />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {formatCurrency(tripStats.revenue)}
              </Typography>
              <Typography color="text.secondary">
                Tổng doanh thu (Ước tính)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ px: 2 }}
        >
          <Tab label="Quản lý Chuyến xe" id="tab-trips" />
          <Tab label="Quản lý Xe" id="tab-vehicles" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 4 }}>
        {activeTab === 0 && <TripsView trips={trips} />}
        {activeTab === 1 && (
          <>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenCreateDialog}
              >
                Thêm xe mới
              </Button>
            </Box>
            <VehiclesView
              vehicles={vehicles}
              onEditClick={handleOpenEditDialog}
              isActionLoading={isActionLoading}
            />
          </>
        )}
      </Box>

      {/* Dialog for Adding/Editing Vehicle */}
      {user?.companyId && (
        <AddVehicleDialog
          open={vehicleDialogOpen}
          onClose={() => setVehicleDialogOpen(false)}
          onSave={handleSaveVehicle}
          vehicleToEdit={vehicleToEdit}
          companyId={
            typeof user.companyId === "string"
              ? user.companyId
              : user.companyId._id
          }
        />
      )}
    </Container>
  );
};

export default ManageTrips;
