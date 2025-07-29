import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CardContent,
  Divider,
  Avatar,
  Chip,
  Grid,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Download,
  Home,
  Event,
  Receipt,
  DirectionsBus,
  Phone,
  Email,
  Refresh,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

interface TripData {
  companyName: string;
  companyLogo: string;
  vehicleType: string;
  departureTime: string;
  arrivalTime: string;
  fromLocation: string;
  toLocation: string;
}

interface PassengerData {
  name: string;
  phone: string;
  seatNumber: string;
}

interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

interface PaymentStatusData {
  success: boolean;
  bookingId: string;
  tripData: TripData;
  passengers: PassengerData[];
  contactInfo: ContactInfo;
  totalAmount: number;
  paymentMethod: string;
}

const PaymentStatus: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const statusData = location.state as PaymentStatusData;
  
  if (!statusData) {
    navigate('/');
    return null;
  }

  const { success, bookingId, tripData, passengers, contactInfo, totalAmount, paymentMethod } = statusData;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const generateTicketCode = (bookingId: string) => {
    return `TK${bookingId.slice(-6).toUpperCase()}`;
  };

  const handleDownloadTicket = () => {
    // Mock download functionality
    const element = document.createElement('a');
    const file = new Blob(['Vé điện tử - ' + bookingId], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `ve-dien-tu-${bookingId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAddToCalendar = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Tomorrow
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    const eventTitle = `Chuyến xe ${tripData.fromLocation} - ${tripData.toLocation}`;
    const eventDetails = `Nhà xe: ${tripData.companyName}\nGiờ khởi hành: ${tripData.departureTime}\nMã vé: ${generateTicketCode(bookingId)}`;

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(eventDetails)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  if (success) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Success Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: 'success.main' }}>
            Thanh toán thành công!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Chúc mừng bạn đã đặt vé thành công!
          </Typography>
          <Chip
            label={`Mã đặt vé: ${bookingId}`}
            color="primary"
            sx={{ fontSize: '1rem', py: 2, px: 1, minHeight: 48 }}
          />
        </Box>

        <Grid container spacing={4}>
          {/* Ticket Information */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Receipt />
                  Thông tin vé điện tử
                </Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                {/* Trip Details */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      mr: 3,
                      width: 64,
                      height: 64,
                      background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                    }}
                  >
                    {tripData.companyLogo}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {tripData.companyName}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {tripData.vehicleType}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        06:00
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        TP. Hồ Chí Minh
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <Box sx={{ flex: 1, height: 2, bgcolor: 'primary.main', borderRadius: 1 }} />
                        <DirectionsBus sx={{ mx: 1, color: 'primary.main' }} />
                        <Box sx={{ flex: 1, height: 2, bgcolor: 'primary.main', borderRadius: 1 }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        10 giờ 30 phút
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        16:30
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Đà Lạt
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Passenger Details */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Thông tin hành khách
                </Typography>
                {passengers.map((passenger, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body2" color="text.secondary">Họ tên:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{passenger.name}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body2" color="text.secondary">Số ghế:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{passenger.seatNumber}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="body2" color="text.secondary">Điện thoại:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{passenger.phone}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}

                <Divider sx={{ my: 3 }} />

                {/* Contact Information */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Thông tin liên hệ
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body1">{contactInfo.phone}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body1">{contactInfo.email}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Payment Information */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Thông tin thanh toán
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">Tổng tiền:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {formatPrice(totalAmount)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">Phương thức:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {paymentMethod === 'vnpay' && 'VNPay'}
                      {paymentMethod === 'momo' && 'MoMo'}
                      {paymentMethod === 'banking' && 'Chuyển khoản ngân hàng'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Paper>
          </Grid>

          {/* Action Buttons */}
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
                  Hành động tiếp theo
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Mã vé điện tử
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                    {generateTicketCode(bookingId)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vui lòng lưu lại mã vé để check-in tại bến xe
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Download />}
                    onClick={handleDownloadTicket}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                    }}
                  >
                    Tải vé điện tử
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Event />}
                    onClick={handleAddToCalendar}
                    sx={{ py: 1.5 }}
                  >
                    Thêm vào lịch
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Receipt />}
                    onClick={() => navigate(`/bookings/${bookingId}`)}
                    sx={{ py: 1.5 }}
                  >
                    Xem chi tiết vé
                  </Button>

                  <Button
                    variant="text"
                    fullWidth
                    startIcon={<Home />}
                    onClick={() => navigate('/')}
                    sx={{ py: 1.5 }}
                  >
                    Về trang chủ
                  </Button>
                </Box>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  // Payment Failed
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Error sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: 'error.main' }}>
          Thanh toán không thành công
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Mã đặt vé: {bookingId}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Ghế của bạn vẫn đang được giữ trong thời gian ngắn. Bạn có thể thử lại thanh toán ngay bây giờ.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={() => navigate('/bookings/checkout', { state: statusData })}
              sx={{
                py: 1.5,
                px: 4,
                background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
              }}
            >
              Thử lại thanh toán
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Phone />}
              sx={{ py: 1.5, px: 4 }}
            >
              Liên hệ hỗ trợ
            </Button>
          </Box>
        </Paper>

        <Button
          variant="text"
          startIcon={<Home />}
          onClick={() => navigate('/')}
        >
          Về trang chủ
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentStatus; 