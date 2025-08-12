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
  Edit,
  Cancel,
  Info,
  DirectionsBus,
  Schedule,
  Event,
  CheckCircle,
  Warning,
  Block,
  Pending,
} from '@mui/icons-material';

interface Trip {
  id: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  companyId: string;
  companyName: string;
  vehicleNumber: string;
  vehicleType: string;
  seatCount: number;
  bookedSeats: number;
  availableSeats: number;
  price: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  revenue: number;
  rating: number;
}

const ManageTrips: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'edit' | 'cancel' | 'details' | null>(null);

  // Mock trips data
  const trips: Trip[] = [
    {
      id: '1',
      route: 'TP.HCM - Đà Lạt',
      departureTime: '06:00',
      arrivalTime: '12:00',
      date: '2024-12-28',
      companyId: '1',
      companyName: 'Phương Trang',
      vehicleNumber: '79B-12345',
      vehicleType: 'Giường nằm',
      seatCount: 40,
      bookedSeats: 35,
      availableSeats: 5,
      price: 180000,
      status: 'scheduled',
      revenue: 6300000,
      rating: 4.5,
    },
    {
      id: '2',
      route: 'TP.HCM - Cần Thơ',
      departureTime: '08:30',
      arrivalTime: '12:30',
      date: '2024-12-28',
      companyId: '2',
      companyName: 'Thanh Bưởi',
      vehicleNumber: '30A-67890',
      vehicleType: 'Ghế ngồi',
      seatCount: 45,
      bookedSeats: 42,
      availableSeats: 3,
      price: 120000,
      status: 'in_progress',
      revenue: 5040000,
      rating: 4.2,
    },
    {
      id: '3',
      route: 'TP.HCM - Nha Trang',
      departureTime: '22:00',
      arrivalTime: '06:00',
      date: '2024-12-27',
      companyId: '3',
      companyName: 'Mai Linh',
      vehicleNumber: '86C-11111',
      vehicleType: 'Limousine',
      seatCount: 24,
      bookedSeats: 24,
      availableSeats: 0,
      price: 300000,
      status: 'completed',
      revenue: 7200000,
      rating: 4.7,
    },
    {
      id: '4',
      route: 'TP.HCM - Vũng Tàu',
      departureTime: '14:00',
      arrivalTime: '17:00',
      date: '2024-12-27',
      companyId: '4',
      companyName: 'Hoàng Long',
      vehicleNumber: '92D-22222',
      vehicleType: 'Ghế ngồi',
      seatCount: 32,
      bookedSeats: 12,
      availableSeats: 20,
      price: 80000,
      status: 'cancelled',
      revenue: 0,
      rating: 0,
    },
    {
      id: '5',
      route: 'TP.HCM - Đà Nẵng',
      departureTime: '20:00',
      arrivalTime: '08:00',
      date: '2024-12-28',
      companyId: '1',
      companyName: 'Phương Trang',
      vehicleNumber: '79B-54321',
      vehicleType: 'Giường nằm',
      seatCount: 40,
      bookedSeats: 28,
      availableSeats: 12,
      price: 220000,
      status: 'scheduled',
      revenue: 6160000,
      rating: 4.4,
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
      case 'scheduled':
        return 'info';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Đã lên lịch';
      case 'in_progress':
        return 'Đang chạy';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
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

  const getFilteredTrips = () => {
    let filtered = trips;
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(trip => trip.status === activeTab);
    }
    
    // Filter by company
    if (companyFilter !== 'all') {
      filtered = filtered.filter(trip => trip.companyId === companyFilter);
    }
    
    // Filter by date
    const today = new Date().toISOString().split('T')[0];
    if (dateFilter === 'today') {
      filtered = filtered.filter(trip => trip.date === today);
    } else if (dateFilter === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      filtered = filtered.filter(trip => trip.date === tomorrow.toISOString().split('T')[0]);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(trip =>
        trip.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredTrips = getFilteredTrips();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, trip: Trip) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrip(trip);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTrip(null);
  };

  const handleAction = (type: 'edit' | 'cancel' | 'details') => {
    setActionType(type);
    setActionDialogOpen(true);
    handleMenuClose();
  };

  const confirmAction = () => {
    // Handle action logic here
    console.log(`${actionType} trip:`, selectedTrip?.id);
    setActionDialogOpen(false);
    setActionType(null);
    setSelectedTrip(null);
  };

  // Calculate stats
  const totalTrips = trips.length;
  const scheduledTrips = trips.filter(t => t.status === 'scheduled').length;
  const inProgressTrips = trips.filter(t => t.status === 'in_progress').length;
  const completedTrips = trips.filter(t => t.status === 'completed').length;
  const cancelledTrips = trips.filter(t => t.status === 'cancelled').length;

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                {totalTrips}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số chuyến
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3', mb: 1 }}>
                {scheduledTrips}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã lên lịch
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800', mb: 1 }}>
                {inProgressTrips}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang chạy
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}>
                {completedTrips}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hoàn thành
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
            icon={<DirectionsBus />}
            iconPosition="start"
            label={`Tất cả (${totalTrips})`}
            value="all"
          />
          <Tab
            icon={<Pending />}
            iconPosition="start"
            label={`Đã lên lịch (${scheduledTrips})`}
            value="scheduled"
          />
          <Tab
            icon={<Warning />}
            iconPosition="start"
            label={`Đang chạy (${inProgressTrips})`}
            value="in_progress"
          />
          <Tab
            icon={<CheckCircle />}
            iconPosition="start"
            label={`Hoàn thành (${completedTrips})`}
            value="completed"
          />
          <Tab
            icon={<Block />}
            iconPosition="start"
            label={`Đã hủy (${cancelledTrips})`}
            value="cancelled"
          />
        </Tabs>
      </Paper>

      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              placeholder="Tìm kiếm chuyến..."
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
              <InputLabel>Ngày</InputLabel>
              <Select
                value={dateFilter}
                label="Ngày"
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <SelectMenuItem value="all">Tất cả</SelectMenuItem>
                <SelectMenuItem value="today">Hôm nay</SelectMenuItem>
                <SelectMenuItem value="tomorrow">Ngày mai</SelectMenuItem>
                <SelectMenuItem value="week">Tuần này</SelectMenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Trips Table */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Tuyến đường</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nhà xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Thời gian</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ngày</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ghế</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Giá vé</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Doanh thu</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTrips
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((trip) => (
                  <TableRow key={trip.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <DirectionsBus />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {trip.route}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ⭐ {trip.rating}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {trip.companyName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {trip.departureTime} - {trip.arrivalTime}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(trip.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {trip.vehicleNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {trip.vehicleType}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {trip.bookedSeats}/{trip.seatCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Còn {trip.availableSeats}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(trip.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(trip.status)}
                        color={getStatusColor(trip.status) as 'info' | 'warning' | 'success' | 'error' | 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(trip.revenue)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, trip)}>
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
          count={filteredTrips.length}
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
        <MenuItem onClick={() => handleAction('edit')}>
          <Edit sx={{ mr: 2 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={() => handleAction('cancel')}>
          <Cancel sx={{ mr: 2 }} />
          Hủy chuyến
        </MenuItem>
      </Menu>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
        <DialogTitle>
          {actionType === 'details' && 'Chi tiết chuyến xe'}
          {actionType === 'edit' && 'Chỉnh sửa chuyến xe'}
          {actionType === 'cancel' && 'Hủy chuyến xe'}
        </DialogTitle>
        <DialogContent>
          {actionType === 'details' && (
            <Box sx={{ mt: 2 }}>
              <Typography><strong>Tuyến:</strong> {selectedTrip?.route}</Typography>
              <Typography><strong>Nhà xe:</strong> {selectedTrip?.companyName}</Typography>
              <Typography><strong>Xe:</strong> {selectedTrip?.vehicleNumber} - {selectedTrip?.vehicleType}</Typography>
              <Typography><strong>Ghế đã đặt:</strong> {selectedTrip?.bookedSeats}/{selectedTrip?.seatCount}</Typography>
              <Typography><strong>Doanh thu:</strong> {formatCurrency(selectedTrip?.revenue || 0)}</Typography>
            </Box>
          )}
          {actionType === 'edit' && (
            <Typography>
              Bạn có muốn chỉnh sửa thông tin chuyến xe {selectedTrip?.route} vào ngày {formatDate(selectedTrip?.date || '')}?
            </Typography>
          )}
          {actionType === 'cancel' && (
            <Typography>
              Bạn có chắc chắn muốn hủy chuyến xe {selectedTrip?.route} vào ngày {formatDate(selectedTrip?.date || '')}? 
              Tất cả các booking sẽ được hoàn tiền.
            </Typography>
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

export default ManageTrips; 