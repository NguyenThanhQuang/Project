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
  Divider,
  Avatar,
  Rating,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
} from '@mui/material';
import {
  DirectionsBus,
  Schedule,
  LocationOn,
  AirlineSeatReclineNormal,
  Star,
  Wifi,
  AcUnit,
  LocalDrink,
  Spa,
  AccessTime,
  CheckCircle,
  Block,
  Timer,
  Route,
  Map,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

interface Seat {
  id: string;
  seatNumber: string;
  status: 'available' | 'held' | 'booked';
  position: { row: number; column: number };
  price?: number;
}

interface RouteStop {
  id: string;
  name: string;
  arrivalTime: string;
  departureTime?: string;
  isTerminal: boolean;
}

interface TripDetail {
  id: string;
  companyName: string;
  companyLogo: string;
  vehicleType: string;
  vehicleNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromLocation: string;
  toLocation: string;
  price: number;
  rating: number;
  amenities: string[];
  seats: Seat[];
  routeStops: RouteStop[];
  seatLayout: {
    rows: number;
    columns: number;
    aisleAfterColumn?: number;
  };
}

const TripDetails: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [holdTimer, setHoldTimer] = useState<number>(15 * 60); // 15 minutes

  const mockTrip: TripDetail = {
    id: tripId || '1',
    companyName: 'Phương Trang',
    companyLogo: 'PT',
    vehicleType: 'Giường nằm 40 chỗ',
    vehicleNumber: '79B-12345',
    departureTime: '08:00',
    arrivalTime: '14:00',
    duration: '6h',
    fromLocation: 'Bến xe Miền Đông, HCM',
    toLocation: 'Bến xe Đà Lạt',
    price: 180000,
    rating: 4.5,
    amenities: ['WiFi', 'Điều hòa', 'Nước uống', 'Chăn gối'],
    seatLayout: {
      rows: 10,
      columns: 4,
      aisleAfterColumn: 2,
    },
    seats: [
      // Mock seats data
      ...Array.from({ length: 40 }, (_, i) => ({
        id: `seat-${i + 1}`,
        seatNumber: `${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`,
        status: Math.random() > 0.7 ? 'booked' : Math.random() > 0.9 ? 'held' : 'available' as 'available' | 'held' | 'booked',
        position: {
          row: Math.floor(i / 4),
          column: i % 4,
        },
        price: 180000,
      })),
    ],
    routeStops: [
      {
        id: '1',
        name: 'Bến xe Miền Đông, TP.HCM',
        arrivalTime: '08:00',
        isTerminal: true,
      },
      {
        id: '2',
        name: 'Trạm dừng Dầu Giây',
        arrivalTime: '09:30',
        departureTime: '09:45',
        isTerminal: false,
      },
      {
        id: '3',
        name: 'Trạm dừng Bảo Lộc',
        arrivalTime: '11:00',
        departureTime: '11:15',
        isTerminal: false,
      },
      {
        id: '4',
        name: 'Bến xe Đà Lạt',
        arrivalTime: '14:00',
        isTerminal: true,
      },
    ],
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setHoldTimer((prev) => {
        if (prev <= 1) {
          // Clear selected seats when timer expires
          setSelectedSeats([]);
          return 15 * 60; // Reset timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSeatSelect = (seatId: string, seatStatus: string) => {
    if (seatStatus !== 'available') return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.includes(seat.id)) {
      return '#ffa726'; // Selected color
    }
    switch (seat.status) {
      case 'available':
        return '#e8f5e8'; // Light green
      case 'held':
        return '#fff3e0'; // Light orange
      case 'booked':
        return '#ffebee'; // Light red
      default:
        return '#f5f5f5';
    }
  };

  const getSeatBorderColor = (seat: Seat) => {
    if (selectedSeats.includes(seat.id)) {
      return '#ff8f00';
    }
    switch (seat.status) {
      case 'available':
        return '#4caf50';
      case 'held':
        return '#ff9800';
      case 'booked':
        return '#f44336';
      default:
        return '#bdbdbd';
    }
  };

  const getTotalPrice = () => {
    return selectedSeats.length * mockTrip.price;
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    
    // Navigate to booking confirmation page
    navigate('/bookings/checkout', {
      state: {
        tripId: mockTrip.id,
        selectedSeats,
        totalPrice: getTotalPrice(),
      }
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderSeatMap = () => {
    const { rows, columns, aisleAfterColumn } = mockTrip.seatLayout;
    
    return (
      <Box sx={{ p: 3 }}>
        {/* Driver area */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{
            width: 60,
            height: 40,
            bgcolor: 'grey.300',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Typography variant="caption" fontWeight="bold">
              Tài xế
            </Typography>
          </Box>
        </Box>

        {/* Seat grid */}
        <Grid container spacing={1} justifyContent="center">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <Grid size={12} key={rowIndex}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1 }}>
                {Array.from({ length: columns }, (_, colIndex) => {
                  const seatIndex = rowIndex * columns + colIndex;
                  const seat = mockTrip.seats[seatIndex];
                  
                  if (!seat) return null;

                  return (
                    <React.Fragment key={colIndex}>
                      <Box
                        onClick={() => handleSeatSelect(seat.id, seat.status)}
                        sx={{
                          width: 45,
                          height: 45,
                          bgcolor: getSeatColor(seat),
                          border: `2px solid ${getSeatBorderColor(seat)}`,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: seat.status === 'available' ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s ease',
                          '&:hover': seat.status === 'available' ? {
                            transform: 'scale(1.05)',
                            boxShadow: 2,
                          } : {},
                        }}
                      >
                        <Typography variant="caption" fontWeight="bold">
                          {seat.seatNumber}
                        </Typography>
                      </Box>
                      {aisleAfterColumn && colIndex === aisleAfterColumn - 1 && (
                        <Box sx={{ width: 20 }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#e8f5e8', border: '2px solid #4caf50', borderRadius: 1 }} />
            <Typography variant="caption">Còn trống</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#ffa726', border: '2px solid #ff8f00', borderRadius: 1 }} />
            <Typography variant="caption">Đã chọn</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#fff3e0', border: '2px solid #ff9800', borderRadius: 1 }} />
            <Typography variant="caption">Đang giữ</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#ffebee', border: '2px solid #f44336', borderRadius: 1 }} />
            <Typography variant="caption">Đã đặt</Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column - Trip Info */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    mr: 3,
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                  }}
                >
                  {mockTrip.companyLogo}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {mockTrip.companyName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      {mockTrip.vehicleType} - {mockTrip.vehicleNumber}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={mockTrip.rating} size="small" readOnly />
                      <Typography variant="body2">({mockTrip.rating})</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                      {mockTrip.departureTime}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {mockTrip.fromLocation}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <Box sx={{ flex: 1, height: 3, bgcolor: 'primary.main', borderRadius: 1 }} />
                      <DirectionsBus sx={{ mx: 2, color: 'primary.main', fontSize: 32 }} />
                      <Box sx={{ flex: 1, height: 3, bgcolor: 'primary.main', borderRadius: 1 }} />
                    </Box>
                    <Typography variant="h6" color="text.secondary">
                      {mockTrip.duration}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                      {mockTrip.arrivalTime}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {mockTrip.toLocation}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
                {mockTrip.amenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Route />}
                  onClick={() => setShowRouteModal(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Xem lộ trình
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Map />}
                  sx={{ borderRadius: 2 }}
                >
                  Xem bản đồ
                </Button>
              </Box>
            </CardContent>
          </Paper>

          {/* Seat Map */}
          <Paper elevation={3} sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Sơ đồ ghế
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nhấp vào ghế để chọn. Bạn có thể chọn nhiều ghế cùng lúc.
              </Typography>
            </Box>
            {renderSeatMap()}
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
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Thông tin đặt vé
              </Typography>

              {selectedSeats.length > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Timer />
                    <Typography variant="body2">
                      Thời gian giữ ghế: <strong>{formatTime(holdTimer)}</strong>
                    </Typography>
                  </Box>
                </Alert>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Chuyến đi
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {mockTrip.fromLocation} → {mockTrip.toLocation}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mockTrip.departureTime} - {mockTrip.arrivalTime}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Ghế đã chọn
                </Typography>
                {selectedSeats.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Chưa chọn ghế nào
                  </Typography>
                ) : (
                  <Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {selectedSeats.map((seatId) => {
                        const seat = mockTrip.seats.find(s => s.id === seatId);
                        return (
                          <Chip
                            key={seatId}
                            label={seat?.seatNumber}
                            color="primary"
                            onDelete={() => handleSeatSelect(seatId, 'available')}
                          />
                        );
                      })}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Số ghế: {selectedSeats.length}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">
                    Giá vé ({selectedSeats.length} ghế)
                  </Typography>
                  <Typography variant="body1">
                    {formatPrice(getTotalPrice())}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Tổng cộng
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formatPrice(getTotalPrice())}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={selectedSeats.length === 0}
                onClick={handleContinue}
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
                Tiếp tục
              </Button>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>

      {/* Route Modal */}
      <Dialog
        open={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Lộ trình chi tiết
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stepper orientation="vertical">
            {mockTrip.routeStops.map((stop, index) => (
              <Step key={stop.id} active>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: stop.isTerminal ? 'primary.main' : 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {stop.isTerminal ? (
                        <LocationOn sx={{ fontSize: 16, color: 'white' }} />
                      ) : (
                        <AccessTime sx={{ fontSize: 16, color: 'white' }} />
                      )}
                    </Box>
                  )}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {stop.name}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Đến: {stop.arrivalTime}
                    </Typography>
                    {stop.departureTime && (
                      <Typography variant="body2" color="text.secondary">
                        Khởi hành: {stop.departureTime}
                      </Typography>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default TripDetails; 