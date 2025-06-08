import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Divider,
  Avatar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  DirectionsBus,
  Person,
  Phone,
  Payment,
  Schedule,
  LocationOn,
  Timer,
  ExpandMore,
  CreditCard,
  AccountBalance,
  QrCode,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotification } from '../components/common/NotificationProvider';

interface PassengerInfo {
  name: string;
  phone: string;
  seatNumber: string;
}

interface BookingData {
  tripId: string;
  selectedSeats: string[];
  totalPrice: number;
}

const BookingCheckout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const bookingData = location.state as BookingData;
  
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [holdTimer, setHoldTimer] = useState<number>(15 * 60); // 15 minutes
  const [loading, setLoading] = useState(false);

  // Mock trip data
  const mockTrip = {
    id: bookingData?.tripId || '1',
    companyName: 'Phương Trang',
    companyLogo: 'PT',
    vehicleType: 'Giường nằm 40 chỗ',
    departureTime: '08:00',
    arrivalTime: '14:00',
    fromLocation: 'Bến xe Miền Đông, HCM',
    toLocation: 'Bến xe Đà Lạt',
    price: 180000,
  };

  const mockSeats = [
    { id: 'seat-1', seatNumber: 'A1' },
    { id: 'seat-2', seatNumber: 'A2' },
    { id: 'seat-3', seatNumber: 'B1' },
  ];

  const steps = ['Chọn ghế', 'Thông tin hành khách', 'Thanh toán'];
  const activeStep = 1;

  useEffect(() => {
    if (!bookingData) {
      navigate('/');
      return;
    }

    // Initialize passengers array based on selected seats
    const initialPassengers = bookingData.selectedSeats.map((seatId) => {
      const seat = mockSeats.find(s => s.id === seatId);
      return {
        name: '',
        phone: '',
        seatNumber: seat?.seatNumber || '',
      };
    });
    setPassengers(initialPassengers);
  }, [bookingData, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHoldTimer((prev) => {
        if (prev <= 1) {
          showNotification('Hết thời gian giữ ghế. Vui lòng chọn lại ghế.', 'warning');
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, showNotification]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePassengerChange = (index: number, field: string, value: string) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const isFormValid = () => {
    const passengersValid = passengers.every(p => p.name.trim() && p.phone.trim());
    const contactValid = contactInfo.name.trim() && contactInfo.phone.trim() && contactInfo.email.trim();
    return passengersValid && contactValid && paymentMethod;
  };

  const handlePayment = async () => {
    if (!isFormValid()) {
      showNotification('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to payment status page
      navigate('/payment/status', {
        state: {
          success: true,
          bookingId: 'BK' + Date.now(),
          tripData: mockTrip,
          passengers,
          contactInfo,
          totalAmount: bookingData?.totalPrice || 0,
          paymentMethod,
        }
      });
    } catch (error) {
      showNotification('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const paymentMethods = [
    {
      value: 'vnpay',
      label: 'VNPay',
      icon: <CreditCard />,
      description: 'Thanh toán qua thẻ ATM, Visa, Master Card'
    },
    {
      value: 'momo',
      label: 'MoMo',
      icon: <QrCode />,
      description: 'Thanh toán qua ví điện tử MoMo'
    },
    {
      value: 'banking',
      label: 'Chuyển khoản ngân hàng',
      icon: <AccountBalance />,
      description: 'Chuyển khoản qua Internet Banking'
    },
  ];

  if (!bookingData) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Progress Stepper */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Grid container spacing={4}>
        {/* Left Column - Forms */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Timer Alert */}
          <Alert severity="warning" sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timer />
              <Typography variant="body2">
                Thời gian giữ ghế: <strong>{formatTime(holdTimer)}</strong>. 
                Vui lòng hoàn tất thanh toán trước khi hết thời gian.
              </Typography>
            </Box>
          </Alert>

          {/* Passenger Information */}
          <Paper elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person />
                Thông tin hành khách
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              {passengers.map((passenger, index) => (
                <Accordion key={index} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Hành khách {index + 1} - Ghế {passenger.seatNumber}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Họ và tên"
                          fullWidth
                          value={passenger.name}
                          onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Số điện thoại"
                          fullWidth
                          value={passenger.phone}
                          onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>

          {/* Contact Information */}
          <Paper elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone />
                Thông tin liên hệ
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Thông tin người đặt vé (nhận vé và liên lạc)
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Tên liên hệ"
                    fullWidth
                    required
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Số điện thoại"
                    fullWidth
                    required
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Payment Methods */}
          <Paper elevation={3} sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Payment />
                Phương thức thanh toán
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {paymentMethods.map((method) => (
                    <Paper
                      key={method.value}
                      variant="outlined"
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        borderColor: paymentMethod === method.value ? 'primary.main' : 'divider',
                        bgcolor: paymentMethod === method.value ? 'primary.50' : 'transparent',
                      }}
                    >
                      <FormControlLabel
                        value={method.value}
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Box sx={{ color: 'primary.main' }}>
                              {method.icon}
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {method.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {method.description}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Booking Summary */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              position: 'sticky',
              top: 20,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)',
            }}
          >
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Tóm tắt đặt vé
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              {/* Trip Summary */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    mr: 2,
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                  }}
                >
                  {mockTrip.companyLogo}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {mockTrip.companyName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mockTrip.vehicleType}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {mockTrip.fromLocation} → {mockTrip.toLocation}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {mockTrip.departureTime} - {mockTrip.arrivalTime}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Selected Seats */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Ghế đã chọn
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {bookingData.selectedSeats.map((seatId) => {
                    const seat = mockSeats.find(s => s.id === seatId);
                    return (
                      <Chip
                        key={seatId}
                        label={seat?.seatNumber}
                        color="primary"
                        variant="outlined"
                      />
                    );
                  })}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Số ghế: {bookingData.selectedSeats.length}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Price Breakdown */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">
                    Giá vé ({bookingData.selectedSeats.length} ghế)
                  </Typography>
                  <Typography variant="body1">
                    {formatPrice(bookingData.totalPrice)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Phí dịch vụ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Miễn phí
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Tổng cộng
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formatPrice(bookingData.totalPrice)}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={!isFormValid() || loading}
                onClick={handlePayment}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #004c8b 0%, #003366 100%)',
                  },
                  '&:disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                  }
                }}
              >
                {loading ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
              </Button>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingCheckout; 