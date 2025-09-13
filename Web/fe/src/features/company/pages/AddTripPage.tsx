import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useAddTripForm } from "../hooks/useAddTripForm";
import { useAdminAddTripForm } from "../../admin/hooks/useAdminAddTripForm";
import BasicInfoStep from "../components/add-trip/BasicInfoStep";
import ScheduleStep from "../components/add-trip/ScheduleStep";
import PricingStep from "../components/add-trip/PricingStep";
import PreviewStep from "../components/add-trip/PreviewStep";
import type { RootState } from "../../../store";
import { getVehiclesByCompany } from "../../admin/services/vehicleAdminService";
import type { Vehicle } from "../../admin/types/vehicle";
import { getAllLocations } from "../../../services/locationService";
import type { LocationData } from "../../trips/types/location";

const steps = ["Thông tin cơ bản", "Lịch trình", "Giá vé", "Xem trước & Lưu"];

const AddTripPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.roles.includes("admin");

  const [allLocations, setAllLocations] = useState<LocationData[]>([]);
  const [companyVehicles, setCompanyVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    const fetchAllLocations = async () => {
      setLoadingLocations(true);
      try {
        const locations = await getAllLocations();
        const filteredLocations = locations.filter(
          (loc) => loc.type !== "city"
        );
        setAllLocations(filteredLocations);
      } catch (error) {
        console.error("Failed to fetch all locations", error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchAllLocations();
  }, []);

  const companyHookResult = useAddTripForm({ allLocations });
  const adminHookResult = useAdminAddTripForm({ allLocations });

  const formLogic = isAdmin ? adminHookResult : companyHookResult;

  const {
    activeStep,
    loading,
    isCalculating,
    formData,
    handleNext,
    handleBack,
    handleSave,
    handleFormChange,
    addRouteStop,
    removeRouteStop,
    updateRouteStop,
  } = formLogic;

  useEffect(() => {
    const fetchVehicles = async () => {
      if (formData.companyId) {
        setLoadingVehicles(true);
        try {
          const data = await getVehiclesByCompany(formData.companyId);
          setCompanyVehicles(data.filter((v) => v.status === "active"));
        } catch (error) {
          console.error("Failed to fetch vehicles", error);
        } finally {
          setLoadingVehicles(false);
        }
      }
    };
    fetchVehicles();
  }, [formData.companyId]);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            onFormChange={handleFormChange}
            companyVehicles={companyVehicles}
            allLocations={allLocations}
            loadingVehicles={loadingVehicles}
            loadingLocations={loadingLocations}
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
        return <Typography>Hoàn tất và kiểm tra lại thông tin.</Typography>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Thêm chuyến xe cho nhà xe: {formLogic.companyName}
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
                      disabled={loading || isCalculating}
                    >
                      {loading
                        ? "Đang lưu..."
                        : isCalculating
                        ? "Đang tính toán..."
                        : "Lưu chuyến xe"}
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

export default AddTripPage;
