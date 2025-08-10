import React from "react";
import { Grid, TextField } from "@mui/material";
import type { AddTripFormState } from "../../types/trip";

interface PricingStepProps {
  formData: AddTripFormState;
  onFormChange: (field: keyof AddTripFormState, value: any) => void;
}

const PricingStep: React.FC<PricingStepProps> = ({
  formData,
  onFormChange,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          type="number"
          label="Giá vé (VNĐ)"
          value={formData.price}
          onChange={(e) => onFormChange("price", Number(e.target.value))}
          inputProps={{ min: 0, step: 10000 }}
          required
          helperText="Nhập giá vé cho một hành khách trên chuyến đi này."
        />
      </Grid>
      {/*
        Phần chọn tiện ích (amenities) có thể được thêm vào đây trong tương lai.
        Ví dụ:
        <Grid item xs={12}>
          <Typography variant="h6">Tiện ích</Typography>
          <Box>
            // Checkbox hoặc Chip group cho các tiện ích
          </Box>
        </Grid>
      */}
    </Grid>
  );
};

export default PricingStep;
