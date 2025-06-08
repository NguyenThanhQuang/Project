import React, { useState } from 'react';
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
  CardActions,
  Rating,
  Avatar,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Search,
  DirectionsBus,
  Security,
  Support,
  TrendingUp,
  Verified,
  FlashOn,
  Payment,
  People,
  Star,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: dayjs(),
    passengers: 1,
  });

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

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

  const handleSearch = () => {
    if (!searchData.from || !searchData.to) {
      return;
    }
    
    const searchParams = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      date: searchData.date.format('YYYY-MM-DD'),
      passengers: searchData.passengers.toString(),
    });
    
    navigate(`/trips?${searchParams.toString()}`);
  };

  const popularRoutes = [
    { from: 'Hồ Chí Minh', to: 'Đà Lạt', price: '150,000₫', duration: '6h', trend: '+15%' },
    { from: 'Hà Nội', to: 'Hải Phòng', price: '120,000₫', duration: '2h', trend: '+8%' },
    { from: 'Hồ Chí Minh', to: 'Nha Trang', price: '200,000₫', duration: '8h', trend: '+22%' },
    { from: 'Đà Nẵng', to: 'Huế', price: '80,000₫', duration: '3h', trend: '+12%' },
  ];

  const customerReviews = [
    {
      name: 'Khanh',
      rating: 5,
      comment: 'hi',
      route: 'HCM ',
      verified: true,
    },
    {
      name: 'hi',
      rating: 5,
      comment: 'hi',
      route: 'HCM',
      verified: true,
    },
    {
      name: 'hi',
      rating: 4,
      comment: 'hi',
      route: 'HCM',
      verified: false,
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0077be 0%, #004c8b 20%, #ffa726 100%)',
            color: 'white',
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 20%, rgba(255, 167, 38, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0, 119, 190, 0.4) 0%, transparent 50%)',
              zIndex: 1,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 4 }}>
                  <Chip
                    label="hi"
                    sx={{
                      backgroundColor: 'rgba(255, 167, 38, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      mb: 3,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 167, 38, 0.3)',
                    }}
                  />
                </Box>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.1,
                  }}
                >
                  Đặt vé xe khách
                  <br />
                  <Typography 
                    component="span" 
                    variant="h1" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #ffa726 0%, #ffcc02 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                    }}
                  >
                    thông minh & tiện lợi
                  </Typography>
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.95, fontWeight: 400 }}>
                 #########################################################
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid size={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        1000+
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Chuyến xe
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        99%
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Hài lòng
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        24/7
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Hỗ trợ
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={20}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 119, 190, 0.3)',
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 700, textAlign: 'center' }}>
                    Tìm chuyến xe lý tưởng
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Autocomplete
                        options={popularLocations}
                        value={searchData.from}
                        onChange={(_, newValue) => setSearchData({ ...searchData, from: newValue || '' })}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Điểm đi"
                            fullWidth
                            required
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Autocomplete
                        options={popularLocations}
                        value={searchData.to}
                        onChange={(_, newValue) => setSearchData({ ...searchData, to: newValue || '' })}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Điểm đến"
                            fullWidth
                            required
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DatePicker
                        label="Ngày đi"
                        value={searchData.date}
                        onChange={(newValue) => setSearchData({ ...searchData, date: newValue || dayjs() })}
                        minDate={dayjs()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Số lượng khách"
                        type="number"
                        fullWidth
                        value={searchData.passengers}
                        onChange={(e) => setSearchData({ ...searchData, passengers: parseInt(e.target.value) || 1 })}
                        inputProps={{ min: 1, max: 10 }}
                      />
                    </Grid>
                    <Grid size={12}>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<Search />}
                        onClick={handleSearch}
                        disabled={!searchData.from || !searchData.to}
                        sx={{
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #004c8b 0%, #003366 100%)',
                            transform: 'translateY(-2px)',
                          },
                          '&:disabled': {
                            background: 'rgba(0, 0, 0, 0.12)',
                          }
                        }}
                                              >
                          Tìm chuyến xe ngay
                        </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Container>

          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255, 167, 38, 0.2)',
              animation: 'float 6s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-20px)' },
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '70%',
              right: '10%',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255, 167, 38, 0.3)',
              animation: 'float 4s ease-in-out infinite',
              animationDelay: '2s',
            }}
          />
        </Box>

        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Tuyến đường hot nhất
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Những tuyến đường được đặt nhiều nhất với mức tăng trưởng ấn tượng
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {popularRoutes.map((route, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0, 119, 190, 0.2)',
                    },
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)',
                    border: '1px solid rgba(0, 119, 190, 0.1)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DirectionsBus sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {route.from}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            đến {route.to}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        icon={<TrendingUp />}
                        label={route.trend}
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip 
                        label={route.price} 
                        sx={{
                          background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                          color: 'white',
                          fontWeight: 700,
                        }}
                      />
                      <Chip 
                        label={route.duration} 
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                      size="small" 
                      fullWidth 
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                          color: 'white',
                          borderColor: 'transparent',
                        }
                      }}
                    >
                      Xem chuyến xe
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                Tại sao chọn BusBooking?
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Trải nghiệm đặt vé hoàn toàn mới với công nghệ tiên tiến
              </Typography>
            </Box>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 10px 30px rgba(0, 119, 190, 0.3)',
                    }}
                  >
                    <FlashOn sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                    Đặt vé siêu tốc
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Công nghệ AI giúp tìm kiếm và đặt vé chỉ trong 30 giây với độ chính xác 99.9%
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ffa726 0%, #ff8f00 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 10px 30px rgba(255, 167, 38, 0.3)',
                    }}
                  >
                    <Security sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                    Bảo mật tuyệt đối
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Mã hóa SSL 256-bit và bảo mật 2 lớp cho mọi giao dịch thanh toán an toàn 100%
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 10px 30px rgba(72, 187, 120, 0.3)',
                    }}
                  >
                    <Support sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                    Hỗ trợ 24/7
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Chatbot AI và đội ngũ chuyên viên sẵn sàng hỗ trợ bạn mọi lúc mọi nơi
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Khách hàng nói gì về chúng tôi?
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Hơn 10,000+ đánh giá 5 sao từ khách hàng thực tế
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {customerReviews.map((review, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 15px 35px rgba(0, 119, 190, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
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
                        {review.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {review.name}
                          </Typography>
                          {review.verified && (
                            <Verified sx={{ fontSize: 18, color: 'success.main' }} />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {review.route}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={review.rating} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                      "{review.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #0077be 0%, #004c8b 20%, #ffa726 100%)',
            py: 10,
            color: 'white',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                Cách thức hoạt động
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Chỉ 4 bước đơn giản để có chuyến đi hoàn hảo
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {[
                { step: 1, title: 'Tìm kiếm thông minh', desc: 'AI tìm kiếm chuyến xe phù hợp nhất với bạn' },
                { step: 2, title: 'Chọn ghế VIP', desc: 'Sơ đồ ghế 3D giúp bạn chọn vị trí tốt nhất' },
                { step: 3, title: 'Thanh toán an toàn', desc: 'Đa dạng phương thức với bảo mật tối đa' },
                { step: 4, title: 'Lên xe & tận hưởng', desc: 'QR code thông minh và dịch vụ 5 sao' },
              ].map((item, index) => (
                <Grid size={{ xs: 12, md: 3 }} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                        fontWeight: 800,
                        mx: 'auto',
                        mb: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          background: 'rgba(255, 167, 38, 0.3)',
                        },
                      }}
                    >
                      {item.step}
                    </Box>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Thông tin liên hệ
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Để lại thông tin liên hệ và chúng tôi sẽ liên lạc với bạn trong thời gian sớm nhất
            </Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <DirectionsBus sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  500+
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Tuyến đường
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phủ sóng toàn quốc với hơn 500 tuyến đường
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <People sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  1M+
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Khách hàng
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hơn 1 triệu khách hàng tin tưởng sử dụng
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Star sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  4.8/5
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Đánh giá
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Điểm đánh giá trung bình từ khách hàng
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Để lại thông tin liên hệ
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Để lại thông tin liên hệ và chúng tôi sẽ liên lạc với bạn trong thời gian sớm nhất
            </Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Họ và tên"
                fullWidth
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Số điện thoại"
                fullWidth
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Chủ đề"
                fullWidth
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Tin nhắn"
                multiline
                rows={4}
                fullWidth
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default Homepage; 