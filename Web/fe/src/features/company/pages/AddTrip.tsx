import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Checkbox,
  Chip,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Autocomplete,
} from "@mui/material";
import {
  DirectionsBus,
  LocationOn,
  Schedule,
  AttachMoney,
  Add,
  Delete,
  Route,
  EventSeat,
  AccessTime,
  CalendarToday,
  Save,
  Preview,
} from "@mui/icons-material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../components/common/NotificationProvider";

interface RouteStop {
  id: string;
  city: string;
  location: string;
  arrivalTime: Dayjs | null;
  departureTime: Dayjs | null;
  isTerminal: boolean;
  stopDuration: number; // minutes
}

interface TripData {
  // Basic Info
  tripName: string;
  fromCity: string;
  toCity: string;

  // Vehicle Info
  vehicleType: "Giường nằm" | "Ghế ngồi";
  vehicleNumber: string;
  seatCount: number;

  // Schedule
  departureDate: Dayjs | null;
  departureTime: Dayjs | null;
  arrivalTime: Dayjs | null;
  duration: string;
  frequency: "daily" | "weekly" | "custom";
  operatingDays: string[];

  // Pricing
  basePrice: number;
  discountPrice?: number;

  // Route Details
  routeStops: RouteStop[];

  // Services
  amenities: string[];

  // Status
  status: "active" | "inactive";
}

const AddTrip: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [tripData, setTripData] = useState<TripData>({
    tripName: "",
    fromCity: "",
    toCity: "",
    vehicleType: "Ghế ngồi",
    vehicleNumber: "",
    seatCount: 45,
    departureDate: null,
    departureTime: null,
    arrivalTime: null,
    duration: "",
    frequency: "daily",
    operatingDays: [],
    basePrice: 0,
    discountPrice: 0,
    routeStops: [],
    amenities: [],
    status: "active",
  });

  const steps = [
    "Thông tin cơ bản",
    "Thông tin xe",
    "Lịch trình & Tuyến đường",
    "Giá vé & Dịch vụ",
    "Xem trước & Lưu",
  ];

  const vietnamCities = [
    "TP. Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Cần Thơ",
    "Hải Phòng",
    "Nha Trang",
    "Đà Lạt",
    "Vũng Tàu",
    "Huế",
    "Hội An",
    "Quy Nhon",
    "Phan Thiết",
    "Mũi Né",
    "Phú Quốc",
    "Sapa",
    "Hạ Long",
    "Ninh Bình",
    "Tam Cốc",
    "Cao Bằng",
    "Buôn Ma Thuột",
    "Pleiku",
    "Kon Tum",
    "An Giang",
    "Cà Mau",
    "Rạch Giá",
  ];

  const availableAmenities = [
    "WiFi miễn phí",
    "Điều hòa",
    "Nước uống",
    "Chăn gối",
    "TV giải trí",
    "Sạc điện thoại",
    "Toilet trên xe",
    "Massage",
    "Bảo hiểm hành khách",
    "Đón tận nơi",
  ];

  const daysOfWeek = [
    { value: "monday", label: "Thứ 2" },
    { value: "tuesday", label: "Thứ 3" },
    { value: "wednesday", label: "Thứ 4" },
    { value: "thursday", label: "Thứ 5" },
    { value: "friday", label: "Thứ 6" },
    { value: "saturday", label: "Thứ 7" },
    { value: "sunday", label: "Chủ nhật" },
  ];

  const handleInputChange =
    (field: keyof TripData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTripData({ ...tripData, [field]: e.target.value });
    };

  const handleSelectChange = (field: keyof TripData) => (e: any) => {
    setTripData({ ...tripData, [field]: e.target.value });
  };

  const handleDateTimeChange =
    (field: keyof TripData) => (value: Dayjs | null) => {
      setTripData({ ...tripData, [field]: value });

      // Auto calculate duration if both times are set
      if (field === "arrivalTime" || field === "departureTime") {
        const depTime =
          field === "departureTime" ? value : tripData.departureTime;
        const arrTime = field === "arrivalTime" ? value : tripData.arrivalTime;

        if (depTime && arrTime) {
          const diffHours = arrTime.diff(depTime, "hour");
          const diffMinutes = arrTime.diff(depTime, "minute") % 60;
          setTripData((prev) => ({
            ...prev,
            duration: `${diffHours}h ${
              diffMinutes > 0 ? diffMinutes + "m" : ""
            }`,
          }));
        }
      }
    };

  const handleAmenityToggle = (amenity: string) => {
    const updatedAmenities = tripData.amenities.includes(amenity)
      ? tripData.amenities.filter((a) => a !== amenity)
      : [...tripData.amenities, amenity];
    setTripData({ ...tripData, amenities: updatedAmenities });
  };

  const handleDayToggle = (day: string) => {
    const updatedDays = tripData.operatingDays.includes(day)
      ? tripData.operatingDays.filter((d) => d !== day)
      : [...tripData.operatingDays, day];
    setTripData({ ...tripData, operatingDays: updatedDays });
  };

  const addRouteStop = () => {
    const newStop: RouteStop = {
      id: `stop-${Date.now()}`,
      city: "",
      location: "",
      arrivalTime: null,
      departureTime: null,
      isTerminal: tripData.routeStops.length === 0,
      stopDuration: 10,
    };
    setTripData({
      ...tripData,
      routeStops: [...tripData.routeStops, newStop],
    });
  };

  const updateRouteStop = (
    stopId: string,
    field: keyof RouteStop,
    value: any
  ) => {
    const updatedStops = tripData.routeStops.map((stop) =>
      stop.id === stopId ? { ...stop, [field]: value } : stop
    );
    setTripData({ ...tripData, routeStops: updatedStops });
  };

  const removeRouteStop = (stopId: string) => {
    const updatedStops = tripData.routeStops.filter(
      (stop) => stop.id !== stopId
    );
    setTripData({ ...tripData, routeStops: updatedStops });
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!tripData.tripName || !tripData.fromCity || !tripData.toCity) {
          showNotification("Vui lòng điền đầy đủ thông tin cơ bản", "error");
          return false;
        }
        break;
      case 1:
        if (!tripData.vehicleNumber || tripData.seatCount <= 0) {
          showNotification("Vui lòng điền đầy đủ thông tin xe", "error");
          return false;
        }
        break;
      case 2:
        if (!tripData.departureTime || !tripData.arrivalTime) {
          showNotification("Vui lòng chọn thời gian khởi hành và đến", "error");
          return false;
        }
        break;
      case 3:
        if (tripData.basePrice <= 0) {
          showNotification("Vui lòng nhập giá vé hợp lệ", "error");
          return false;
        }
        break;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateStep(activeStep)) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showNotification("Thêm chuyến xe thành công!", "success");
      navigate("/trips");
    } catch (error) {
      console.error("Save error:", error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Tên chuyến xe"
                value={tripData.tripName}
                onChange={handleInputChange("tripName")}
                placeholder="VD: HCM - Đà Lạt Express"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                fullWidth
                options={vietnamCities}
                value={tripData.fromCity}
                onChange={(e, value) =>
                  setTripData({ ...tripData, fromCity: value || "" })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Điểm khởi hành" required />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                fullWidth
                options={vietnamCities}
                value={tripData.toCity}
                onChange={(e, value) =>
                  setTripData({ ...tripData, toCity: value || "" })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Điểm đến" required />
                )}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Loại xe</InputLabel>
                <Select
                  value={tripData.vehicleType}
                  onChange={handleSelectChange("vehicleType")}
                  label="Loại xe"
                >
                  <MenuItem value="Ghế ngồi">Ghế ngồi</MenuItem>
                  <MenuItem value="Giường nằm">Giường nằm</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Biển số xe"
                value={tripData.vehicleNumber}
                onChange={handleInputChange("vehicleNumber")}
                placeholder="VD: 79B-12345"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Số ghế"
                value={tripData.seatCount}
                onChange={handleInputChange("seatCount")}
                inputProps={{ min: 1, max: 50 }}
                required
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <DatePicker
                  label="Ngày khởi hành"
                  value={tripData.departureDate}
                  onChange={handleDateTimeChange("departureDate")}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TimePicker
                  label="Giờ khởi hành"
                  value={tripData.departureTime}
                  onChange={handleDateTimeChange("departureTime")}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TimePicker
                  label="Giờ đến"
                  value={tripData.arrivalTime}
                  onChange={handleDateTimeChange("arrivalTime")}
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Tần suất hoạt động
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Tần suất</InputLabel>
                  <Select
                    value={tripData.frequency}
                    onChange={handleSelectChange("frequency")}
                    label="Tần suất"
                  >
                    <MenuItem value="daily">Hàng ngày</MenuItem>
                    <MenuItem value="weekly">Hàng tuần</MenuItem>
                    <MenuItem value="custom">Tùy chỉnh</MenuItem>
                  </Select>
                </FormControl>

                {tripData.frequency !== "daily" && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Ngày hoạt động:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {daysOfWeek.map((day) => (
                        <FormControlLabel
                          key={day.value}
                          control={
                            <Checkbox
                              checked={tripData.operatingDays.includes(
                                day.value
                              )}
                              onChange={() => handleDayToggle(day.value)}
                            />
                          }
                          label={day.label}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Trạm dừng trung gian</Typography>
                  <Button
                    startIcon={<Add />}
                    onClick={addRouteStop}
                    variant="outlined"
                  >
                    Thêm trạm dừng
                  </Button>
                </Box>

                {tripData.routeStops.map((stop, index) => (
                  <Card key={stop.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle1">
                          Trạm dừng {index + 1}
                        </Typography>
                        <IconButton
                          onClick={() => removeRouteStop(stop.id)}
                          color="error"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Autocomplete
                            fullWidth
                            options={vietnamCities}
                            value={stop.city}
                            onChange={(e, value) =>
                              updateRouteStop(stop.id, "city", value || "")
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Thành phố"
                                size="small"
                              />
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Vị trí cụ thể"
                            value={stop.location}
                            onChange={(e) =>
                              updateRouteStop(
                                stop.id,
                                "location",
                                e.target.value
                              )
                            }
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TimePicker
                            label="Giờ đến"
                            value={stop.arrivalTime}
                            onChange={(value) =>
                              updateRouteStop(stop.id, "arrivalTime", value)
                            }
                            sx={{ width: "100%" }}
                            slotProps={{ textField: { size: "small" } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TimePicker
                            label="Giờ khởi hành"
                            value={stop.departureTime}
                            onChange={(value) =>
                              updateRouteStop(stop.id, "departureTime", value)
                            }
                            sx={{ width: "100%" }}
                            slotProps={{ textField: { size: "small" } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Thời gian dừng (phút)"
                            value={stop.stopDuration}
                            onChange={(e) =>
                              updateRouteStop(
                                stop.id,
                                "stopDuration",
                                parseInt(e.target.value)
                              )
                            }
                            size="small"
                            inputProps={{ min: 1, max: 60 }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Grid>
          </LocalizationProvider>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Giá vé cơ bản (VNĐ)"
                value={tripData.basePrice}
                onChange={handleInputChange("basePrice")}
                inputProps={{ min: 0, step: 1000 }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Giá khuyến mãi (VNĐ)"
                value={tripData.discountPrice}
                onChange={handleInputChange("discountPrice")}
                inputProps={{ min: 0, step: 1000 }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tiện ích & Dịch vụ
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {availableAmenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    color={
                      tripData.amenities.includes(amenity)
                        ? "primary"
                        : "default"
                    }
                    variant={
                      tripData.amenities.includes(amenity)
                        ? "filled"
                        : "outlined"
                    }
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Xem trước thông tin chuyến xe
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Thông tin chuyến
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>{tripData.tripName}</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {tripData.fromCity} → {tripData.toCity}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">
                    Xe & Ghế
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {tripData.vehicleType} - {tripData.vehicleNumber} (
                    {tripData.seatCount} ghế)
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">
                    Thời gian
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {tripData.departureTime?.format("HH:mm")} -{" "}
                    {tripData.arrivalTime?.format("HH:mm")} ({tripData.duration}
                    )
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Giá vé
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    {formatPrice(tripData.basePrice)}
                  </Typography>
                  {tripData.discountPrice && tripData.discountPrice > 0 && (
                    <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                      Khuyến mãi: {formatPrice(tripData.discountPrice)}
                    </Typography>
                  )}

                  <Typography variant="subtitle2" color="text.secondary">
                    Tiện ích
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}
                  >
                    {tripData.amenities.map((amenity) => (
                      <Chip key={amenity} label={amenity} size="small" />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" color="text.secondary">
                    Trạm dừng
                  </Typography>
                  <Typography variant="body2">
                    {tripData.routeStops.length} trạm dừng trung gian
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {/* Header */}
        <Box
          sx={{
            p: 4,
            background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
            color: "white",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Thêm chuyến xe mới
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Tạo chuyến xe mới để phục vụ hành khách
          </Typography>
        </Box>

        {/* Stepper */}
        <Box sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ mt: 2, mb: 4 }}>{renderStepContent(index)}</Box>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      variant="outlined"
                    >
                      Quay lại
                    </Button>

                    {index === steps.length - 1 ? (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Preview />}
                          onClick={() => setShowPreview(true)}
                        >
                          Xem trước
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Save />}
                          onClick={handleSave}
                          disabled={loading}
                        >
                          {loading ? "Đang lưu..." : "Lưu chuyến xe"}
                        </Button>
                      </Box>
                    ) : (
                      <Button variant="contained" onClick={handleNext}>
                        Tiếp tục
                      </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Xem trước chuyến xe
          </Typography>
        </DialogTitle>
        <DialogContent dividers>{renderStepContent(4)}</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Đóng</Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => {
              setShowPreview(false);
              handleSave();
            }}
            disabled={loading}
          >
            Lưu chuyến xe
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddTrip;
