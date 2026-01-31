import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../components/common/NotificationProvider";
import { calculateRouteInfo } from "../../../services/mapService";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import type { LocationData } from "../../trips/types/location";
import type {
  AddTripFormState,
  CreateTripPayload,
  RouteStopFormState,
} from "../types/trip";

interface UseTripFormLogicProps {
  initialCompanyId: string;
  isCreatingTemplate: boolean;
  saveFunction: (payload: CreateTripPayload) => Promise<unknown>;
  onSuccessRedirectPath: (companyId: string) => string;
  allLocations: LocationData[];
}

export const useTripFormLogic = ({
  initialCompanyId,
  isCreatingTemplate,
  saveFunction,
  onSuccessRedirectPath,
  allLocations,
}: UseTripFormLogicProps) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const [formData, setFormData] = useState<AddTripFormState>({
    companyId: initialCompanyId,
    vehicleId: null,
    fromLocationId: null,
    toLocationId: null,
    departureTime: null,
    expectedArrivalTime: null,
    price: 0,
    stops: [],
    isRecurrenceTemplate: isCreatingTemplate,
  });

  useEffect(() => {
    const calculateAndSetTimes = async () => {
      if (
        !formData.fromLocationId ||
        !formData.toLocationId ||
        !formData.departureTime ||
        allLocations.length === 0
      ) {
        return;
      }

      const waypointsCoords: [number, number][] = [];
      const fromLocation = allLocations.find(
        (l) => l._id === formData.fromLocationId
      );
      if (fromLocation) waypointsCoords.push(fromLocation.location.coordinates);

      formData.stops.forEach((stop) => {
        const stopLocation = allLocations.find(
          (l) => l._id === stop.locationId
        );
        if (stopLocation)
          waypointsCoords.push(stopLocation.location.coordinates);
      });

      const toLocation = allLocations.find(
        (l) => l._id === formData.toLocationId
      );
      if (toLocation) waypointsCoords.push(toLocation.location.coordinates);

      if (waypointsCoords.length < 2) return;

      setIsCalculating(true);
      try {
        const routeInfo = await calculateRouteInfo(
          waypointsCoords.map((coords) => ({
            longitude: coords[0],
            latitude: coords[1],
          }))
        );

        const totalStopTimeInSeconds = formData.stops.reduce((total, stop) => {
          if (stop.expectedArrivalTime && stop.expectedDepartureTime) {
            const stopDuration = stop.expectedDepartureTime.diff(
              stop.expectedArrivalTime,
              "second"
            );
            return total + (stopDuration > 0 ? stopDuration : 0);
          }
          return total;
        }, 0);

        const totalDurationInSeconds =
          routeInfo.duration + totalStopTimeInSeconds;
        const newArrivalTime = formData.departureTime.add(
          totalDurationInSeconds,
          "second"
        );

        setFormData((prev) => ({
          ...prev,
          expectedArrivalTime: dayjs(newArrivalTime),
        }));
      } catch (err) {
        showNotification(
          getErrorMessage(err, "Lỗi khi tính toán thời gian di chuyển."),
          "error"
        );
      } finally {
        setIsCalculating(false);
      }
    };

    calculateAndSetTimes();
  }, [
    formData.fromLocationId,
    formData.toLocationId,
    formData.departureTime,
    formData.stops,
    allLocations,
    showNotification,
  ]);

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
    fromLocationId:
      typeof formData.fromLocationId === "string"
        ? formData.fromLocationId
        : (formData.fromLocationId as any)?._id,

    toLocationId:
      typeof formData.toLocationId === "string"
        ? formData.toLocationId
        : (formData.toLocationId as any)?._id,

    stops: formData.stops
      .filter((s) => s.locationId && s.expectedArrivalTime)
      .map((s) => ({
        locationId:
          typeof s.locationId === "string"
            ? s.locationId
            : (s.locationId as any)._id,
        expectedArrivalTime: s.expectedArrivalTime!.toISOString(),
        expectedDepartureTime: s.expectedDepartureTime?.toISOString(),
      })),
  },
  departureTime: formData.departureTime.toISOString(),
  expectedArrivalTime: formData.expectedArrivalTime.toISOString(),
  price: formData.price,
  isRecurrenceTemplate: formData.isRecurrenceTemplate,
};


    try {
      await saveFunction(payload);
      const message = formData.isRecurrenceTemplate
        ? "Lưu mẫu lặp lại thành công!"
        : "Lưu chuyến đi thành công!";
      showNotification(message, "success");
      navigate(onSuccessRedirectPath(formData.companyId), {
        state: { refresh: true },
      });
    } catch (err: unknown) {
      const message = formData.isRecurrenceTemplate
        ? "Lưu mẫu lặp lại thất bại."
        : "Lưu chuyến đi thất bại.";
      showNotification(getErrorMessage(err, message), "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    activeStep,
    loading,
    isCalculating,
    formData,
    setFormData,
    handleNext,
    handleBack,
    handleSave,
    handleFormChange,
    addRouteStop,
    removeRouteStop,
    updateRouteStop,
  };
};
