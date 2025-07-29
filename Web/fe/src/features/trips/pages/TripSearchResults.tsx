import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Autocomplete,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Divider,
  IconButton,
  Avatar,
  Rating,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Search,
  FilterList,
  DirectionsBus,
  AirlineSeatReclineNormal,
  SwapHoriz,
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface Trip {
  id: string;
  companyName: string;
  companyLogo: string;
  vehicleType: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromLocation: string;
  toLocation: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  rating: number;
  amenities: string[];
}

interface SearchData {
  from: string;
  to: string;
  date: Dayjs;
  passengers: number;
}

const TripSearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchData, setSearchData] = useState<SearchData>({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: dayjs(searchParams.get('date') || dayjs()),
    passengers: parseInt(searchParams.get('passengers') || '1'),
  });

  const [filters, setFilters] = useState({
    companies: [] as string[],
    timeSlots: [] as string[],
    vehicleTypes: [] as string[],
    priceRange: [0, 500000] as number[],
    minAvailableSeats: 1,
  });

  const [sortBy, setSortBy] = useState('departureTime');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [showFilters, setShowFilters] = useState(false);

  const popularLocations = [
    'Hồ Chí Minh',
    'Hà Nội',
    'Đà Nẵng',
    'Cần Thơ',
    'Nha Trang',
    'Đà Lạt',
    'Huế',
    'Hải Phòng',
    'Vũng Tàu',
    'Phan Thiết',
  ];

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data instead of API
      setTrips(mockTrips);
    } catch (err) {
      console.error('Error loading trips:', err);
      setError('Không thể tải danh sách chuyến đi. Vui lòng thử lại sau.');
      setTrips(mockTrips);
    } finally {
      setLoading(false);
    }
  };

  // Mock data
  const mockTrips: Trip[] = [
    {
      id: '1',
      companyName: 'Phương Trang',
      companyLogo: 'PT',
      vehicleType: 'Giường nằm 40 chỗ',
      departureTime: '08:00',
      arrivalTime: '14:00',
      duration: '6h',
      fromLocation: 'Bến xe Miền Đông, HCM',
      toLocation: 'Bến xe Đà Lạt',
      price: 150000,
      availableSeats: 15,
      totalSeats: 40,
      rating: 4.5,
      amenities: ['WiFi', 'Điều hòa', 'Nước uống'],
    },
    {
      id: '2',
      companyName: 'Thanh Bưởi',
      companyLogo: 'TB',
      vehicleType: 'Limousine 24 chỗ',
      departureTime: '09:30',
      arrivalTime: '15:30',
      duration: '6h',
      fromLocation: 'Bến xe Miền Đông, HCM',
      toLocation: 'Bến xe Đà Lạt',
      price: 280000,
      availableSeats: 8,
      totalSeats: 24,
      rating: 4.7,
      amenities: ['WiFi', 'Điều hòa', 'Massage', 'Nước uống'],
    },
    {
      id: '3',
      companyName: 'Mai Linh',
      companyLogo: 'ML',
      vehicleType: 'Ghế ngồi 45 chỗ',
      departureTime: '06:30',
      arrivalTime: '12:30',
      duration: '6h',
      fromLocation: 'Bến xe Miền Đông, HCM',
      toLocation: 'Bến xe Đà Lạt',
      price: 120000,
      availableSeats: 20,
      totalSeats: 45,
      rating: 4.2,
      amenities: ['WiFi', 'Điều hòa'],
    },
    {
      id: '4',
      companyName: 'Hoàng Long',
      companyLogo: 'HL',
      vehicleType: 'Giường nằm VIP 24 chỗ',
      departureTime: '22:00',
      arrivalTime: '05:00',
      duration: '7h',
      fromLocation: 'Bến xe Miền Đông, HCM',
      toLocation: 'Bến xe Đà Lạt',
      price: 320000,
      availableSeats: 5,
      totalSeats: 24,
      rating: 4.8,
      amenities: ['WiFi', 'Điều hòa', 'Massage', 'Nước uống', 'Chăn gối cao cấp'],
    },
  ];

  // useEffect to fetch trips on component mount and when search params change
  useEffect(() => {
    fetchTrips();
  }, [searchData.from, searchData.to, searchData.date.format('YYYY-MM-DD'), searchData.passengers]);

  const timeSlots = [
    { value: 'morning', label: 'Sáng (06:00 - 12:00)' },
    { value: 'afternoon', label: 'Chiều (12:00 - 18:00)' },
    { value: 'evening', label: 'Tối (18:00 - 00:00)' },
    { value: 'night', label: 'Đêm (00:00 - 06:00)' },
  ];

  const vehicleTypes = ['Ghế ngồi', 'Giường nằm', 'Limousine'];
  const companies = ['Phương Trang', 'Thanh Bưởi', 'Mai Linh', 'Hoàng Long'];

  const handleSearch = () => {
    const params = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      date: searchData.date.format('YYYY-MM-DD'),
      passengers: searchData.passengers.toString(),
    });
    navigate(`/trips?${params.toString()}`);
    // Trigger new search
    fetchTrips();
  };

  const handleSwapLocations = () => {
    setSearchData({
      ...searchData,
      from: searchData.to,
      to: searchData.from,
    });
  };

  const handleTripSelect = (tripId: string) => {
    navigate(`/trips/${tripId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            Tìm kiếm chuyến đi
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 2.5 }}>
              <Autocomplete
                options={popularLocations}
                value={searchData.from}
                onChange={(_, newValue) => setSearchData({ ...searchData, from: newValue || '' })}
                renderInput={(params) => (
                  <TextField {...params} label="Điểm đi" size="small" fullWidth />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 0.5 }} sx={{ textAlign: 'center' }}>
              <IconButton onClick={handleSwapLocations} color="primary">
                <SwapHoriz />
              </IconButton>
            </Grid>
            <Grid size={{ xs: 12, md: 2.5 }}>
              <Autocomplete
                options={popularLocations}
                value={searchData.to}
                onChange={(_, newValue) => setSearchData({ ...searchData, to: newValue || '' })}
                renderInput={(params) => (
                  <TextField {...params} label="Điểm đến" size="small" fullWidth />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <DatePicker
                label="Ngày đi"
                value={searchData.date}
                onChange={(newValue) => setSearchData({ ...searchData, date: newValue || dayjs() })}
                minDate={dayjs()}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 1.5 }}>
              <TextField
                label="Số khách"
                type="number"
                size="small"
                fullWidth
                value={searchData.passengers}
                onChange={(e) => setSearchData({ ...searchData, passengers: parseInt(e.target.value) || 1 })}
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Search />}
                onClick={handleSearch}
                sx={{
                  py: 1.2,
                  background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                }}
              >
                Tìm kiếm
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FilterList sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Bộ lọc
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Nhà xe
                </Typography>
                {companies.map((company) => (
                  <Box key={company} sx={{ mb: 1 }}>
                    <label>
                      <input
                        type="checkbox"
                        style={{ marginRight: 8 }}
                        checked={filters.companies.includes(company)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({
                              ...filters,
                              companies: [...filters.companies, company]
                            });
                          } else {
                            setFilters({
                              ...filters,
                              companies: filters.companies.filter(c => c !== company)
                            });
                          }
                        }}
                      />
                      {company}
                    </label>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Giờ khởi hành
                </Typography>
                {timeSlots.map((slot) => (
                  <Box key={slot.value} sx={{ mb: 1 }}>
                    <label>
                      <input
                        type="checkbox"
                        style={{ marginRight: 8 }}
                        checked={filters.timeSlots.includes(slot.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({
                              ...filters,
                              timeSlots: [...filters.timeSlots, slot.value]
                            });
                          } else {
                            setFilters({
                              ...filters,
                              timeSlots: filters.timeSlots.filter(t => t !== slot.value)
                            });
                          }
                        }}
                      />
                      {slot.label}
                    </label>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Loại xe
                </Typography>
                {vehicleTypes.map((type) => (
                  <Box key={type} sx={{ mb: 1 }}>
                    <label>
                      <input
                        type="checkbox"
                        style={{ marginRight: 8 }}
                        checked={filters.vehicleTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({
                              ...filters,
                              vehicleTypes: [...filters.vehicleTypes, type]
                            });
                          } else {
                            setFilters({
                              ...filters,
                              vehicleTypes: filters.vehicleTypes.filter(v => v !== type)
                            });
                          }
                        }}
                      />
                      {type}
                    </label>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Khoảng giá
                </Typography>
                <Slider
                  value={filters.priceRange}
                  onChange={(_, newValue) => setFilters({ ...filters, priceRange: newValue as number[] })}
                  valueLabelDisplay="auto"
                  min={0}
                  max={500000}
                  step={10000}
                  valueLabelFormat={(value) => `${value.toLocaleString()}đ`}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption">{filters.priceRange[0].toLocaleString()}đ</Typography>
                  <Typography variant="caption">{filters.priceRange[1].toLocaleString()}đ</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${trips.length} chuyến đi`}
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select
                  value={sortBy}
                  label="Sắp xếp theo"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="departureTime">Giờ khởi hành</MenuItem>
                  <MenuItem value="price">Giá vé</MenuItem>
                  <MenuItem value="duration">Thời gian</MenuItem>
                  <MenuItem value="rating">Đánh giá</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {error && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} />
              </Box>
            ) : trips.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  Không tìm thấy chuyến đi phù hợp
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Vui lòng thử thay đổi điều kiện tìm kiếm
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {trips.map((trip) => (
                <Card
                  key={trip.id}
                  sx={{
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 30px rgba(0, 119, 190, 0.15)',
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
                            {trip.companyLogo}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {trip.companyName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {trip.vehicleType}
                              </Typography>
                              <Rating value={trip.rating} size="small" readOnly />
                              <Typography variant="body2" color="text.secondary">
                                ({trip.rating})
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {trip.departureTime}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {trip.fromLocation}
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
                                {trip.duration}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {trip.arrivalTime}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {trip.toLocation}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          {trip.amenities.map((amenity) => (
                            <Chip
                              key={amenity}
                              label={amenity}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                            {formatPrice(trip.price)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 2 }}>
                            <AirlineSeatReclineNormal sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">
                              Còn {trip.availableSeats}/{trip.totalSeats} ghế
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleTripSelect(trip.id)}
                            sx={{
                              py: 1.5,
                              background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #004c8b 0%, #003366 100%)',
                              }
                            }}
                          >
                            Chọn ghế
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default TripSearchResults; 