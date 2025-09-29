import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import {
  createVehicle,
  deleteVehicle,
  getCompanyDetails,
  getVehiclesByCompany,
  updateVehicle,
} from "../services/vehicleAdminService";
import type { Vehicle, VehiclePayload, VehicleStatus } from "../types/vehicle";

export const useManageVehicles = () => {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();

  // Data state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // UI state for table and filtering
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<VehicleStatus | "all">("all");

  // UI state for menus and dialogs
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<
    "deactivate" | "activate" | "maintenance" | null
  >(null);

  const fetchData = useCallback(async () => {
    if (!companyId) {
      setError("Không tìm thấy ID nhà xe trong URL.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [vehiclesData, companyData] = await Promise.all([
        getVehiclesByCompany(companyId),
        getCompanyDetails(companyId),
      ]);
      setVehicles(vehiclesData);
      setCompanyName(companyData.name);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải dữ liệu xe."));
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

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;
    if (activeTab !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.status === activeTab);
    }
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.vehicleNumber.toLowerCase().includes(lowercasedFilter) ||
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

  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenCreateDialog = () => {
    setVehicleToEdit(null);
    setAddEditDialogOpen(true);
  };

  const handleOpenEditDialog = (vehicle: Vehicle) => {
    setVehicleToEdit(vehicle);
    setAddEditDialogOpen(true);
    handleMenuClose();
  };

  const handleSaveVehicle = async (
    vehicleData: VehiclePayload,
    vehicleId?: string
  ) => {
    clearMessages();
    try {
      setLoading(true);
      if (vehicleId) {
        await updateVehicle(vehicleId, vehicleData);
        setSuccessMessage("Cập nhật thông tin xe thành công!");
      } else {
        await createVehicle(vehicleData);
        setSuccessMessage("Thêm xe mới thành công!");
      }
      setAddEditDialogOpen(false);
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err, "Có lỗi xảy ra, vui lòng thử lại."));
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type: "deactivate" | "activate" | "maintenance") => {
    setActionType(type);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleOpenDeleteDialog = () => handleAction("deactivate");

  const confirmAction = async () => {
    if (!selectedVehicle || !actionType) return;

    clearMessages();
    setLoading(true);

    try {
      let successMsg = "";
      if (actionType === "deactivate") {
        await deleteVehicle(selectedVehicle._id); // API "xóa mềm"
        successMsg = `Đã vô hiệu hóa xe "${selectedVehicle.vehicleNumber}" thành công.`;
      } else if (actionType === "activate") {
        await updateVehicle(selectedVehicle._id, { status: "active" });
        successMsg = `Đã kích hoạt lại xe "${selectedVehicle.vehicleNumber}" thành công.`;
      } else if (actionType === "maintenance") {
        await updateVehicle(selectedVehicle._id, { status: "maintenance" });
        successMsg = `Đã chuyển xe "${selectedVehicle.vehicleNumber}" sang trạng thái bảo trì.`;
      }

      setSuccessMessage(successMsg);
      await fetchData();
    } catch (err) {
      setError(
        getErrorMessage(err, "Thao tác thất bại. Xe có thể đang được sử dụng.")
      );
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteVehicle = confirmAction;

  return {
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
    actionType,
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
    handleAction,
    confirmAction,
  };
};
