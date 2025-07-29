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
  Add,
  MoreVert,
  Edit,
  Delete,
  DirectionsBus,
  AirlineSeatReclineNormal,
  Hotel,
  LocalGasStation,
  Settings,
  CheckCircle,
  Warning,
  Block,
} from '@mui/icons-material';

interface Vehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: 'Giường nằm' | 'Ghế ngồi' | 'Limousine';
  seatCount: number;
  companyId: string;
  companyName: string;
  status: 'active' | 'maintenance' | 'inactive';
  registrationDate: string;
  lastMaintenanceDate: string;
  totalTrips: number;
  totalRevenue: number;
  rating: number;
  amenities: string[];
  fuel: 'Diesel' | 'Gasoline' | 'Electric';
  yearOfManufacture: number;
}

const ManageVehicles: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'edit' | 'delete' | 'maintenance' | null>(null);

  // Mock vehicles data
  const vehicles: Vehicle[] = [
    {
      id: '1',
      vehicleNumber: '79B-12345',
      vehicleType: 'Giường nằm',
      seatCount: 40,
      companyId: '1',
      companyName: 'Phương Trang',
      status: 'active',
      registrationDate: '2022-01-15',
      lastMaintenanceDate: '2024-12-01',
      totalTrips: 245,
      totalRevenue: 125000000,
      rating: 4.5,
      amenities: ['WiFi', 'Điều hòa', 'Tivi', 'Nước uống'],
      fuel: 'Diesel',
      yearOfManufacture: 2022,
    },
    {
      id: '2',
      vehicleNumber: '30A-67890',
      vehicleType: 'Ghế ngồi',
      seatCount: 45,
      companyId: '2',
      companyName: 'Thanh Bưởi',
      status: 'active',
      registrationDate: '2021-05-20',
      lastMaintenanceDate: '2024-11-15',
      totalTrips: 189,
      totalRevenue: 89000000,
      rating: 4.2,
      amenities: ['WiFi', 'Điều hòa', 'Nước uống'],
      fuel: 'Diesel',
      yearOfManufacture: 2021,
    },
    {
      id: '3',
      vehicleNumber: '86C-11111',
      vehicleType: 'Limousine',
      seatCount: 24,
      companyId: '3',
      companyName: 'Mai Linh',
      status: 'maintenance',
      registrationDate: '2023-03-10',
      lastMaintenanceDate: '2024-12-20',
      totalTrips: 67,
      totalRevenue: 45000000,
      rating: 4.7,
      amenities: ['WiFi', 'Điều hòa', 'Tivi', 'Nước uống', 'Massage'],
      fuel: 'Diesel',
      yearOfManufacture: 2023,
    },
    {
      id: '4',
      vehicleNumber: '92D-22222',
      vehicleType: 'Giường nằm',
      seatCount: 32,
      companyId: '4',
      companyName: 'Hoàng Long',
      status: 'inactive',
      registrationDate: '2020-08-12',
      lastMaintenanceDate: '2024-10-05',
      totalTrips: 156,
      totalRevenue: 78000000,
      rating: 3.8,
      amenities: ['WiFi', 'Điều hòa'],
      fuel: 'Diesel',
      yearOfManufacture: 2020,
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
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'maintenance':
        return 'Bảo trì';
      case 'inactive':
        return 'Ngừng hoạt động';
      default:
        return status;
    }
  };

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case 'Giường nằm':
        return <Hotel />;
      case 'Ghế ngồi':
        return <AirlineSeatReclineNormal />;
      case 'Limousine':
        return <DirectionsBus />;
      default:
        return <DirectionsBus />;
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

  const getFilteredVehicles = () => {
    let filtered = vehicles;
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === activeTab);
    }
    
    // Filter by company
    if (companyFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.companyId === companyFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredVehicles = getFilteredVehicles();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, vehicle: Vehicle) => {
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(vehicle);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVehicle(null);
  };

  const handleAction = (type: 'edit' | 'delete' | 'maintenance') => {
    setActionType(type);
    setActionDialogOpen(true);
    handleMenuClose();
  };

  const confirmAction = () => {
    // Handle action logic here
    console.log(`${actionType} vehicle:`, selectedVehicle?.vehicleNumber);
    setActionDialogOpen(false);
    setActionType(null);
    setSelectedVehicle(null);
  };

  // Calculate stats
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const inactiveVehicles = vehicles.filter(v => v.status === 'inactive').length;

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                {totalVehicles}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số xe
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
                {activeVehicles}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang hoạt động
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00', mb: 1 }}>
                {maintenanceVehicles}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang bảo trì
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f', mb: 1 }}>
                {inactiveVehicles}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ngừng hoạt động
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
            icon={<DirectionsBus />}
            iconPosition="start"
            label={`Tất cả (${totalVehicles})`}
            value="all"
          />
          <Tab
            icon={<CheckCircle />}
            iconPosition="start"
            label={`Hoạt động (${activeVehicles})`}
            value="active"
          />
          <Tab
            icon={<Warning />}
            iconPosition="start"
            label={`Bảo trì (${maintenanceVehicles})`}
            value="maintenance"
          />
          <Tab
            icon={<Block />}
            iconPosition="start"
            label={`Ngừng hoạt động (${inactiveVehicles})`}
            value="inactive"
          />
        </Tabs>
      </Paper>

      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              placeholder="Tìm kiếm xe..."
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
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                }}
              >
                Thêm xe mới
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Vehicles Table */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Thông tin xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nhà xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Loại xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Số ghế</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Bảo trì cuối</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tổng chuyến</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Doanh thu</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Đánh giá</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVehicles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((vehicle) => (
                  <TableRow key={vehicle.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getVehicleTypeIcon(vehicle.vehicleType)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {vehicle.vehicleNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {vehicle.yearOfManufacture} - {vehicle.fuel}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {vehicle.companyName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {vehicle.vehicleType}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {vehicle.seatCount} ghế
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(vehicle.status)}
                        color={getStatusColor(vehicle.status) as 'success' | 'warning' | 'error' | 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(vehicle.lastMaintenanceDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {vehicle.totalTrips}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(vehicle.totalRevenue)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ⭐ {vehicle.rating}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, vehicle)}>
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
          count={filteredVehicles.length}
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
        <MenuItem onClick={() => handleAction('edit')}>
          <Edit sx={{ mr: 2 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={() => handleAction('maintenance')}>
          <Settings sx={{ mr: 2 }} />
          Bảo trì
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')}>
          <Delete sx={{ mr: 2 }} />
          Xóa
        </MenuItem>
      </Menu>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
        <DialogTitle>
          {actionType === 'edit' && 'Chỉnh sửa xe'}
          {actionType === 'maintenance' && 'Đưa xe vào bảo trì'}
          {actionType === 'delete' && 'Xóa xe'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === 'edit' && `Bạn có muốn chỉnh sửa thông tin xe ${selectedVehicle?.vehicleNumber}?`}
            {actionType === 'maintenance' && `Bạn có muốn đưa xe ${selectedVehicle?.vehicleNumber} vào bảo trì?`}
            {actionType === 'delete' && `Bạn có chắc chắn muốn xóa xe ${selectedVehicle?.vehicleNumber}? Thao tác này không thể hoàn tác.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Hủy</Button>
          <Button onClick={confirmAction} variant="contained" color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageVehicles; 