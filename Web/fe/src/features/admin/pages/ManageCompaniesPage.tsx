import React, { useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Block,
  CheckCircle,
  Close,
  AirportShuttle,
} from "@mui/icons-material";
import { useManageCompanies } from "../hooks/useManageCompanies";
import CompanyStatsCards from "../components/CompanyStatsCards";
import CompanyTable from "../components/CompanyTable";
import AdminActionDialog from "../components/AdminActionDialog";
import AddCompanyDialog from "../components/AddCompanyDialog";

const ManageCompaniesPage: React.FC = () => {
  const {
    loading,
    error,
    successMessage,
    stats,
    filteredCompanies,
    page,
    rowsPerPage,
    searchTerm,
    anchorEl,
    selectedCompany,
    companyDialogOpen,
    actionDialogOpen,
    actionType,
    companyToEdit,

    setSearchTerm,
    clearMessages,
    handleChangePage,
    handleChangeRowsPerPage,
    handleMenuOpen,
    handleMenuClose,
    handleNavigateToVehicles,
    handleAction,
    confirmAction,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleSaveCompany,
    setCompanyDialogOpen,
    setActionDialogOpen,
  } = useManageCompanies();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearMessages]);

  if (
    loading &&
    !companyDialogOpen &&
    !actionDialogOpen &&
    filteredCompanies.length === 0 //Company?
  ) {
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Vùng hiển thị thông báo lỗi và thành công */}
      <Collapse in={!!error}>
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={clearMessages}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Collapse>
      <Collapse in={!!successMessage}>
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={clearMessages}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          {successMessage}
        </Alert>
      </Collapse>

      {/* Thẻ thống kê */}
      <CompanyStatsCards stats={stats} />

      {/* Thanh tìm kiếm và nút thêm mới */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Tìm theo tên, email, SĐT..."
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
            Thêm nhà xe mới
          </Button>
        </Box>
      </Paper>

      {/* Bảng dữ liệu nhà xe */}
      <CompanyTable
        companies={filteredCompanies}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onMenuOpen={handleMenuOpen}
      />

      {/* Menu các hành động */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleNavigateToVehicles}>
          <AirportShuttle sx={{ mr: 1.5 }} />
          Quản lý xe
        </MenuItem>
        
        <MenuItem
          onClick={() =>
            selectedCompany && handleOpenEditDialog(selectedCompany)
          }
        >
          <Edit sx={{ mr: 1.5 }} />
          Chỉnh sửa
        </MenuItem>
        {selectedCompany?.status === "active" && (
          <MenuItem
            onClick={() => handleAction("suspend")}
            sx={{ color: "error.main" }}
          >
            <Block sx={{ mr: 1.5 }} />
            Tạm ngưng
          </MenuItem>
        )}
        {selectedCompany?.status !== "active" && (
          <MenuItem
            onClick={() => handleAction("activate")}
            sx={{ color: "success.main" }}
          >
            <CheckCircle sx={{ mr: 1.5 }} />
            Kích hoạt
          </MenuItem>
        )}
      </Menu>

      {/* Dialog xác nhận hành động */}
      <AdminActionDialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        onConfirm={confirmAction}
        title={`Xác nhận ${
          actionType === "suspend" ? "tạm ngưng" : "kích hoạt"
        }`}
        contentText={`Bạn có chắc chắn muốn ${
          actionType === "suspend" ? "tạm ngưng" : "kích hoạt"
        } nhà xe "${selectedCompany?.name}" không?`}
        confirmButtonColor={actionType === "suspend" ? "error" : "success"}
      />

      {/* Dialog thêm/sửa nhà xe */}
      <AddCompanyDialog
        open={companyDialogOpen}
        onClose={() => setCompanyDialogOpen(false)}
        onSave={handleSaveCompany}
        companyToEdit={companyToEdit}
      />
    </Container>
  );
};

export default ManageCompaniesPage;
