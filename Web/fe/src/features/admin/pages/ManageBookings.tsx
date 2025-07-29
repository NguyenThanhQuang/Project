import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Cancel,
  Info,
  Receipt,
  Person,
  DirectionsBus,
  CheckCircle,
  Warning,
  Block,
  Pending,
  AccountBalanceWallet,
} from '@mui/icons-material';

interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  tripRoute: string;
  tripDate: string;
  tripTime: string;
  companyId: string;
  companyName: string;
  vehicleNumber: string;
  seatNumbers: string[];
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'refunded' | 'completed';
  bookingDate: string;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  refundAmount?: number;
  refundDate?: string;
  cancelReason?: string;
}

const ManageBookings: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'details' | 'cancel' | 'refund' | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [cancelReason, setCancelReason] = useState<string>('');

  // Mock bookings data
  const bookings: Booking[] = [
    {
      id: '1',
      bookingCode: 'BK001',
      customerName: 'Nguyễn Văn An',
      customerPhone: '0123456789',
      customerEmail: 'an@email.com',
      tripRoute: 'TP.HCM - Đà Lạt',
      tripDate: '2024-12-28',
      tripTime: '06:00',
      companyId: '1',
      companyName: 'Phương Trang',
      vehicleNumber: '79B-12345',
      seatNumbers: ['A1', 'A2'],
      totalAmount: 360000,
      status: 'confirmed',
      bookingDate: '2024-12-25',
      paymentMethod: 'Thẻ tín dụng',
      paymentStatus: 'paid',
    },
    {
      id: '2',
      bookingCode: 'BK002',
      customerName: 'Trần Thị Bình',
      customerPhone: '0987654321',
      customerEmail: 'binh@email.com',
      tripRoute: 'TP.HCM - Cần Thơ',
      tripDate: '2024-12-28',
      tripTime: '08:30',
      companyId: '2',
      companyName: 'Thanh Bưởi',
      vehicleNumber: '30A-67890',
      seatNumbers: ['B5'],
      totalAmount: 120000,
      status: 'confirmed',
      bookingDate: '2024-12-26',
      paymentMethod: 'Ví điện tử',
      paymentStatus: 'paid',
    },
    {
      id: '3',
      bookingCode: 'BK003',
      customerName: 'Lê Văn Cường',
      customerPhone: '0111222333',
      customerEmail: 'cuong@email.com',
      tripRoute: 'TP.HCM - Nha Trang',
      tripDate: '2024-12-27',
      tripTime: '22:00',
      companyId: '3',
      companyName: 'Mai Linh',
      vehicleNumber: '86C-11111',
      seatNumbers: ['C3', 'C4'],
      totalAmount: 600000,
      status: 'completed',
      bookingDate: '2024-12-23',
      paymentMethod: 'Thẻ tín dụng',
      paymentStatus: 'paid',
    },
    {
      id: '4',
      bookingCode: 'BK004',
      customerName: 'Phạm Thị Dung',
      customerPhone: '0444555666',
      customerEmail: 'dung@email.com',
      tripRoute: 'TP.HCM - Vũng Tàu',
      tripDate: '2024-12-27',
      tripTime: '14:00',
      companyId: '4',
      companyName: 'Hoàng Long',
      vehicleNumber: '92D-22222',
      seatNumbers: ['D8'],
      totalAmount: 80000,
      status: 'cancelled',
      bookingDate: '2024-12-24',
      paymentMethod: 'Chuyển khoản',
      paymentStatus: 'refunded',
      refundAmount: 80000,
      refundDate: '2024-12-27',
      cancelReason: 'Khách hàng hủy do thay đổi lịch trình',
    },
    {
      id: '5',
      bookingCode: 'BK005',
      customerName: 'Hoàng Văn Em',
      customerPhone: '0777888999',
      customerEmail: 'em@email.com',
      tripRoute: 'TP.HCM - Đà Nẵng',
      tripDate: '2024-12-28',
      tripTime: '20:00',
      companyId: '1',
      companyName: 'Phương Trang',
      vehicleNumber: '79B-54321',
      seatNumbers: ['A10', 'A11'],
      totalAmount: 440000,
      status: 'confirmed',
      bookingDate: '2024-12-25',
      paymentMethod: 'Tiền mặt',
      paymentStatus: 'paid',
    },
  ];

  const companies = [
    { id: '1', name: 'Phương Trang' },
    { id: '2', name: 'Thanh Bưởi' },
    { id: '3', name: 'Mai Linh' },
    { id: '4', name: 'Hoàng Long' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'refunded':
        return 'warning';
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
      case 'cancelled':
        return 'Đã hủy';
      case 'refunded':
        return 'Đã hoàn tiền';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  };

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

  const getFilteredBookings = () => {
    let filtered = bookings;
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(booking => booking.status === activeTab);
    }
    
    // Filter by company
    if (companyFilter !== 'all') {
      filtered = filtered.filter(booking => booking.companyId === companyFilter);
    }
    
    // Filter by date
    if (dateFilter !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      if (dateFilter === 'today') {
        filtered = filtered.filter(booking => booking.bookingDate === today);
      } else if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(booking => new Date(booking.bookingDate) >= weekAgo);
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerPhone.includes(searchTerm) ||
        booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.tripRoute.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredBookings = getFilteredBookings();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, booking: Booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleAction = (type: 'details' | 'cancel' | 'refund') => {
    setActionType(type);
    setActionDialogOpen(true);
    if (type === 'refund' && selectedBooking) {
      setRefundAmount(selectedBooking.totalAmount);
    }
    handleMenuClose();
  };

  const confirmAction = () => {
    // Handle action logic here
    console.log(`${actionType} booking:`, selectedBooking?.bookingCode);
    if (actionType === 'cancel') {
      console.log('Cancel reason:', cancelReason);
    } else if (actionType === 'refund') {
      console.log('Refund amount:', refundAmount);
    }
    setActionDialogOpen(false);
    setActionType(null);
    setSelectedBooking(null);
    setRefundAmount(0);
    setCancelReason('');
  };

  // Calculate stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const refundedBookings = bookings.filter(b => b.status === 'refunded').length;

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                {totalBookings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số booking
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}>
                {confirmedBookings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã xác nhận
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3', mb: 1 }}>
                {completedBookings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hoàn thành
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336', mb: 1 }}>
                {cancelledBookings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã hủy
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Tabs */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
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
            icon={<Receipt />}
            iconPosition="start"
            label={`Tất cả (${totalBookings})`}
            value="all"
          />
          <Tab
            icon={<CheckCircle />}
            iconPosition="start"
            label={`Đã xác nhận (${confirmedBookings})`}
            value="confirmed"
          />
          <Tab
            icon={<Pending />}
            iconPosition="start"
            label={`Hoàn thành (${completedBookings})`}
            value="completed"
          />
          <Tab
            icon={<Block />}
            iconPosition="start"
            label={`Đã hủy (${cancelledBookings})`}
            value="cancelled"
          />
          <Tab
            icon={<AccountBalanceWallet />}
            iconPosition="start"
            label={`Hoàn tiền (${refundedBookings})`}
            value="refunded"
          />
        </Tabs>
      </Paper>

      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              placeholder="Tìm kiếm booking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Nhà xe</InputLabel>
              <Select
                value={companyFilter}
                label="Nhà xe"
                onChange={(e) => setCompanyFilter(e.target.value)}
              >
                <SelectMenuItem value="all">Tất cả nhà xe</SelectMenuItem>
                {companies.map((company) => (
                  <SelectMenuItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectMenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Thời gian</InputLabel>
              <Select
                value={dateFilter}
                label="Thời gian"
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <SelectMenuItem value="all">Tất cả</SelectMenuItem>
                <SelectMenuItem value="today">Hôm nay</SelectMenuItem>
                <SelectMenuItem value="week">7 ngày qua</SelectMenuItem>
                <SelectMenuItem value="month">30 ngày qua</SelectMenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Bookings Table */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Mã booking</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Khách hàng</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Chuyến xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nhà xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ghế</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tổng tiền</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Thanh toán</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ngày đặt</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking) => (
                  <TableRow key={booking.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Receipt />
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {booking.bookingCode}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {booking.customerName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.customerPhone}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.customerEmail}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {booking.tripRoute}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(booking.tripDate)} - {booking.tripTime}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {booking.companyName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.vehicleNumber}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {booking.seatNumbers.join(', ')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.seatNumbers.length} ghế
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(booking.totalAmount)}
                      </Typography>
                      {booking.refundAmount && (
                        <Typography variant="body2" color="text.secondary">
                          Hoàn: {formatCurrency(booking.refundAmount)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(booking.status)}
                        color={getStatusColor(booking.status) as 'success' | 'error' | 'warning' | 'info' | 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getPaymentStatusText(booking.paymentStatus)}
                        color={getPaymentStatusColor(booking.paymentStatus) as 'success' | 'warning' | 'info' | 'default'}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {booking.paymentMethod}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(booking.bookingDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, booking)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang"
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('details')}>
          <Info sx={{ mr: 2 }} />
          Xem chi tiết
        </MenuItem>
        {selectedBooking?.status === 'confirmed' && (
          <>
            <MenuItem onClick={() => handleAction('cancel')}>
              <Cancel sx={{ mr: 2 }} />
              Hủy booking
            </MenuItem>
            <MenuItem onClick={() => handleAction('refund')}>
              <AccountBalanceWallet sx={{ mr: 2 }} />
              Hoàn tiền
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Action Dialog */}
      <Dialog 
        open={actionDialogOpen} 
        onClose={() => setActionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {actionType === 'details' && 'Chi tiết booking'}
          {actionType === 'cancel' && 'Hủy booking'}
          {actionType === 'refund' && 'Hoàn tiền'}
        </DialogTitle>
        <DialogContent>
          {actionType === 'details' && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography><strong>Mã booking:</strong> {selectedBooking?.bookingCode}</Typography>
                  <Typography><strong>Khách hàng:</strong> {selectedBooking?.customerName}</Typography>
                  <Typography><strong>Điện thoại:</strong> {selectedBooking?.customerPhone}</Typography>
                  <Typography><strong>Email:</strong> {selectedBooking?.customerEmail}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography><strong>Chuyến:</strong> {selectedBooking?.tripRoute}</Typography>
                  <Typography><strong>Ngày:</strong> {formatDate(selectedBooking?.tripDate || '')}</Typography>
                  <Typography><strong>Giờ:</strong> {selectedBooking?.tripTime}</Typography>
                  <Typography><strong>Nhà xe:</strong> {selectedBooking?.companyName}</Typography>
                  <Typography><strong>Xe:</strong> {selectedBooking?.vehicleNumber}</Typography>
                  <Typography><strong>Ghế:</strong> {selectedBooking?.seatNumbers.join(', ')}</Typography>
                  <Typography><strong>Tổng tiền:</strong> {formatCurrency(selectedBooking?.totalAmount || 0)}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          {actionType === 'cancel' && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 2 }}>
                Bạn có chắc chắn muốn hủy booking {selectedBooking?.bookingCode}?
              </Typography>
              <TextField
                fullWidth
                label="Lý do hủy"
                multiline
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy booking..."
              />
            </Box>
          )}
          {actionType === 'refund' && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 2 }}>
                Hoàn tiền cho booking {selectedBooking?.bookingCode}
              </Typography>
              <TextField
                fullWidth
                label="Số tiền hoàn"
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Tổng tiền booking: {formatCurrency(selectedBooking?.totalAmount || 0)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Đóng</Button>
          {actionType !== 'details' && (
            <Button onClick={confirmAction} variant="contained" color="primary">
              Xác nhận
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageBookings; 