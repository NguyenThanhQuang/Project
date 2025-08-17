import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../../../components/common/NotificationProvider";
import type {
  AddTripFormState,
  CreateTripPayload,
  RouteStopFormState,
} from "../../company/types/trip";
// Chúng ta sẽ tạo service này ở bước sau
import { createTripForCompany } from "../services/tripAdminService";

export const useAdminAddTripForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();

  // Lấy companyId và companyName từ state được truyền qua navigate
  const companyInfo = location.state as {
    companyId: string;
    companyName: string;
  } | null;

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<AddTripFormState>({
    companyId: companyInfo?.companyId || "", // Lấy companyId từ state
    vehicleId: null,
    fromLocationId: null,
    toLocationId: null,
    departureTime: null,
    expectedArrivalTime: null,
    price: 0,
    stops: [],
  });

  // Điều hướng người dùng nếu họ vào trang này mà không có companyId
  useEffect(() => {
    if (!companyInfo?.companyId) {
      showNotification("Vui lòng chọn một nhà xe để thêm chuyến đi.", "error");
      navigate("/admin/companies");
    }
  }, [companyInfo, navigate, showNotification]);

  const handleFormChange = (field: keyof AddTripFormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addRouteStop = () => {
    const newStop: RouteStopFormState = {
      id: `stop-${Date.now()}`,
      locationId: "",
      arrivalTime: null,
      departureTime: null,
    };
    handleFormChange("stops", [...formData.stops, newStop]);
  };

  const removeRouteStop = (stopId: string) => {
    handleFormChange(
      "stops",
      formData.stops.filter((stop) => stop.id !== stopId)
    );
  };

  const updateRouteStop = (
    stopId: string,
    field: keyof RouteStopFormState,
    value: any
  ) => {
    const updatedStops = formData.stops.map((stop) =>
      stop.id === stopId ? { ...stop, [field]: value } : stop
    );
    handleFormChange("stops", updatedStops);
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSave = async () => {
    if (
      !formData.companyId ||
      !formData.vehicleId ||
      !formData.fromLocationId ||
      !formData.toLocationId ||
      !formData.departureTime ||
      !formData.expectedArrivalTime ||
      formData.price <= 0
    ) {
      showNotification("Vui lòng điền đầy đủ thông tin bắt buộc.", "error");
      return;
    }

    setLoading(true);

    const payload: CreateTripPayload = {
      companyId: formData.companyId,
      vehicleId: formData.vehicleId,
      route: {
        fromLocationId: formData.fromLocationId,
        toLocationId: formData.toLocationId,
        stops: formData.stops.map((s) => ({
          locationId: s.locationId,
          expectedArrivalTime: s.expectedArrivalTime!.toISOString(),
          expectedDepartureTime: s.expectedDepartureTime?.toISOString(),
        })),
      },
      departureTime: formData.departureTime.toISOString(),
      expectedArrivalTime: formData.expectedArrivalTime.toISOString(),
      price: formData.price,
    };

    try {
      await createTripForCompany(payload);
      showNotification("Thêm chuyến xe mới thành công!", "success");
      navigate(`/admin/companies/${formData.companyId}/trips`);
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Thêm chuyến xe thất bại.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    activeStep,
    loading,
    formData,
    companyName: companyInfo?.companyName || "Nhà xe",
    handleNext,
    handleBack,
    handleSave,
    handleFormChange,
    addRouteStop,
    removeRouteStop,
    updateRouteStop,
  };
};
