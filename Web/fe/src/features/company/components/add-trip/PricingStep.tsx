import React from "react";
import { Grid, TextField } from "@mui/material";
import type { AddTripFormState } from "../../types/trip";
import NumericFormatCustom from "../../../../components/common/NumericFormatCustom";

interface PricingStepProps {
  formData: AddTripFormState;
  onFormChange: <K extends keyof AddTripFormState>(
    field: K,
    value: AddTripFormState[K]
  ) => void;
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
          label="Giá vé (VNĐ)"
          value={formData.price === 0 ? "" : formData.price}
          name="price"
          onChange={(e) => {
            const numericValue =
              e.target.value === "" ? 0 : Number(e.target.value);
            onFormChange("price", numericValue);
          }}
          required
          helperText="Nhập giá vé cho một hành khách trên chuyến đi này."
          InputProps={{
            inputComponent: NumericFormatCustom,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default PricingStep;
