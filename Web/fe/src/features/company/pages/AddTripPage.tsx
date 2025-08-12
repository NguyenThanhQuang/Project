import React from "react";
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
import useAddTripForm from "../hooks/useAddTripForm";

import BasicInfoStep from "../components/add-trip/BasicInfoStep";
import ScheduleStep from "../components/add-trip/ScheduleStep";
import PricingStep from "../components/add-trip/PricingStep";

const steps = ["Thông tin cơ bản", "Lịch trình", "Giá vé", "Lưu chuyến xe"];

const AddTripPage: React.FC = () => {
  const {
    activeStep,
    loading,
    formData,
    handleNext,
    handleBack,
    handleSave,
    handleFormChange,
  } = useAddTripForm();

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoStep formData={formData} onFormChange={handleFormChange} />
        );
      case 1:
        return (
          <ScheduleStep formData={formData} onFormChange={handleFormChange} />
        );
      case 2:
        return (
          <PricingStep formData={formData} onFormChange={handleFormChange} />
        );
      default:
        return <Typography>Hoàn tất và kiểm tra lại thông tin.</Typography>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Thêm chuyến xe mới
        </Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                <Typography variant="h6">{label}</Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ my: 2 }}>{renderStepContent(index)}</Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button disabled={index === 0} onClick={handleBack}>
                    Quay lại
                  </Button>
                  {index < steps.length - 1 ? (
                    <Button variant="contained" onClick={handleNext}>
                      Tiếp tục
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? "Đang lưu..." : "Lưu chuyến xe"}
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
