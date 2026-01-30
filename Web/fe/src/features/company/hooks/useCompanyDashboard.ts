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
  updateMyVehicle
} from "../services/companyDashboardService";
import type { CompanyTrip, CompanyVehicle } from "../types/dashboard";
import { updateTrip } from "../services/tripCompanyService";

export const useCompanyDashboard = () => {
  const { showNotification } = useNotification();
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  const [trips, setTrips] = useState<CompanyTrip[]>([]);
  const [vehicles, setVehicles] = useState<CompanyVehicle[]>([]);
  
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);

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

  const handleOpenCreateDialog = () => {
    setVehicleToEdit(null);
    setVehicleDialogOpen(true);
  };

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

  const handleSaveVehicle = async (
    data: VehiclePayload,
    vehicleId?: string
  ) => {
    setIsActionLoading(true);
    try {
      if (vehicleId) {
        // Gọi API cập nhật
        await updateMyVehicle(vehicleId, data);
        showNotification("Cập nhật thông tin xe thành công!", "success");
        
        // Cập nhật UI ngay lập tức (optimistic update)
        setVehicles(prevVehicles =>
          prevVehicles.map(vehicle =>
            vehicle._id === vehicleId
              ? { 
                  ...vehicle, 
                  ...data,
                  vehicleNumber: data.vehicleNumber || vehicle.vehicleNumber,
                  type: data.type || vehicle.type,
                  totalSeats: data.totalSeats || vehicle.totalSeats
                }
              : vehicle
          )
        );
      } else {
        await createMyVehicle(data);
        showNotification("Thêm xe mới thành công!", "success");
        
        // Fetch lại dữ liệu để có thông tin mới nhất
        await fetchData();
      }
      
      setVehicleDialogOpen(false);
      setVehicleToEdit(null);
      
    } catch (error) {
      showNotification(
        getErrorMessage(error, "Lưu thông tin xe thất bại."),
        "error"
      );
      // Nếu lỗi, fetch lại để đồng bộ với server
      await fetchData();
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleRecurrence = async (tripToUpdate: CompanyTrip) => {
    try {
      // Optimistic update
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
      // Rollback nếu có lỗi
      await fetchData();
    }
  };

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