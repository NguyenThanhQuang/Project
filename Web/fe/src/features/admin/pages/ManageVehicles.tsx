import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Search,
  Add,
  // MoreVert,
  Edit,
  Delete,
  Close,
} from "@mui/icons-material";
import { useManageVehicles } from "../hooks/useManageVehicles";
import VehicleTable from "../components/VehicleTable";
import VehicleStatsCards from "../components/VehicleStatsCards";
import AddVehicleDialog from "../components/AddVehicleDialog";

const ManageVehicles: React.FC = () => {
  const {
    loading,
    error,
    successMessage,
    companyName,
    companyId,
    stats,
    filteredVehicles,
    page,
    rowsPerPage,
    searchTerm,
    activeTab,
    anchorEl,
    selectedVehicle,
    addEditDialogOpen,
    vehicleToEdit,
    deleteDialogOpen,
    setSearchTerm,
    setActiveTab,
    clearMessages,
    handleChangePage,
    handleChangeRowsPerPage,
    handleMenuOpen,
    handleMenuClose,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleOpenDeleteDialog,
    handleSaveVehicle,
    handleDeleteVehicle,
    setAddEditDialogOpen,
    setDeleteDialogOpen,
    navigate,
  } = useManageVehicles();

  if (loading && filteredVehicles.length === 0) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", my: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!companyId) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          Không tìm thấy thông tin nhà xe.
          <Button onClick={() => navigate("/admin/companies")} sx={{ ml: 2 }}>
            Quay lại
          </Button>
        </Alert>
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

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Quản lý xe: {companyName}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Thêm, sửa, xóa và quản lý các loại xe của nhà xe này.
      </Typography>

      <VehicleStatsCards stats={stats} />

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Tìm kiếm biển số, loại xe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreateDialog}
            sx={{
              background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
            }}
          >
            Thêm xe mới
          </Button>
        </Box>
        <Tabs
          value={activeTab}
          onChange={(_, newVal) => setActiveTab(newVal)}
          sx={{ mt: 2 }}
        >
          <Tab label={`Tất cả (${stats.total})`} value="all" />
          <Tab label={`Hoạt động (${stats.active})`} value="active" />
          <Tab label={`Bảo trì (${stats.maintenance})`} value="maintenance" />
          <Tab label={`Ngừng hoạt động (${stats.inactive})`} value="inactive" />
        </Tabs>
      </Paper>

      <VehicleTable
        vehicles={filteredVehicles}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onMenuOpen={handleMenuOpen}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenEditDialog}>
          <Edit sx={{ mr: 1.5 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: "error.main" }}>
          <Delete sx={{ mr: 1.5 }} />
          Xóa
        </MenuItem>
      </Menu>

      {addEditDialogOpen && companyId && (
        <AddVehicleDialog
          open={addEditDialogOpen}
          onClose={() => setAddEditDialogOpen(false)}
          onSave={handleSaveVehicle}
          vehicleToEdit={vehicleToEdit}
          companyId={companyId}
        />
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa xe</DialogTitle>
        <DialogContent>
          {/* FIX: Đã xóa bỏ việc truy cập `totalTrips` */}
          <Typography>
            Bạn có chắc chắn muốn xóa xe{" "}
            <strong>{selectedVehicle?.vehicleNumber}</strong>? Thao tác này sẽ
            xóa vĩnh viễn và không thể hoàn tác.
            <br />
            <br />
            Nếu xe đang được gán cho các chuyến đi sắp tới, hệ thống sẽ không
            cho phép xóa.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleDeleteVehicle}
            variant="contained"
            color="error"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageVehicles;
