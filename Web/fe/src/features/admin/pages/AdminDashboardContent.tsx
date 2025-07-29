import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  DirectionsBus,
  MonetizationOn,
  LocalShipping,
  Person,
  TrendingUp,
  Assessment,
  People,
  Settings,
} from '@mui/icons-material';

interface AdminStats {
  totalCompanies: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  todayBookings: number;
  activeTrips: number;
}

const AdminDashboardContent: React.FC = () => {
  const navigate = useNavigate();

  // Mock admin stats
  const stats: AdminStats = {
    totalCompanies: 45,
    totalUsers: 12847,
    totalBookings: 3256,
    totalRevenue: 2845000000,
    todayBookings: 127,
    activeTrips: 89,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', mr: 2 }}>
                  <DirectionsBus />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Nhà xe
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                {formatNumber(stats.totalCompanies)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số nhà xe đăng ký
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#e8f5e8', color: '#2e7d32', mr: 2 }}>
                  <Person />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Người dùng
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
                {formatNumber(stats.totalUsers)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số người dùng cuối
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#fff3e0', color: '#f57c00', mr: 2 }}>
                  <LocalShipping />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Đặt vé
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00', mb: 1 }}>
                {formatNumber(stats.totalBookings)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số vé đã đặt
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2', mr: 2 }}>
                  <MonetizationOn />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Doanh thu
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#7b1fa2', mb: 1 }}>
                {formatCurrency(stats.totalRevenue).slice(0, -2)}B
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng doanh thu tháng này
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Hoạt động hôm nay
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1">Vé đặt mới</Typography>
                <Chip 
                  label={formatNumber(stats.todayBookings)} 
                  color="primary" 
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1">Chuyến đang hoạt động</Typography>
                <Chip 
                  label={formatNumber(stats.activeTrips)} 
                  color="success" 
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Nhà xe mới đăng ký</Typography>
                <Chip 
                  label="3" 
                  color="warning" 
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Truy cập nhanh
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box
                    onClick={() => navigate('/admin/companies')}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#e3f2fd',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: '#bbdefb',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)',
                      },
                    }}
                  >
                    <DirectionsBus sx={{ color: '#1976d2', mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      Quản lý Nhà xe
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box
                    onClick={() => navigate('/admin/users')}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#e8f5e8',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: '#c8e6c9',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(46, 125, 50, 0.2)',
                      },
                    }}
                  >
                    <People sx={{ color: '#2e7d32', mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                      Quản lý Người dùng
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box
                    onClick={() => navigate('/admin/finance')}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#fff3e0',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: '#ffe0b2',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(245, 124, 0, 0.2)',
                      },
                    }}
                  >
                    <Assessment sx={{ color: '#f57c00', mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#f57c00' }}>
                      Báo cáo Tài chính
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box
                    onClick={() => navigate('/admin/settings')}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#f3e5f5',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: '#e1bee7',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(123, 31, 162, 0.2)',
                      },
                    }}
                  >
                    <Settings sx={{ color: '#7b1fa2', mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#7b1fa2' }}>
                      Cấu hình Hệ thống
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboardContent; 