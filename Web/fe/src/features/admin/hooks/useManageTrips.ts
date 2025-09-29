import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { getCompanyDetails } from "../services/companyAdminService";
import {
  cancelTrip,
  getTripsByCompany,
  updateTrip,
} from "../services/tripAdminService";
import type { AdminTrip } from "../types/trip";

/**
 * Hook tùy chỉnh để quản lý toàn bộ logic cho trang "Quản lý chuyến đi" của Admin.
 */
export const useManageTrips = () => {
  const { companyId } = useParams<{ companyId: string }>();

  // State cho dữ liệu
  const [trips, setTrips] = useState<AdminTrip[]>([]);
  const [companyName, setCompanyName] = useState<string>("");

  // State cho trạng thái UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State cho phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State cho menu và dialog
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTrip, setSelectedTrip] = useState<AdminTrip | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  /**
   * Hàm gọi API để lấy dữ liệu chuyến đi và thông tin nhà xe.
   */
  const fetchData = useCallback(async () => {
    if (!companyId) {
      setError("Không tìm thấy ID nhà xe trong URL.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const [tripsData, companyData] = await Promise.all([
        getTripsByCompany(companyId),
        getCompanyDetails(companyId),
      ]);

      setTrips(tripsData);
      setCompanyName(companyData.name);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể tải dữ liệu chuyến đi. Vui lòng thử lại."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Tính toán danh sách chuyến đi cho trang hiện tại.
   */
  const paginatedTrips = useMemo(() => {
    return trips.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [trips, page, rowsPerPage]);

  /**
   * Xóa các thông báo lỗi hoặc thành công.
   */
  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    trip: AdminTrip
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrip(trip);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenCancelDialog = () => {
    setCancelDialogOpen(true);
    handleMenuClose();
  };

  /**
   * Xử lý xác nhận hủy chuyến: gọi API và cập nhật UI.
   */
  const confirmCancelTrip = async () => {
    if (!selectedTrip) return;
    clearMessages();
    try {
      setLoading(true);
      await cancelTrip(selectedTrip._id);
      setSuccessMessage(`Đã hủy chuyến đi thành công.`);
      await fetchData();
    } catch (err) {
      setError(
        getErrorMessage(err, "Hủy chuyến đi thất bại. Vui lòng thử lại.")
      );
    } finally {
      setLoading(false);
      setCancelDialogOpen(false);
    }
  };

  const handleToggleRecurrence = async (tripToUpdate: AdminTrip) => {
    clearMessages();
    try {
      setTrips((trips) =>
        trips.map((trip) =>
          trip._id === tripToUpdate._id
            ? { ...trip, isRecurrenceTemplate: !trip.isRecurrenceTemplate }
            : trip
        )
      );

      await updateTrip(tripToUpdate._id, {
        isRecurrenceTemplate: !tripToUpdate.isRecurrenceTemplate,
      });

      setSuccessMessage("Cập nhật trạng thái lặp lại thành công!");
    } catch (err) {
      setError(getErrorMessage(err, "Cập nhật thất bại."));
      fetchData();
    }
  };

  return {
    loading,
    error,
    successMessage,
    trips,
    companyName,
    companyId,
    paginatedTrips,
    page,
    rowsPerPage,
    anchorEl,
    selectedTrip,
    cancelDialogOpen,
    clearMessages,
    handleChangePage,
    handleChangeRowsPerPage,
    handleMenuOpen,
    handleMenuClose,
    handleOpenCancelDialog,
    confirmCancelTrip,
    setCancelDialogOpen,
    handleToggleRecurrence,
  };
};
