import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNotification } from "../../../components/common/NotificationProvider";
import type { RootState } from "../../../store";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { getVehicleDetails } from "../../admin/services/vehicleAdminService";
import type { Vehicle, VehiclePayload } from "../../admin/types/vehicle";
import {
  createMyVehicle,
  getMyTrips,
  getMyVehicles,
} from "../services/companyDashboardService";
import type { CompanyTrip, CompanyVehicle } from "../types/dashboard";
import { updateTrip } from "../services/tripCompanyService";

export const useCompanyDashboard = () => {
  // State & Hooks cơ bản
  const { showNotification } = useNotification();
  const { user } = useSelector((state: RootState) => state.auth);

  // State cho giao diện
  const [activeTab, setActiveTab] = useState(0); // 0: Chuyến xe, 1: Xe
  const [loading, setLoading] = useState(true); // Loading cho lần tải dữ liệu đầu tiên
  const [isActionLoading, setIsActionLoading] = useState(false); // Loading cho các hành động cụ thể (VD: bấm nút sửa)

  // State cho dữ liệu
  const [trips, setTrips] = useState<CompanyTrip[]>([]);
  const [vehicles, setVehicles] = useState<CompanyVehicle[]>([]);

  // State cho Dialog
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);

  /**
   * Hàm gọi API để lấy toàn bộ dữ liệu cần thiết cho trang.
   * Sử dụng Promise.all để tăng hiệu suất.
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tripsData, vehiclesData] = await Promise.all([
        getMyTrips(),
        getMyVehicles(),
      ]);
      setTrips(tripsData);
      setVehicles(vehiclesData);
    } catch (error) {
      showNotification(
        getErrorMessage(error, "Không thể tải dữ liệu dashboard của nhà xe."),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Mở dialog để thêm xe mới.
   * Reset vehicleToEdit để đảm bảo form trống.
   */
  const handleOpenCreateDialog = () => {
    setVehicleToEdit(null);
    setVehicleDialogOpen(true);
  };

  /**
   * Xử lý khi bấm nút "Sửa" xe.
   * Lấy dữ liệu chi tiết của xe đó rồi mới mở dialog.
   * @param vehicleSummary Dữ liệu tóm tắt của xe từ danh sách
   */
  const handleOpenEditDialog = async (vehicleSummary: CompanyVehicle) => {
    setIsActionLoading(true);
    try {
      const fullVehicleData = await getVehicleDetails(vehicleSummary._id);
      setVehicleToEdit(fullVehicleData);
      setVehicleDialogOpen(true);
    } catch (error) {
      showNotification(
        getErrorMessage(error, "Không thể lấy thông tin chi tiết của xe."),
        "error"
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * Xử lý việc lưu thông tin từ dialog (cả thêm mới và chỉnh sửa).
   * @param data Dữ liệu từ form trong dialog
   * @param vehicleId ID của xe (nếu đang ở chế độ sửa)
   */
  const handleSaveVehicle = async (
    data: VehiclePayload,
    vehicleId?: string
  ) => {
    setIsActionLoading(true);
    try {
      if (vehicleId) {
        // TODO: Implement updateMyVehicle service and logic
        // await updateMyVehicle(vehicleId, data);
        showNotification("Cập nhật thông tin xe thành công!", "success");
      } else {
        await createMyVehicle(data);
        showNotification("Thêm xe mới thành công!", "success");
      }
      setVehicleDialogOpen(false);
      await fetchData();
    } catch (error) {
      showNotification(
        getErrorMessage(error, "Lưu thông tin xe thất bại."),
        "error"
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleRecurrence = async (tripToUpdate: CompanyTrip) => {
    try {
      setTrips((currentTrips) =>
        currentTrips.map((trip) =>
          trip._id === tripToUpdate._id
            ? { ...trip, isRecurrenceTemplate: !trip.isRecurrenceTemplate }
            : trip
        )
      );

      await updateTrip(tripToUpdate._id, {
        isRecurrenceTemplate: !tripToUpdate.isRecurrenceTemplate,
      });

      showNotification("Cập nhật trạng thái lặp lại thành công!", "success");
    } catch (error) {
      showNotification(getErrorMessage(error, "Cập nhật thất bại."), "error");
      fetchData();
    }
  };

  /**
   * Tính toán các chỉ số thống kê cho chuyến xe.
   * Dùng useMemo để chỉ tính lại khi danh sách `trips` thay đổi.
   */
  const tripStats = useMemo(() => {
    return {
      total: trips.length,
      bookings: trips.reduce((sum, trip) => {
        const bookedSeats = trip.seats.filter(
          (s) => s.status === "booked"
        ).length;
        return sum + bookedSeats;
      }, 0),
      revenue: trips.reduce((sum, trip) => {
        const bookedSeats = trip.seats.filter(
          (s) => s.status === "booked"
        ).length;
        return sum + bookedSeats * trip.price;
      }, 0),
    };
  }, [trips]);

  return {
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
    handleToggleRecurrence,
  };
};
