import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  MonetizationOn,
  Assessment,
  Download,
  DateRange,
  AccountBalance,
  Receipt,
  LocalShipping,
  DirectionsBus,
} from '@mui/icons-material';

interface Transaction {
  id: string;
  date: string;
  type: 'booking' | 'refund' | 'commission';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  company: string;
  description: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
  growth: number;
}

const FinanceReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('revenue');

  // Mock data
  const currentStats = {
    totalRevenue: 15500000000,
    monthlyRevenue: 2845000000,
    totalBookings: 3256,
    averageOrderValue: 4750000,
    commission: 465750000,
    refunds: 89000000,
  };

  const revenueData: RevenueData[] = [
    { month: 'T1', revenue: 2100000000, bookings: 2890, growth: 12.5 },
    { month: 'T2', revenue: 2350000000, bookings: 3120, growth: 11.9 },
    { month: 'T3', revenue: 2600000000, bookings: 3450, growth: 10.6 },
    { month: 'T4', revenue: 2845000000, bookings: 3780, growth: 9.4 },
  ];

  const transactions: Transaction[] = [
    {
      id: 'TXN001',
      date: '2024-12-27',
      type: 'booking',
      amount: 180000,
      status: 'completed',
      company: 'Phương Trang',
      description: 'Đặt vé HCM - Đà Lạt',
    },
    {
      id: 'TXN002',
      date: '2024-12-27',
      type: 'commission',
      amount: 18000,
      status: 'completed',
      company: 'Phương Trang',
      description: 'Hoa hồng 10%',
    },
    {
      id: 'TXN003',
      date: '2024-12-26',
      type: 'refund',
      amount: -144000,
      status: 'completed',
      company: 'Thanh Bưởi',
      description: 'Hoàn tiền hủy vé',
    },
    {
      id: 'TXN004',
      date: '2024-12-26',
      type: 'booking',
      amount: 220000,
      status: 'pending',
      company: 'Mai Linh',
      description: 'Đặt vé HCM - Cần Thơ',
    },
  ];

  const topCompanies = [
    { name: 'Phương Trang', revenue: 854000000, percentage: 30, bookings: 1245 },
    { name: 'Thanh Bưởi', revenue: 682000000, percentage: 24, bookings: 980 },
    { name: 'Mai Linh', revenue: 568000000, percentage: 20, bookings: 765 },
    { name: 'Hoàng Long', revenue: 426000000, percentage: 15, bookings: 567 },
    { name: 'Khác', revenue: 315000000, percentage: 11, bookings: 445 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'success';
      case 'refund':
        return 'error';
      case 'commission':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTransactionText = (type: string) => {
    switch (type) {
      case 'booking':
        return 'Đặt vé';
      case 'refund':
        return 'Hoàn tiền';
      case 'commission':
        return 'Hoa hồng';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="xl" disableGutters>

      {/* Filter Controls */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Thời gian</InputLabel>
              <Select
                value={selectedPeriod}
                label="Thời gian"
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <MenuItem value="week">7 ngày qua</MenuItem>
                <MenuItem value="month">30 ngày qua</MenuItem>
                <MenuItem value="quarter">3 tháng qua</MenuItem>
                <MenuItem value="year">1 năm qua</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Loại báo cáo</InputLabel>
              <Select
                value={selectedReport}
                label="Loại báo cáo"
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                <MenuItem value="revenue">Doanh thu</MenuItem>
                <MenuItem value="bookings">Đặt vé</MenuItem>
                <MenuItem value="companies">Nhà xe</MenuItem>
                <MenuItem value="users">Người dùng</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              fullWidth
              sx={{ height: 56 }}
            >
              Xuất báo cáo
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="contained"
              startIcon={<Assessment />}
              fullWidth
              sx={{
                height: 56,
                background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
              }}
            >
              Tạo báo cáo tùy chỉnh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Financial Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', mr: 2 }}>
                  <MonetizationOn />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Tổng doanh thu
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                {formatCurrency(currentStats.totalRevenue).slice(0, -2)}B
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tích lũy từ đầu năm
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#e8f5e8', color: '#2e7d32', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Doanh thu tháng
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
                {formatCurrency(currentStats.monthlyRevenue).slice(0, -2)}B
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +9.4% so với tháng trước
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#fff3e0', color: '#f57c00', mr: 2 }}>
                  <LocalShipping />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Tổng vé đặt
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00', mb: 1 }}>
                {currentStats.totalBookings.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tháng hiện tại
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2', mr: 2 }}>
                  <Receipt />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Giá trị TB/Đơn
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#7b1fa2', mb: 1 }}>
                {formatCurrency(currentStats.averageOrderValue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trung bình mỗi vé
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Revenue Analytics and Top Companies */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Biểu đồ doanh thu 4 tháng gần đây
            </Typography>
            {revenueData.map((item) => (
              <Box key={item.month} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {item.month}
                  </Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {formatCurrency(item.revenue).slice(0, -2)}B
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.bookings} vé • +{item.growth}%
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(item.revenue / Math.max(...revenueData.map(d => d.revenue))) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#f0f0f0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                    },
                  }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Top nhà xe theo doanh thu
            </Typography>
            {topCompanies.map((company, index) => (
              <Box key={company.name} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
                    {company.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {company.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {company.bookings} vé
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatCurrency(company.revenue).slice(0, -2)}M
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {company.percentage}%
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={company.percentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: '#f0f0f0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      background: `linear-gradient(135deg, hsl(${210 - index * 30}, 70%, 50%) 0%, hsl(${210 - index * 30}, 70%, 30%) 100%)`,
                    },
                  }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Commission and Refunds Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#e8f5e8', color: '#2e7d32', mr: 2 }}>
                  <AccountBalance />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Hoa hồng thu được
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
                {formatCurrency(currentStats.commission)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                15% từ doanh thu nhà xe
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#ffebee', color: '#d32f2f', mr: 2 }}>
                  <MonetizationOn />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Tổng hoàn tiền
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f', mb: 1 }}>
                {formatCurrency(currentStats.refunds)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3.1% tổng doanh thu
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Giao dịch gần đây
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Mã giao dịch</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ngày</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Loại</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nhà xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Số tiền</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {transaction.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(transaction.date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getTransactionText(transaction.type)}
                      color={getTransactionColor(transaction.type) as 'success' | 'error' | 'info' | 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24 }}>
                        <DirectionsBus fontSize="small" />
                      </Avatar>
                      <Typography variant="body2">
                        {transaction.company}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {transaction.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: transaction.amount > 0 ? 'success.main' : 'error.main'
                      }}
                    >
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(transaction.status)}
                      color={getStatusColor(transaction.status) as 'success' | 'warning' | 'error' | 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default FinanceReports; 