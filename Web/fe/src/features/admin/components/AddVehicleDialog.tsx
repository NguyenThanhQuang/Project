import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider,
  Autocomplete,
  Chip,
  type SelectChangeEvent,
  Paper,
  Alert,
} from "@mui/material";
import type { Vehicle, VehiclePayload, VehicleStatus } from "../types/vehicle";

interface AddVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: VehiclePayload, id?: string) => void;
  vehicleToEdit: Vehicle | null;
  companyId: string;
}

const vehiclePresets = [
  {
    label: "Xe giường nằm 40-44 chỗ",
    floors: 2,
    seatColumns: 3,
    seatRows: 7,
    aislePositions: [2],
  },
  {
    label: "Xe ghế ngồi 45 chỗ",
    floors: 1,
    seatColumns: 4,
    seatRows: 11,
    aislePositions: [2],
  },
  {
    label: "Limousine 9 chỗ",
    floors: 1,
    seatColumns: 3,
    seatRows: 3,
    aislePositions: [1],
  },
];

const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({
  open,
  onClose,
  onSave,
  vehicleToEdit,
  companyId,
}) => {
  const isEditMode = !!vehicleToEdit;

  const [formData, setFormData] = useState<
    Omit<
      VehiclePayload,
      "floors" | "seatColumns" | "seatRows" | "aislePositions"
    >
  >({
    companyId: "",
    type: "",
    vehicleNumber: "",
    status: "active",
    description: "",
  });

  const [seatParams, setSeatParams] = useState({
    floors: 1,
    seatColumns: 4,
    seatRows: 11,
    aislePositions: [2] as number[],
  });

  const getInitialState = useCallback(() => {
    if (isEditMode && vehicleToEdit) {
      setFormData({
        companyId: vehicleToEdit.companyId._id,
        type: vehicleToEdit.type,
        vehicleNumber: vehicleToEdit.vehicleNumber,
        status: vehicleToEdit.status,
        description: vehicleToEdit.description || "",
      });
      setSeatParams({
        floors: vehicleToEdit.floors,
        seatColumns: vehicleToEdit.seatColumns,
        seatRows: vehicleToEdit.seatRows,
        aislePositions: vehicleToEdit.aislePositions,
      });
    } else {
      setFormData({
        companyId: companyId,
        type: "Xe ghế ngồi 45 chỗ",
        vehicleNumber: "",
        status: "active",
        description: "",
      });
      setSeatParams({
        floors: 1,
        seatColumns: 4,
        seatRows: 11,
        aislePositions: [2],
      });
    }
  }, [isEditMode, vehicleToEdit, companyId]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValidationError(null);
      getInitialState();
    }
  }, [open, getInitialState]);

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (event: SelectChangeEvent<VehicleStatus>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParamChange = (
    field: keyof typeof seatParams,
    value: number | number[]
  ) => {
    setSeatParams((prev) => ({ ...prev, [field]: value }));
  };

  const handlePresetChange = (
    _event: React.SyntheticEvent,
    preset: (typeof vehiclePresets)[0] | null
  ) => {
    if (preset) {
      setFormData((prev) => ({ ...prev, type: preset.label }));
      setSeatParams({
        floors: preset.floors,
        seatColumns: preset.seatColumns,
        seatRows: preset.seatRows,
        aislePositions: preset.aislePositions,
      });
    }
  };

  const handleSave = async () => {
    setValidationError(null);

    if (!formData.type.trim() || !formData.vehicleNumber.trim()) {
      setValidationError("Loại xe và Biển số xe là các trường bắt buộc.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: VehiclePayload = { ...formData, ...seatParams };
      await onSave(payload, vehicleToEdit?._id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setValidationError(err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const previewData = useMemo(() => {
    const generateLayout = (prefix: "A" | "B") => {
      const layout: (string | null)[][] = [];
      let seatCounter = 0;
      for (let r = 0; r < seatParams.seatRows; r++) {
        const row: (string | null)[] = [];
        for (let c = 1; c <= seatParams.seatColumns; c++) {
          if (seatParams.aislePositions.includes(c)) {
            row.push(null);
          } else {
            seatCounter++;
            row.push(`${prefix}${seatCounter.toString().padStart(2, "0")}`);
          }
        }
        layout.push(row);
      }
      return { layout, seatCount: seatCounter };
    };

    const floor1Data = generateLayout("A");
    let floor2Data: { layout: (string | null)[][]; seatCount: number } | null =
      null;

    if (seatParams.floors > 1) {
      floor2Data = generateLayout("B");
    }

    const totalSeatCount = floor1Data.seatCount + (floor2Data?.seatCount || 0);

    return {
      floor1Layout: floor1Data.layout,
      floor2Layout: floor2Data?.layout || null,
      totalSeatCount,
    };
  }, [seatParams]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditMode ? "Chỉnh sửa thông tin xe" : "Thêm xe mới"}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {validationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError}
          </Alert>
        )}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              options={vehiclePresets}
              getOptionLabel={(option) => option.label}
              onChange={handlePresetChange}
              renderInput={(params) => (
                <TextField {...params} label="Chọn mẫu xe (Presets)" />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Loại xe (VD: Giường nằm 40 chỗ)"
              name="type"
              value={formData.type}
              onChange={handleTextFieldChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Biển số xe"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleTextFieldChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Trạng thái</InputLabel>
              <Select
                labelId="status-select-label"
                name="status"
                value={formData.status}
                label="Trạng thái"
                onChange={handleStatusChange}
              >
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="maintenance">Bảo trì</MenuItem>
                <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              multiline
              rows={2}
              value={formData.description}
              onChange={handleTextFieldChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Cấu hình sơ đồ ghế
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              label="Số tầng"
              type="number"
              value={seatParams.floors}
              onChange={(e) =>
                handleParamChange("floors", parseInt(e.target.value) || 1)
              }
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              label="Số cột ghế"
              type="number"
              value={seatParams.seatColumns}
              onChange={(e) =>
                handleParamChange("seatColumns", parseInt(e.target.value) || 1)
              }
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              label="Số hàng ghế"
              type="number"
              value={seatParams.seatRows}
              onChange={(e) =>
                handleParamChange("seatRows", parseInt(e.target.value) || 1)
              }
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Autocomplete
              multiple
              options={Array.from(
                { length: seatParams.seatColumns },
                (_, i) => i + 1
              )}
              value={seatParams.aislePositions}
              onChange={(_event, newValue) =>
                handleParamChange("aislePositions", newValue)
              }
              renderInput={(params) => (
                <TextField {...params} label="Vị trí lối đi" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={`Sau cột ${option}`}
                    {...getTagProps({ index })}
                  />
                ))
              }
              isOptionEqualToValue={(option, value) => option === value}
            />
          </Grid>
        </Grid>

        <Paper
          variant="outlined"
          sx={{ p: 2, mt: 2, backgroundColor: "grey.50" }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
            Xem trước (Tổng số ghế: {previewData.totalSeatCount})
          </Typography>

          {/* Tầng dưới */}
          <Typography variant="overline">Tầng dưới</Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${seatParams.seatColumns}, 1fr)`,
              gap: 1,
              overflowX: "auto",
              mb: seatParams.floors > 1 ? 2 : 0,
            }}
          >
            {previewData.floor1Layout.map((row, rowIndex) => (
              <React.Fragment key={`floor1-${rowIndex}`}>
                {row.map((seat, colIndex) => (
                  <Box
                    key={`floor1-${rowIndex}-${colIndex}`}
                    sx={{
                      p: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      textAlign: "center",
                      minWidth: "50px",
                      bgcolor: seat ? "success.light" : "transparent",
                    }}
                  >
                    <Typography variant="caption">{seat || "---"}</Typography>
                  </Box>
                ))}
              </React.Fragment>
            ))}
          </Box>

          {/* Tầng trên (nếu có) */}
          {previewData.floor2Layout && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="overline">Tầng trên</Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${seatParams.seatColumns}, 1fr)`,
                  gap: 1,
                  overflowX: "auto",
                }}
              >
                {previewData.floor2Layout.map((row, rowIndex) => (
                  <React.Fragment key={`floor2-${rowIndex}`}>
                    {row.map((seat, colIndex) => (
                      <Box
                        key={`floor2-${rowIndex}-${colIndex}`}
                        sx={{
                          p: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                          textAlign: "center",
                          minWidth: "50px",
                          bgcolor: seat ? "info.light" : "transparent",
                        }}
                      >
                        <Typography variant="caption">
                          {seat || "---"}
                        </Typography>
                      </Box>
                    ))}
                  </React.Fragment>
                ))}
              </Box>
            </>
          )}
        </Paper>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave} variant="contained">
          {isEditMode ? "Lưu thay đổi" : "Thêm xe"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVehicleDialog;
