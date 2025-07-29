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
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  Edit,
  Block,
  CheckCircle,
  DirectionsBus,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

interface Company {
  id: string;
  name: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  status: 'active' | 'pending' | 'suspended';
  totalTrips: number;
  totalRevenue: number;
  rating: number;
}

const ManageCompanies: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'suspend' | 'activate' | null>(null);

  // Mock companies data
  const companies: Company[] = [
    {
      id: '1',
      name: 'Phương Trang',
      logo: 'PT',
      email: 'contact@phuongtrang.vn',
      phone: '0123456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      registrationDate: '2023-01-15',
      status: 'active',
      totalTrips: 1245,
      totalRevenue: 2500000000,
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Thanh Bưởi',
      logo: 'TB',
      email: 'info@thanhbuoi.com',
      phone: '0987654321',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      registrationDate: '2023-02-20',
      status: 'active',
      totalTrips: 980,
      totalRevenue: 1800000000,
      rating: 4.2,
    },
    {
      id: '3',
      name: 'Mai Linh',
      logo: 'ML',
      email: 'support@mailinh.vn',
      phone: '0111222333',
      address: '789 Đường DEF, Quận 3, TP.HCM',
      registrationDate: '2023-03-10',
      status: 'pending',
      totalTrips: 0,
      totalRevenue: 0,
      rating: 0,
    },
    {
      id: '4',
      name: 'Hoàng Long',
      logo: 'HL',
      email: 'admin@hoanglong.com.vn',
      phone: '0444555666',
      address: '321 Đường GHI, Quận 4, TP.HCM',
      registrationDate: '2023-01-05',
      status: 'suspended',
      totalTrips: 567,
      totalRevenue: 890000000,
      rating: 3.8,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'pending':
        return 'Chờ duyệt';
      case 'suspended':
        return 'Tạm ngưng';
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

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.phone.includes(searchTerm)
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, company: Company) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompany(company);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCompany(null);
  };

  const handleAction = (type: 'suspend' | 'activate') => {
    setActionType(type);
    setActionDialogOpen(true);
    handleMenuClose();
  };

  const confirmAction = () => {
    // Handle action logic here
    console.log(`${actionType} company:`, selectedCompany?.name);
    setActionDialogOpen(false);
    setActionType(null);
    setSelectedCompany(null);
  };

  // Calculate stats
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.status === 'active').length;
  const pendingCompanies = companies.filter(c => c.status === 'pending').length;
  const suspendedCompanies = companies.filter(c => c.status === 'suspended').length;

  return (
    <Container maxWidth="xl" disableGutters>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                {totalCompanies}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số nhà xe
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
                {activeCompanies}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang hoạt động
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00', mb: 1 }}>
                {pendingCompanies}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chờ duyệt
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f', mb: 1 }}>
                {suspendedCompanies}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tạm ngưng
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Actions */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            placeholder="Tìm kiếm nhà xe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
            }}
          >
            Thêm nhà xe mới
          </Button>
        </Box>
      </Paper>

      {/* Companies Table */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Nhà xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Liên hệ</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Địa chỉ</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ngày đăng ký</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Số chuyến</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Doanh thu</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Đánh giá</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompanies
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((company) => (
                  <TableRow key={company.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {company.logo}
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {company.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2">{company.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone fontSize="small" color="action" />
                          <Typography variant="body2">{company.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          {company.address}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(company.registrationDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(company.status)}
                        color={getStatusColor(company.status) as 'success' | 'warning' | 'error' | 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {company.totalTrips.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {company.totalRevenue > 0 ? formatCurrency(company.totalRevenue).slice(0, -2) + 'M' : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {company.rating > 0 ? `${company.rating}/5` : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, company)}>
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
          count={filteredCompanies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        {selectedCompany?.status === 'active' && (
          <MenuItem onClick={() => handleAction('suspend')} sx={{ color: 'error.main' }}>
            <Block sx={{ mr: 1 }} />
            Tạm ngưng
          </MenuItem>
        )}
        {selectedCompany?.status !== 'active' && (
          <MenuItem onClick={() => handleAction('activate')} sx={{ color: 'success.main' }}>
            <CheckCircle sx={{ mr: 1 }} />
            Kích hoạt
          </MenuItem>
        )}
      </Menu>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
        <DialogTitle>
          Xác nhận {actionType === 'suspend' ? 'tạm ngưng' : 'kích hoạt'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn {actionType === 'suspend' ? 'tạm ngưng' : 'kích hoạt'} nhà xe{' '}
            <strong>{selectedCompany?.name}</strong> không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>
            Hủy
          </Button>
          <Button 
            onClick={confirmAction} 
            color={actionType === 'suspend' ? 'error' : 'success'} 
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageCompanies; 