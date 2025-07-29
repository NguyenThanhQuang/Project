import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  CardContent,
  Chip,
  Divider,
  Avatar,
  Rating,
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
} from '@mui/material';
import {
  DirectionsBus,
  LocationOn,
  AccessTime,
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
  price: number;
  type: 'normal';
  floor?: 1 | 2; // Optional for single-floor buses
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
  vehicleType: 'Giường nằm' | 'Ghế ngồi';
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
    floors: 1 | 2; // Number of floors based on vehicle type
  };
}

const TripDetails: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [holdTimer, setHoldTimer] = useState<number>(15 * 60); // 15 minutes

  // Function to generate seats based on vehicle type
  const generateSeats = (vehicleType: 'Giường nằm' | 'Ghế ngồi'): Seat[] => {
    const seats: Seat[] = [];
    
    if (vehicleType === 'Giường nằm') {
      // 2-floor sleeper bus (40 seats total: 20 per floor)
      const seatsPerFloor = 20;
      const rows = 5;
      const columns = 4;
      
      // Floor 1
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const seatNumber = row * columns + col + 1;
          seats.push({
            id: `seat-${seatNumber}`,
            seatNumber: `A${seatNumber}`,
            status: 'available',
            position: { row, column: col },
            price: 150000,
            type: 'normal',
            floor: 1
          });
        }
      }
      
      // Floor 2
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const seatNumber = row * columns + col + 1;
          seats.push({
            id: `seat-${seatsPerFloor + seatNumber}`,
            seatNumber: `B${seatNumber}`,
            status: 'available',
            position: { row, column: col },
            price: 150000,
            type: 'normal',
            floor: 2
          });
        }
      }
    } else {
      // 1-floor sitting bus (45 seats)
      const rows = 9;
      const columns = 5;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const seatNumber = row * columns + col + 1;
          seats.push({
            id: `seat-${seatNumber}`,
            seatNumber: `${seatNumber}`,
            status: 'available',
            position: { row, column: col },
            price: 120000,
            type: 'normal'
          });
        }
      }
    }
    
    return seats;
  };

  const vehicleType: 'Giường nằm' | 'Ghế ngồi' = tripId === '2' ? 'Ghế ngồi' : 'Giường nằm';
  
  const mockTrip: TripDetail = {
    id: tripId || '1',
    companyName: 'Phương Trang',
    companyLogo: 'PT',
    vehicleType: vehicleType,
    vehicleNumber: vehicleType === 'Giường nằm' ? '79B-12345' : '79C-67890',
    departureTime: '08:00',
    arrivalTime: '14:00',
    duration: '6h',
    fromLocation: 'Bến xe Miền Đông, HCM',
    toLocation: 'Bến xe Đà Lạt',
    price: vehicleType === 'Giường nằm' ? 150000 : 120000,
    rating: 4.5,
    amenities: vehicleType === 'Giường nằm' 
      ? ['WiFi', 'Điều hòa', 'Nước uống', 'Chăn gối', 'Giường nằm']
      : ['WiFi', 'Điều hòa', 'Nước uống', 'Ghế êm'],
    seatLayout: {
      rows: vehicleType === 'Giường nằm' ? 5 : 9,
      columns: vehicleType === 'Giường nằm' ? 4 : 5,
      aisleAfterColumn: vehicleType === 'Giường nằm' ? 2 : 2,
      floors: vehicleType === 'Giường nằm' ? 2 : 1,
    },
    seats: generateSeats(vehicleType),
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
        // Limit to 4 seats maximum
        if (prev.length >= 4) {
          // Show notification about limit
          alert('Bạn chỉ có thể chọn tối đa 4 ghế cho mỗi lần đặt vé.');
          return prev;
        }
        return [...prev, seatId];
      }
    });
  };

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.includes(seat.id)) {
      return '#2196f3'; // Blue for selected seats
    }
    switch (seat.status) {
      case 'available':
        return '#e8f5e8'; // Light green for available
      case 'held':
        return '#ffecb3'; // Light orange for held
      case 'booked':
        return '#e0e0e0'; // Light gray for booked
      default:
        return '#f5f5f5';
    }
  };

  const getSeatBorderColor = (seat: Seat) => {
    if (selectedSeats.includes(seat.id)) {
      return '#2196f3'; // Blue border for selected
    }
    switch (seat.status) {
      case 'available':
        return '#4caf50'; // Green for available
      case 'held':
        return '#ff9800'; // Orange border for held
      case 'booked':
        return '#9e9e9e'; // Gray border for booked
      default:
        return '#bdbdbd';
    }
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = mockTrip.seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
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
    const { vehicleType, seatLayout } = mockTrip;
    const isSleeperBus = vehicleType === 'Giường nằm';
    
    const firstFloorSeats = mockTrip.seats.filter(seat => 
      isSleeperBus ? seat.floor === 1 : !seat.floor || seat.floor === 1
    );
    const secondFloorSeats = isSleeperBus ? mockTrip.seats.filter(seat => seat.floor === 2) : [];

    const renderFloor = (seats: Seat[], floorName: string) => {
      const maxColumns = seatLayout.columns;
      const aislePosition = seatLayout.aisleAfterColumn || 2;
      
      return (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
            {floorName}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${maxColumns + 1}, 1fr)`,
              gap: 1,
              maxWidth: isSleeperBus ? 400 : 500,
              mx: 'auto',
              p: 2,
              border: '2px solid #e0e0e0',
              borderRadius: 2,
              position: 'relative',
            }}
          >
            {/* Driver area */}
            <Box
              sx={{
                gridColumn: '1 / -1',
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                🚗 Tài xế
              </Typography>
            </Box>

            {seats.map((seat) => {
              let gridColumn = seat.position.column + 1;
              if (seat.position.column > aislePosition) {
                gridColumn = seat.position.column + 2; // Add space for aisle
              }
              
              return (
                <Box
                  key={seat.id}
                  sx={{
                    gridColumn: `${gridColumn}`,
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: getSeatColor(seat),
                    border: `2px solid ${getSeatBorderColor(seat)}`,
                    borderRadius: 1,
                    cursor: seat.status === 'available' ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    '&:hover': seat.status === 'available' ? {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    } : {},
                  }}
                  onClick={() => handleSeatSelect(seat.id, seat.status)}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      color: selectedSeats.includes(seat.id) ? 'white' : 
                             seat.status === 'booked' ? '#666' : 'text.primary',
                    }}
                  >
                    {seat.seatNumber}
                  </Typography>
                </Box>
              );
            })}
            
            {/* Aisle indicator */}
            <Box
              sx={{
                gridColumn: `${aislePosition + 2}`,
                gridRow: '2 / -1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                fontSize: '0.8rem',
                writingMode: 'vertical-rl',
              }}
            >
              Lối đi
            </Box>
          </Box>
        </Box>
      );
    };

    return (
      <CardContent sx={{ p: 4 }}>
        {isSleeperBus ? (
          <>
            {renderFloor(firstFloorSeats, `Tầng 1 (${formatPrice(mockTrip.price)})`)}
            {renderFloor(secondFloorSeats, `Tầng 2 (${formatPrice(mockTrip.price)})`)}
          </>
        ) : (
          renderFloor(firstFloorSeats, `Xe ghế ngồi (${formatPrice(mockTrip.price)})`)
        )}
        
        {/* Legend */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
            Chú thích
          </Typography>
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#e8f5e8', border: '2px solid #4caf50', borderRadius: 0.5 }} />
                <Typography variant="caption">Ghế trống</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#2196f3', border: '2px solid #2196f3', borderRadius: 0.5 }} />
                <Typography variant="caption">Đã chọn</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#ffecb3', border: '2px solid #ff9800', borderRadius: 0.5 }} />
                <Typography variant="caption">Đang giữ</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#e0e0e0', border: '2px solid #9e9e9e', borderRadius: 0.5 }} />
                <Typography variant="caption">Đã bán</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                💡 Nhấp vào ghế <span style={{ color: '#4caf50', fontWeight: 'bold' }}>xanh lá</span> (ghế trống) để chọn.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ⚠️ Tối đa 4 ghế/lần đặt. Ghế <span style={{ color: '#9e9e9e', fontWeight: 'bold' }}>xám</span> đã được bán.
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
            {mockTrip.routeStops.map((stop) => (
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