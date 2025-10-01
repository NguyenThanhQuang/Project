import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Save } from "@mui/icons-material";

import { useTripFormLogic } from "../hooks/useTripFormLogic";
import BasicInfoStep from "../components/add-trip/BasicInfoStep";
import ScheduleStep from "../components/add-trip/ScheduleStep";
import PricingStep from "../components/add-trip/PricingStep";
import PreviewStep from "../components/add-trip/PreviewStep";

import { getVehiclesByCompany } from "../services/tripCompanyService";
import { getAllLocations } from "../../../services/locationService";
import {
  getTripForEditing,
  updateTrip,
} from "../../admin/services/tripAdminService";

import type { Vehicle } from "../../admin/types/vehicle";
import type { LocationData } from "../../trips/types/location";
import type { PopulatedTrip } from "../../trips/types/trip";
import { getErrorMessage } from "../../../utils/getErrorMessage";

const steps = ["Thông tin cơ bản", "Lịch trình", "Giá vé", "Xem trước & Lưu"];

const EditTripPage: React.FC = () => {
  const { tripId, companyId } = useParams<{
    tripId: string;
    companyId: string;
  }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { companyName: initialCompanyName } = (location.state || {}) as {
    companyName?: string;
  };

  const [initialData, setInitialData] = useState<PopulatedTrip | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [allLocations, setAllLocations] = useState<LocationData[]>([]);
  const [companyVehicles, setCompanyVehicles] = useState<Vehicle[]>([]);

  const formLogic = useTripFormLogic({
    initialCompanyId: initialData?.companyId._id || companyId || "",
    isCreatingTemplate: false,
    saveFunction: (payload) => updateTrip(tripId!, payload),
    onSuccessRedirectPath: (cid) => `/admin/companies/${cid}/trips`,
    allLocations,
  });

  const {
    activeStep,
    loading: isSaving,
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
  } = formLogic;

  const fetchAndSetInitialData = useCallback(async () => {
    if (!tripId) {
      setError("Không tìm thấy ID chuyến đi trong URL.");
      setDataLoading(false);
      return;
    }

    try {
      const tripData = await getTripForEditing(tripId);
      setInitialData(tripData);

      const [locationsData, vehiclesData] = await Promise.all([
        getAllLocations(),
        getVehiclesByCompany(tripData.companyId._id),
      ]);

      setAllLocations(locationsData.filter((loc) => loc.type !== "city"));
      setCompanyVehicles(
        vehiclesData.filter(
          (v) => v.status === "active" || v._id === tripData.vehicleId._id
        )
      );

      setFormData({
        companyId: tripData.companyId._id,
        vehicleId: tripData.vehicleId._id,
        fromLocationId: tripData.route.fromLocationId._id,
        toLocationId: tripData.route.toLocationId._id,
        departureTime: dayjs(tripData.departureTime),
        expectedArrivalTime: dayjs(tripData.expectedArrivalTime),
        price: tripData.price,
        stops: tripData.route.stops.map((stop) => ({
          id: stop.locationId._id,
          locationId: stop.locationId._id,
          expectedArrivalTime: dayjs(stop.expectedArrivalTime),
          expectedDepartureTime: stop.expectedDepartureTime
            ? dayjs(stop.expectedDepartureTime)
            : null,
        })),
        isRecurrenceTemplate: tripData.isRecurrenceTemplate,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải dữ liệu chuyến đi."));
    } finally {
      setDataLoading(false);
    }
  }, [tripId, setFormData]);

  useEffect(() => {
    fetchAndSetInitialData();
  }, [fetchAndSetInitialData]);

  if (dataLoading) {
    return (
      <Container sx={{ textAlign: "center", py: 10 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            onFormChange={handleFormChange}
            companyVehicles={companyVehicles}
            allLocations={allLocations}
            loadingVehicles={false}
            loadingLocations={false}
          />
        );
      case 1:
        return (
          <ScheduleStep
            formData={formData}
            onFormChange={handleFormChange}
            onAddStop={addRouteStop}
            onRemoveStop={removeRouteStop}
            onUpdateStop={updateRouteStop}
            allLocations={allLocations}
            isCalculating={isCalculating}
          />
        );
      case 2:
        return (
          <PricingStep formData={formData} onFormChange={handleFormChange} />
        );
      case 3:
        return (
          <PreviewStep
            formData={formData}
            vehicleData={companyVehicles.find(
              (v) => v._id === formData.vehicleId
            )}
            fromLocationData={allLocations.find(
              (l) => l._id === formData.fromLocationId
            )}
            toLocationData={allLocations.find(
              (l) => l._id === formData.toLocationId
            )}
            stopsData={formData.stops
              .map((s) => {
                const locationInfo = allLocations.find(
                  (l) => l._id === s.locationId
                );
                if (!locationInfo) return null;
                return {
                  ...locationInfo,
                  arrivalTime: s.expectedArrivalTime?.toISOString(),
                  departureTime: s.expectedDepartureTime?.toISOString(),
                };
              })
              .filter(
                (item): item is NonNullable<typeof item> => item !== null
              )}
          />
        );
      default:
        return <Typography>Bước không xác định.</Typography>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Chỉnh sửa chuyến đi
          <Typography variant="h6" color="primary.main">
            {initialCompanyName || initialData?.companyId.name}
          </Typography>
        </Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                <Typography variant="h6">{label}</Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ my: 2 }}>{renderStepContent(index)}</Box>
                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Quay lại
                  </Button>
                  {activeStep < steps.length - 1 ? (
                    <Button variant="contained" onClick={handleNext}>
                      Tiếp tục
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={isSaving || isCalculating}
                    >
                      {isSaving
                        ? "Đang lưu..."
                        : isCalculating
                        ? "Đang tính toán..."
                        : "Lưu thay đổi"}
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Container>
  );
};

export default EditTripPage;
