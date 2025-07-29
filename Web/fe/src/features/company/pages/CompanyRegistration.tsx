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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Chip,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Checkbox,
  LinearProgress,
} from "@mui/material";
import {
  Business,
  Description,
  Verified,
  Upload,
  Phone,
  Email,
  LocationOn,
  DirectionsBus,
  CheckCircle,
  Schedule,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../components/common/NotificationProvider";

interface CompanyRegistrationData {
  companyName: string;
  businessLicense: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  website: string;
  description: string;
  operatingRoutes: string[];
  vehicleCount: number;
  services: string[];
  documents: {
    businessLicense: File | null;
    vehicleRegistration: File | null;
    insurance: File | null;
    driverLicenses: File | null;
  };
}

const CompanyRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CompanyRegistrationData>({
    companyName: "",
    businessLicense: "",
    taxId: "",
    address: "",
    phone: "",
    email: "",
    contactPerson: "",
    website: "",
    description: "",
    operatingRoutes: [],
    vehicleCount: 0,
    services: [],
    documents: {
      businessLicense: null,
      vehicleRegistration: null,
      insurance: null,
      driverLicenses: null,
    },
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const steps = [
    "Thông tin công ty",
    "Giấy phép và chứng chỉ",
    "Thông tin vận hành",
    "Xác nhận và gửi đăng ký",
  ];

  const provinces = [
    "TP. Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Cần Thơ",
    "Hải Phòng",
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bạc Liêu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cao Bằng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Tĩnh",
    "Hải Dương",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];

  const availableServices = [
    "WiFi miễn phí",
    "Điều hòa",
    "Nước uống",
    "Chăn gối",
    "Massage",
    "TV giải trí",
    "Sạc điện thoại",
    "Toilet trên xe",
    "Dịch vụ đón tận nơi",
    "Bảo hiểm hành khách",
  ];

  const handleInputChange =
    (field: keyof CompanyRegistrationData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleFileUpload =
    (field: keyof CompanyRegistrationData["documents"]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFormData({
        ...formData,
        documents: { ...formData.documents, [field]: file },
      });
    };

  const handleServiceToggle = (service: string) => {
    const updatedServices = formData.services.includes(service)
      ? formData.services.filter((s) => s !== service)
      : [...formData.services, service];
    setFormData({ ...formData, services: updatedServices });
  };

  const handleRouteAdd = (route: string) => {
    if (route && !formData.operatingRoutes.includes(route)) {
      setFormData({
        ...formData,
        operatingRoutes: [...formData.operatingRoutes, route],
      });
    }
  };

  const handleRouteRemove = (route: string) => {
    setFormData({
      ...formData,
      operatingRoutes: formData.operatingRoutes.filter((r) => r !== route),
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      showNotification("Vui lòng đồng ý với điều khoản và điều kiện", "error");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showNotification(
        "Đăng ký thành công! Đơn đăng ký của bạn đang được xem xét.",
        "success"
      );
      navigate("/company-registration-success", {
        state: {
          registrationId: "REG" + Date.now(),
          companyName: formData.companyName,
          email: formData.email,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return (
          formData.companyName &&
          formData.businessLicense &&
          formData.taxId &&
          formData.address &&
          formData.phone &&
          formData.email &&
          formData.contactPerson
        );
      case 1:
        return (
          formData.documents.businessLicense &&
          formData.documents.vehicleRegistration &&
          formData.documents.insurance
        );
      case 2:
        return formData.operatingRoutes.length > 0 && formData.vehicleCount > 0;
      case 3:
        return acceptedTerms;
      default:
        return false;
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tên công ty *"
                value={formData.companyName}
                onChange={handleInputChange("companyName")}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Số giấy phép kinh doanh *"
                value={formData.businessLicense}
                onChange={handleInputChange("businessLicense")}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Mã số thuế *"
                value={formData.taxId}
                onChange={handleInputChange("taxId")}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Người liên hệ *"
                value={formData.contactPerson}
                onChange={handleInputChange("contactPerson")}
                required
                InputProps={{
                  startAdornment: (
                    <Business sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Địa chỉ trụ sở chính *"
                value={formData.address}
                onChange={handleInputChange("address")}
                required
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <LocationOn sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Số điện thoại *"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                required
                InputProps={{
                  startAdornment: (
                    <Phone sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                required
                InputProps={{
                  startAdornment: (
                    <Email sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Website (nếu có)"
                value={formData.website}
                onChange={handleInputChange("website")}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Mô tả về công ty"
                value={formData.description}
                onChange={handleInputChange("description")}
                multiline
                rows={3}
                placeholder="Giới thiệu về lịch sử, kinh nghiệm và dịch vụ của công ty..."
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Vui lòng tải lên các giấy tờ cần thiết. Tất cả tệp phải có định
                dạng PDF, JPG hoặc PNG và không quá 5MB.
              </Alert>
            </Grid>

            {Object.entries({
              businessLicense: "Giấy phép kinh doanh",
              vehicleRegistration: "Giấy đăng ký xe",
              insurance: "Giấy chứng nhận bảo hiểm",
              driverLicenses: "Bằng lái xe của tài xế",
            }).map(([key, label]) => (
              <Grid size={{ xs: 12, md: 6 }} key={key}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {label} {key !== "driverLicenses" && "*"}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload(
                        key as keyof CompanyRegistrationData["documents"]
                      )}
                      style={{ display: "none" }}
                      id={`file-${key}`}
                    />
                    <label htmlFor={`file-${key}`}>
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<Upload />}
                        fullWidth
                      >
                        Chọn tệp
                      </Button>
                    </label>
                    {formData.documents[
                      key as keyof CompanyRegistrationData["documents"]
                    ] && (
                      <Box
                        sx={{
                          mt: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CheckCircle color="success" fontSize="small" />
                        <Typography variant="caption" color="success.main">
                          {
                            formData.documents[
                              key as keyof CompanyRegistrationData["documents"]
                            ]?.name
                          }
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Số lượng xe *"
                type="number"
                value={formData.vehicleCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehicleCount: parseInt(e.target.value) || 0,
                  })
                }
                required
                inputProps={{ min: 1 }}
                InputProps={{
                  startAdornment: (
                    <DirectionsBus sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tuyến đường vận hành *
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Chọn tuyến đường</InputLabel>
                <Select
                  value=""
                  onChange={(e) => handleRouteAdd(e.target.value)}
                >
                  {provinces.map((province) => (
                    <MenuItem key={province} value={province}>
                      {province}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.operatingRoutes.map((route) => (
                  <Chip
                    key={route}
                    label={route}
                    onDelete={() => handleRouteRemove(route)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" gutterBottom>
                Dịch vụ cung cấp
              </Typography>
              <Grid container spacing={1}>
                {availableServices.map((service) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceToggle(service)}
                        />
                      }
                      label={service}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Xác nhận thông tin đăng ký
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      color="primary"
                    >
                      Thông tin công ty
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tên công ty:</strong> {formData.companyName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Giấy phép:</strong> {formData.businessLicense}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Mã số thuế:</strong> {formData.taxId}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Người liên hệ:</strong> {formData.contactPerson}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {formData.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Điện thoại:</strong> {formData.phone}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      color="primary"
                    >
                      Thông tin vận hành
                    </Typography>
                    <Typography variant="body2">
                      <strong>Số lượng xe:</strong> {formData.vehicleCount}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tuyến đường:</strong>{" "}
                      {formData.operatingRoutes.length} tuyến
                    </Typography>
                    <Typography variant="body2">
                      <strong>Dịch vụ:</strong> {formData.services.length} dịch
                      vụ
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Lưu ý:</strong> Sau khi gửi đăng ký, đơn của bạn sẽ được
                xem xét bởi bộ phận quản trị trong vòng 3-5 ngày làm việc. Chúng
                tôi sẽ liên hệ với bạn qua email để thông báo kết quả.
              </Typography>
            </Alert>

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2">
                  Tôi đồng ý với{" "}
                  <Button
                    variant="text"
                    size="small"
                    sx={{ textDecoration: "underline" }}
                  >
                    điều khoản và điều kiện
                  </Button>{" "}
                  của dịch vụ
                </Typography>
              }
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
            color: "white",
            p: 4,
            textAlign: "center",
          }}
        >
          <Business sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Đăng ký nhà xe
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Trở thành đối tác vận chuyển của chúng tôi
          </Typography>
        </Box>

        {/* Progress */}
        <Box sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} orientation="horizontal">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {loading && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
                Đang xử lý đăng ký...
              </Typography>
            </Box>
          )}

          {/* Step Content */}
          <Box sx={{ mt: 4 }}>{renderStepContent(activeStep)}</Box>

          {/* Navigation */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Quay lại
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!isStepValid(activeStep) || loading}
                sx={{
                  background:
                    "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                  px: 4,
                }}
              >
                Gửi đăng ký
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid(activeStep)}
                sx={{
                  background:
                    "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                }}
              >
                Tiếp tục
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CompanyRegistration;
