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
  Chip,
  Button,
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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { MoreVert, Cancel, Close, Add, ArrowBack } from "@mui/icons-material";
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
    trips,
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
  } = useManageTrips();

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
    const total = seats.length;
    const booked = seats.filter((s) => s.status === "booked").length;
    return `${booked} / ${total}`;
  };

  if (loading && trips.length === 0) {
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
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() =>
            navigate("/admin/add-trip", { state: { companyId, companyName } })
          }
          sx={{
            background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
          }}
        >
          Thêm chuyến xe mới
        </Button>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/admin/companies")}
        >
          Quay lại danh sách nhà xe
        </Button>
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f7fa" }}>
                <TableCell sx={{ fontWeight: 600 }}>Tuyến đường</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  Thời gian khởi hành
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  Số ghế (Đã đặt/Tổng)
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Giá vé</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTrips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ p: 4 }}>
                      <Typography color="text.secondary">
                        Nhà xe này chưa có chuyến đi nào.
                      </Typography>
                      {/* Thêm nút tạo chuyến đi sau này */}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTrips.map((trip) => (
                  <TableRow key={trip._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {trip.route.fromLocationId.name} -{" "}
                      {trip.route.toLocationId.name}
                    </TableCell>
                    <TableCell>{trip.vehicleId.vehicleNumber}</TableCell>
                    <TableCell>
                      {new Date(trip.departureTime).toLocaleString("vi-VN")}
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
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, trip)}
                        disabled={trip.status !== "scheduled"}
                      >
                        <MoreVert />
                      </IconButton>
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
          count={trips.length}
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
            động hủy và hoàn tiền (nếu có chính sách).
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
