import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  DirectionsBus,
  Schedule,
  LocationOn,
  MoreVert,
  Visibility,
  Cancel,
  Download,
  QrCode,
  CheckCircle,
  Timer,
  Block,
  History,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/common/NotificationProvider';

interface Booking {
  id: string;
  ticketCode: string;
  status: 'confirmed' | 'held' | 'cancelled' | 'expired' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  bookingTime: string;
  totalAmount: number;
  trip: {
    id: string;
    companyName: string;
    companyLogo: string;
    vehicleType: string;
    departureTime: string;
    arrivalTime: string;
    fromLocation: string;
    toLocation: string;
    departureDate: string;
  };
  seats: Array<{
    seatNumber: string;
    passengerName: string;
  }>;
}

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [activeTab, setActiveTab] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Mock bookings data
  const mockBookings: Booking[] = [
    {
      id: 'BK1735279234567',
      ticketCode: 'TK234567',
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingTime: '2024-12-27 15:30:00',
      totalAmount: 360000,
      trip: {
        id: '1',
        companyName: 'Phương Trang',
        companyLogo: 'PT',
        vehicleType: 'Giường nằm 40 chỗ',
        departureTime: '08:00',
        arrivalTime: '14:00',
        fromLocation: 'Bến xe Miền Đông, HCM',
        toLocation: 'Bến xe Đà Lạt',
        departureDate: '2024-12-28',
      },
      seats: [
        { seatNumber: 'A1', passengerName: 'Nguyễn Văn A' },
        { seatNumber: 'A2', passengerName: 'Trần Thị B' },
      ],
    },
    {
      id: 'BK1735279234568',
      ticketCode: 'TK234568',
      status: 'completed',
      paymentStatus: 'paid',
      bookingTime: '2024-12-20 10:15:00',
      totalAmount: 180000,
      trip: {
        id: '2',
        companyName: 'Thanh Bưởi',
        companyLogo: 'TB',
        vehicleType: 'Limousine 24 chỗ',
        departureTime: '09:30',
        arrivalTime: '15:30',
        fromLocation: 'Bến xe Miền Đông, HCM',
        toLocation: 'Bến xe Đà Lạt',
        departureDate: '2024-12-22',
      },
      seats: [
        { seatNumber: 'B1', passengerName: 'Nguyễn Văn A' },
      ],
    },
    {
      id: 'BK1735279234569',
      ticketCode: 'TK234569',
      status: 'cancelled',
      paymentStatus: 'refunded',
      bookingTime: '2024-12-25 14:20:00',
      totalAmount: 220000,
      trip: {
        id: '3',
        companyName: 'Mai Linh',
        companyLogo: 'ML',
        vehicleType: 'Ghế ngồi 45 chỗ',
        departureTime: '10:00',
        arrivalTime: '16:00',
        fromLocation: 'Bến xe Miền Tây, HCM',
        toLocation: 'Bến xe An Sương',
        departureDate: '2024-12-26',
      },
      seats: [
        { seatNumber: 'C5', passengerName: 'Nguyễn Văn A' },
      ],
    },
  ];

  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const getFilteredBookings = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(booking => 
          booking.trip.departureDate >= today && 
          ['confirmed', 'held'].includes(booking.status)
        );
      case 'completed':
        return bookings.filter(booking => 
          booking.trip.departureDate < today || 
          booking.status === 'completed'
        );
      case 'cancelled':
        return bookings.filter(booking => 
          ['cancelled', 'expired'].includes(booking.status)
        );
      default:
        return bookings;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'held':
        return 'warning';
      case 'cancelled':
      case 'expired':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'held':
        return 'Đang giữ chỗ';
      case 'cancelled':
        return 'Đã hủy';
      case 'expired':
        return 'Hết hạn';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('vi-VN');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, booking: Booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleViewDetails = () => {
    if (selectedBooking) {
      navigate(`/bookings/${selectedBooking.id}`);
    }
    handleMenuClose();
  };

  const handleDownloadTicket = () => {
    if (selectedBooking) {
      // Mock download functionality
      const element = document.createElement('a');
      const file = new Blob([`Vé điện tử - ${selectedBooking.ticketCode}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `ve-dien-tu-${selectedBooking.ticketCode}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      showNotification('Đã tải vé điện tử thành công', 'success');
    }
    handleMenuClose();
  };

  const handleCancelBooking = () => {
    setCancelDialogOpen(true);
    handleMenuClose();
  };

  const confirmCancelBooking = () => {
    if (selectedBooking) {
      setBookings(prev => prev.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: 'cancelled' as const, paymentStatus: 'refunded' as const }
          : booking
      ));
      showNotification('Đã hủy vé thành công. Tiền sẽ được hoàn trả trong 3-5 ngày làm việc.', 'success');
    }
    setCancelDialogOpen(false);
    setSelectedBooking(null);
  };

  const canCancelBooking = (booking: Booking) => {
    const departureDate = new Date(booking.trip.departureDate);
    const now = new Date();
    const timeDiff = departureDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return booking.status === 'confirmed' && hoursDiff > 24; // Can cancel if more than 24 hours before departure
  };

  const filteredBookings = getFilteredBookings();

  if (bookings.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center' }}>
          <DirectionsBus sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Chưa có chuyến đi nào
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Bạn chưa đặt vé xe khách nào. Hãy tìm kiếm và đặt chuyến đi đầu tiên của bạn!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              py: 2,
              px: 4,
              background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
            }}
          >
            Đặt vé ngay
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Chuyến xe của tôi
      </Typography>

      {/* Filter Tabs */}
      <Paper elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              py: 2,
            },
          }}
        >
          <Tab
            icon={<History />}
            iconPosition="start"
            label={`Tất cả (${bookings.length})`}
            value="all"
          />
          <Tab
            icon={<Timer />}
            iconPosition="start"
            label={`Sắp đi (${bookings.filter(b => b.trip.departureDate >= new Date().toISOString().split('T')[0] && ['confirmed', 'held'].includes(b.status)).length})`}
            value="upcoming"
          />
          <Tab
            icon={<CheckCircle />}
            iconPosition="start"
            label={`Đã đi (${bookings.filter(b => b.trip.departureDate < new Date().toISOString().split('T')[0] || b.status === 'completed').length})`}
            value="completed"
          />
          <Tab
            icon={<Block />}
            iconPosition="start"
            label={`Đã hủy (${bookings.filter(b => ['cancelled', 'expired'].includes(b.status)).length})`}
            value="cancelled"
          />
        </Tabs>
      </Paper>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary">
            Không có chuyến đi nào trong danh mục này
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredBookings.map((booking) => (
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                key={booking.id}
                sx={{
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 119, 190, 0.15)',
                  },
                  border: '1px solid rgba(0, 119, 190, 0.1)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            mr: 2,
                            width: 48,
                            height: 48,
                            background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                          }}
                        >
                          {booking.trip.companyLogo}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {booking.trip.companyName}
                            </Typography>
                            <Chip
                              label={getStatusText(booking.status)}
                              color={getStatusColor(booking.status) as any}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {booking.trip.vehicleType} • Mã vé: {booking.ticketCode}
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, booking)}
                          sx={{ ml: 'auto' }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {booking.trip.departureTime}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {booking.trip.fromLocation}
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
                              {booking.trip.departureDate}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {booking.trip.arrivalTime}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {booking.trip.toLocation}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {booking.seats.map((seat) => (
                          <Chip
                            key={seat.seatNumber}
                            label={`${seat.seatNumber} - ${seat.passengerName}`}
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                          {formatPrice(booking.totalAmount)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Đặt lúc: {formatDateTime(booking.bookingTime)}
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => navigate(`/bookings/${booking.id}`)}
                          sx={{
                            background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                            mb: 1,
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleViewDetails}>
          <Visibility sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleDownloadTicket}>
          <Download sx={{ mr: 1 }} />
          Tải vé điện tử
        </MenuItem>
        {selectedBooking && canCancelBooking(selectedBooking) && (
          <MenuItem onClick={handleCancelBooking} sx={{ color: 'error.main' }}>
            <Cancel sx={{ mr: 1 }} />
            Hủy vé
          </MenuItem>
        )}
      </Menu>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Xác nhận hủy vé</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn hủy vé này không? Hành động này không thể hoàn tác.
          </Alert>
          {selectedBooking && (
            <Typography>
              Mã vé: <strong>{selectedBooking.ticketCode}</strong><br />
              Chuyến: <strong>{selectedBooking.trip.fromLocation} → {selectedBooking.trip.toLocation}</strong><br />
              Ngày đi: <strong>{selectedBooking.trip.departureDate}</strong><br />
              Số tiền hoàn trả: <strong>{formatPrice(selectedBooking.totalAmount * 0.8)}</strong>
              <Typography variant="caption" display="block" color="text.secondary">
                (Phí hủy vé: 20% tổng giá trị)
              </Typography>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Không hủy
          </Button>
          <Button onClick={confirmCancelBooking} color="error" variant="contained">
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyBookings; 