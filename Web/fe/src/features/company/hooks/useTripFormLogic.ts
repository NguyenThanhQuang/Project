import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../components/common/NotificationProvider";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import type {
  AddTripFormState,
  CreateTripPayload,
  RouteStopFormState,
} from "../types/trip";

interface UseTripFormLogicProps {
  initialCompanyId: string;
  saveFunction: (payload: CreateTripPayload) => Promise<unknown>;
  // saveFunction: (payload: CreateTripPayload) => Promise<Trip | AdminTrip>; //Rõ ràng hơn
  onSuccessRedirectPath: (companyId: string) => string;
}

export const useTripFormLogic = ({
  initialCompanyId,
  saveFunction,
  onSuccessRedirectPath,
}: UseTripFormLogicProps) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddTripFormState>({
    companyId: initialCompanyId,
    vehicleId: null,
    fromLocationId: null,
    toLocationId: null,
    departureTime: null,
    expectedArrivalTime: null,
    price: 0,
    stops: [],
  });

  const handleFormChange = <K extends keyof AddTripFormState>(
    field: K,
    value: AddTripFormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addRouteStop = () => {
    const newStop: RouteStopFormState = {
      id: `stop-${Date.now()}`,
      locationId: "",
      expectedArrivalTime: null,
      expectedDepartureTime: null,
    };
    handleFormChange("stops", [...formData.stops, newStop]);
  };

  const removeRouteStop = (stopId: string) => {
    handleFormChange(
      "stops",
      formData.stops.filter((stop) => stop.id !== stopId)
    );
  };

  const updateRouteStop = <K extends keyof RouteStopFormState>(
    stopId: string,
    field: K,
    value: RouteStopFormState[K]
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
        stops: formData.stops
          .filter((s) => s.locationId && s.expectedArrivalTime)
          .map((s) => ({
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
      await saveFunction(payload);
      showNotification("Thêm chuyến xe mới thành công!", "success");
      navigate(onSuccessRedirectPath(formData.companyId));
    } catch (err: unknown) {
      showNotification(
        getErrorMessage(err, "Thêm chuyến xe thất bại."),
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
    handleNext,
    handleBack,
    handleSave,
    handleFormChange,
    addRouteStop,
    removeRouteStop,
    updateRouteStop,
  };
};
