import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material";
import {
  Search,
  Add,
  MoreVert,
  Edit,
  Delete,
  DirectionsBus,
  AirlineSeatReclineNormal,
  Hotel,
  Settings,
  CheckCircle,
  Warning,
  Block,
  Close,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../../services/api";
import type { Company, Vehicle } from "../../../types";

export interface VehiclePayload {
  companyId: string;
  type: string;
  totalSeats: number;
  vehicleNumber: string;
  description?: string;
  status: "active" | "maintenance" | "inactive";
}

const getVehicles = async (companyId: string): Promise<Vehicle[]> => {
  const response = await api.get<Vehicle[]>("/vehicles", {
    params: { companyId },
  });
  return response.data;
};

const getCompanyDetails = async (companyId: string): Promise<Company> => {
  const response = await api.get<Company>(`/companies/${companyId}`);
  return response.data;
};

const createVehicle = async (data: VehiclePayload): Promise<Vehicle> => {
  const response = await api.post<Vehicle>("/vehicles", data);
  return response.data;
};

const updateVehicle = async (
  id: string,
  data: Partial<VehiclePayload>
): Promise<Vehicle> => {
  const response = await api.patch<Vehicle>(`/vehicles/${id}`, data);
  return response.data;
};

const deleteVehicle = async (id: string): Promise<void> => {
  await api.delete(`/vehicles/${id}`);
};

interface AddVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: VehiclePayload, id?: string) => void;
  vehicleToEdit: Vehicle | null;
  companyId: string;
}

const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({
  open,
  onClose,
  onSave,
  vehicleToEdit,
  companyId,
}) => {
  const isEditMode = !!vehicleToEdit;
  const [formData, setFormData] = useState<VehiclePayload>({
    companyId: companyId,
    type: "",
    vehicleNumber: "",
    totalSeats: 0,
    status: "active",
    description: "",
  });

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        companyId: vehicleToEdit.companyId,
        type: vehicleToEdit.type,
        vehicleNumber: vehicleToEdit.vehicleNumber,
        totalSeats: vehicleToEdit.totalSeats,
        status: vehicleToEdit.status,
        description: vehicleToEdit.description || "",
      });
    } else {
      setFormData({
        companyId: companyId,
        type: "",
        vehicleNumber: "",
        totalSeats: 0,
        status: "active",
        description: "",
      });
    }
  }, [vehicleToEdit, companyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData, vehicleToEdit?._id);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? "Chỉnh sửa thông tin xe" : "Thêm xe mới"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Loại xe (VD: Giường nằm 40 chỗ)"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Biển số xe"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Tổng số ghế"
              name="totalSeats"
              type="number"
              value={formData.totalSeats}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              label="Trạng thái"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="maintenance">Bảo trì</MenuItem>
              <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave} variant="contained">
          {isEditMode ? "Lưu thay đổi" : "Thêm xe"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ManageVehicles: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (!companyId) {
      setError(
        "Không có thông tin nhà xe. Vui lòng chọn một nhà xe để quản lý."
      );
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [companyDetails, vehicleData] = await Promise.all([
        getCompanyDetails(companyId),
        getVehicles(companyId),
      ]);
      setCompanyName(companyDetails.name);
      setVehicles(vehicleData);
    } catch (err) {
      setError("Không thể tải danh sách xe. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const getStatusColor = (status: Vehicle["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "maintenance":
        return "warning";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: Vehicle["status"]) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "maintenance":
        return "Bảo trì";
      case "inactive":
        return "Ngừng hoạt động";
      default:
        return status;
    }
  };

  const getVehicleTypeIcon = (type: string) => {
    if (type.toLowerCase().includes("giường")) return <Hotel />;
    if (type.toLowerCase().includes("ghế")) return <AirlineSeatReclineNormal />;
    if (type.toLowerCase().includes("limo")) return <DirectionsBus />;
    return <DirectionsBus />;
  };

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;

    if (activeTab !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.status === activeTab);
    }

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.vehicleNumber?.toLowerCase().includes(lowercasedFilter) ||
          vehicle.type.toLowerCase().includes(lowercasedFilter)
      );
    }

    return filtered;
  }, [vehicles, activeTab, searchTerm]);

  const stats = useMemo(
    () => ({
      total: vehicles.length,
      active: vehicles.filter((v) => v.status === "active").length,
      maintenance: vehicles.filter((v) => v.status === "maintenance").length,
      inactive: vehicles.filter((v) => v.status === "inactive").length,
    }),
    [vehicles]
  );

  const handleChangePage = (event: unknown, newPage: number) =>
    setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    vehicle: Vehicle
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(vehicle);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVehicle(null);
  };

  const handleOpenEditDialog = () => {
    if (selectedVehicle) {
      setVehicleToEdit(selectedVehicle);
      setAddEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleOpenCreateDialog = () => {
    setVehicleToEdit(null);
    setAddEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleSaveVehicle = async (data: VehiclePayload, id?: string) => {
    clearMessages();
    try {
      if (id) {
        await updateVehicle(id, data);
        setSuccessMessage("Cập nhật xe thành công!");
      } else {
        await createVehicle(data);
        setSuccessMessage("Thêm xe mới thành công!");
      }
      fetchData();
    } catch (err) {
      console.error("Failed to save vehicle:", err);
      setError("Thao tác thất bại. Vui lòng thử lại.");
    } finally {
      setAddEditDialogOpen(false);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle) return;
    clearMessages();
    try {
      await deleteVehicle(selectedVehicle._id);
      setSuccessMessage(`Đã xóa xe ${selectedVehicle.vehicleNumber}.`);
      fetchData();
    } catch (err) {
      console.error("Failed to delete vehicle:", err);
      setError("Xóa xe thất bại.");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

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

  if (error && !successMessage) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Xử lý trường hợp không có companyId (fallback)
  if (!companyId) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          Không tìm thấy thông tin nhà xe. Vui lòng quay lại trang quản lý nhà
          xe và chọn một nhà xe.
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

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center" }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.total}
              </Typography>
              <Typography color="text.secondary">Tổng số xe</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center" }}>
            <CardContent>
              <Typography
                variant="h4"
                color="success.main"
                sx={{ fontWeight: 700 }}
              >
                {stats.active}
              </Typography>
              <Typography color="text.secondary">Đang hoạt động</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center" }}>
            <CardContent>
              <Typography
                variant="h4"
                color="warning.main"
                sx={{ fontWeight: 700 }}
              >
                {stats.maintenance}
              </Typography>
              <Typography color="text.secondary">Bảo trì</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center" }}>
            <CardContent>
              <Typography
                variant="h4"
                color="error.main"
                sx={{ fontWeight: 700 }}
              >
                {stats.inactive}
              </Typography>
              <Typography color="text.secondary">Ngừng hoạt động</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f7fa" }}>
                <TableCell sx={{ fontWeight: 600 }}>Thông tin xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Số ghế</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVehicles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((vehicle) => (
                  <TableRow key={vehicle._id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar sx={{ bgcolor: "primary.light" }}>
                          {getVehicleTypeIcon(vehicle.type)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {vehicle.vehicleNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {vehicle.type}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{vehicle.totalSeats}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(vehicle.status)}
                        color={getStatusColor(vehicle.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, vehicle)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredVehicles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang"
        />
      </Paper>

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

      {addEditDialogOpen && (
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
          <Typography>
            Bạn có chắc chắn muốn xóa xe{" "}
            <strong>{selectedVehicle?.vehicleNumber}</strong>? Thao tác này sẽ
            xóa vĩnh viễn và không thể hoàn tác.
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
