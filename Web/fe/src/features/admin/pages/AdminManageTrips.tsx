import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Collapse,
  Switch,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  MoreVert,
  Cancel,
  Close,
  Add,
  ArrowBack,
  Edit,
} from "@mui/icons-material";
import { useManageTrips } from "../hooks/useManageTrips";

const AdminManageTrips: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const {
    loading,
    error,
    successMessage,
    clearMessages,
    companyName,
    paginatedTrips,
    tripsToDisplay,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    anchorEl,
    selectedTrip,
    cancelDialogOpen,
    handleMenuOpen,
    handleMenuClose,
    handleOpenCancelDialog,
    confirmCancelTrip,
    setCancelDialogOpen,
    handleToggleRecurrence,
    activeTab,
    setActiveTab,
  } = useManageTrips();

  const handleOpenEditPage = () => {
    if (selectedTrip) {
      navigate(`/admin/companies/${companyId}/trips/${selectedTrip._id}/edit`, {
        state: { companyName },
      });
    }
    handleMenuClose();
  };

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

  const calculateSeats = (seats: { status: string }[]) => {
    if (!seats) return "0 / 0";
    const total = seats.length;
    const booked = seats.filter((s) => s.status === "booked").length;
    return `${booked} / ${total}`;
  };

  if (loading && paginatedTrips.length === 0) {
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters>
      <Collapse in={!!successMessage}>
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          action={
            <IconButton size="small" onClick={clearMessages}>
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          {successMessage}
        </Alert>
      </Collapse>
      <Collapse in={!!error}>
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <IconButton size="small" onClick={clearMessages}>
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Collapse>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Quản lý chuyến đi
          </Typography>
          {companyName && (
            <Typography variant="h6" color="primary.main">
              {companyName}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          {activeTab === "templates" ? (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() =>
                navigate("/admin/add-trip", {
                  state: { companyId, companyName, isCreatingTemplate: true },
                })
              }
              sx={{
                background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
              }}
            >
              Tạo mẫu lặp lại mới
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() =>
                navigate("/admin/add-trip", {
                  state: { companyId, companyName },
                })
              }
              sx={{
                background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
              }}
            >
              Thêm chuyến đi
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/admin/companies")}
          >
            Quay lại danh sách nhà xe
          </Button>
        </Box>
      </Box>

      <Paper elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newVal) => setActiveTab(newVal)}
          variant="fullWidth"
        >
          <Tab label="Chuyến sắp tới" value="upcoming" />
          <Tab label="Lịch sử chuyến đi" value="history" />
          <Tab label="Mẫu lặp lại" value="templates" />
        </Tabs>
      </Paper>

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f7fa" }}>
                <TableCell sx={{ fontWeight: 600 }}>Tuyến đường</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {activeTab === "templates"
                    ? "Thời gian gốc"
                    : "Thời gian khởi hành"}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  Số ghế (Đã đặt/Tổng)
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Giá vé</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                {activeTab === "templates" && (
                  <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                    Kích hoạt Lặp Lại
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTrips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Box sx={{ p: 4 }}>
                      <Typography color="text.secondary">
                        Không có chuyến đi nào trong danh mục này.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTrips.map((trip) => (
                  <TableRow key={trip._id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {trip.route.fromLocationId.name} →{" "}
                      {trip.route.toLocationId.name}
                    </TableCell>
                    <TableCell>{trip.vehicleId.vehicleNumber}</TableCell>
                    <TableCell>
                      {activeTab === "templates"
                        ? new Date(trip.departureTime).toLocaleTimeString(
                            "vi-VN",
                            { hour: "2-digit", minute: "2-digit" }
                          )
                        : new Date(trip.departureTime).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell>{calculateSeats(trip.seats)}</TableCell>
                    <TableCell>{trip.price.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusInfo(trip.status).text}
                        color={getStatusInfo(trip.status).color}
                        size="small"
                      />
                    </TableCell>
                    {activeTab === "templates" && (
                      <TableCell align="center">
                        <Tooltip
                          title={
                            trip.isRecurrenceActive
                              ? "Đang hoạt động"
                              : "Đang tắt"
                          }
                        >
                          <Switch
                            checked={trip.isRecurrenceActive}
                            onChange={() => handleToggleRecurrence(trip)}
                            color="primary"
                          />
                        </Tooltip>
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <Tooltip
                        title={
                          trip.status !== "scheduled" &&
                          activeTab !== "templates"
                            ? "Chỉ có thể thao tác với chuyến đi đã lên lịch"
                            : "Thêm thao tác"
                        }
                      >
                        <span>
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, trip)}
                            disabled={
                              trip.status !== "scheduled" &&
                              activeTab !== "templates"
                            }
                          >
                            <MoreVert />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tripsToDisplay.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>

      {/* Menu thao tác */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleOpenEditPage}>
          <Edit sx={{ mr: 1.5 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleOpenCancelDialog} sx={{ color: "error.main" }}>
          <Cancel sx={{ mr: 1.5 }} />
          Hủy chuyến
        </MenuItem>
      </Menu>

      {/* Dialog xác nhận hủy chuyến */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Xác nhận Hủy chuyến đi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn hủy chuyến đi từ{" "}
            <strong>{selectedTrip?.route.fromLocationId.name}</strong> đến{" "}
            <strong>{selectedTrip?.route.toLocationId.name}</strong> khởi hành
            lúc{" "}
            <strong>
              {selectedTrip &&
                new Date(selectedTrip.departureTime).toLocaleString("vi-VN")}
            </strong>
            ?
            <br />
            <br />
            Hành động này không thể hoàn tác. Tất cả các vé đã đặt sẽ được tự
            động hủy.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Không</Button>
          <Button
            onClick={confirmCancelTrip}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Xác nhận Hủy"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminManageTrips;
