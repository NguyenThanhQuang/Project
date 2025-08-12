// File: fe/src/features/admin/hooks/useManageVehicles.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import * as vehicleAdminService from "../services/vehicleAdminService";
import type { Vehicle, VehiclePayload } from "../types/vehicle";

export const useManageVehicles = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string | "all">("all");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
        vehicleAdminService.getCompanyDetails(companyId),
        vehicleAdminService.getVehiclesByCompany(companyId),
      ]);
      setCompanyName(companyDetails.name);
      setVehicles(vehicleData);
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
  const handleOpenEditDialog = () => {
    if (selectedVehicle) {
      setVehicleToEdit(selectedVehicle);
      setAddEditDialogOpen(true);
    }
    handleMenuClose();
  };
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleSaveVehicle = async (data: VehiclePayload, id?: string) => {
    clearMessages();
    try {
      if (id) {
        await vehicleAdminService.updateVehicle(id, data);
        setSuccessMessage("Cập nhật xe thành công!");
      } else {
        await vehicleAdminService.createVehicle(data);
        setSuccessMessage("Thêm xe mới thành công!");
      }
      setAddEditDialogOpen(false);
      fetchData();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Thao tác thất bại.");
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle) return;
    clearMessages();
    try {
      await vehicleAdminService.deleteVehicle(selectedVehicle._id);
      setSuccessMessage(`Đã xóa xe ${selectedVehicle.vehicleNumber}.`);
      fetchData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Xóa xe thất bại."));
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;
    if (activeTab !== "all") {
      filtered = filtered.filter((v) => v.status === activeTab);
    }
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.vehicleNumber?.toLowerCase().includes(lowercasedFilter) ||
          v.type.toLowerCase().includes(lowercasedFilter)
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
  };
};
