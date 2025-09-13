import React, { useState } from "react";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import { ConfirmationNumber, Phone } from "@mui/icons-material";
import type { BookingLookupParams } from "../types/booking";

interface BookingLookupFormProps {
  onLookup: (params: BookingLookupParams) => void;
  isLoading: boolean;
}

export const BookingLookupForm: React.FC<BookingLookupFormProps> = ({
  onLookup,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    identifier: "",
    contactPhone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLookup(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        name="identifier"
        label="Nhập mã vé hoặc mã đơn hàng"
        value={formData.identifier}
        onChange={handleInputChange}
        fullWidth
        required
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <ConfirmationNumber sx={{ mr: 1, color: "action.active" }} />
          ),
        }}
      />
      <TextField
        name="contactPhone"
        label="Nhập số điện thoại liên hệ"
        value={formData.contactPhone}
        onChange={handleInputChange}
        fullWidth
        required
        InputProps={{
          startAdornment: <Phone sx={{ mr: 1, color: "action.active" }} />,
        }}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={isLoading}
        sx={{ mt: 3, py: 1.5 }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Tìm vé của tôi"
        )}
      </Button>
    </Box>
  );
};
