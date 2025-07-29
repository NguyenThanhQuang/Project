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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  Edit,
  Block,
  CheckCircle,
  Person,
  Phone,
  Email,
  LocationOn,
  DateRange,
  History,
  Timer,
} from '@mui/icons-material';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  lastLoginDate: string;
  status: 'active' | 'inactive' | 'banned';
  totalBookings: number;
  totalSpent: number;
  avatar?: string;
}

const ManageUsers: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'ban' | 'unban' | 'activate' | null>(null);

  // Mock users data
  const users: User[] = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      email: 'nguyen.van.an@email.com',
      phone: '0123456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      registrationDate: '2023-01-15',
      lastLoginDate: '2024-12-27',
      status: 'active',
      totalBookings: 25,
      totalSpent: 4500000,
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      email: 'tran.thi.binh@email.com',
      phone: '0987654321',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      registrationDate: '2023-02-20',
      lastLoginDate: '2024-12-26',
      status: 'active',
      totalBookings: 18,
      totalSpent: 3200000,
    },
    {
      id: '3',
      name: 'Lê Văn Cường',
      email: 'le.van.cuong@email.com',
      phone: '0111222333',
      address: '789 Đường DEF, Quận 3, TP.HCM',
      registrationDate: '2023-03-10',
      lastLoginDate: '2024-12-20',
      status: 'inactive',
      totalBookings: 5,
      totalSpent: 850000,
    },
    {
      id: '4',
      name: 'Phạm Thị Dung',
      email: 'pham.thi.dung@email.com',
      phone: '0444555666',
      address: '321 Đường GHI, Quận 4, TP.HCM',
      registrationDate: '2023-01-05',
      lastLoginDate: '2024-11-15',
      status: 'banned',
      totalBookings: 12,
      totalSpent: 2100000,
    },
    {
      id: '5',
      name: 'Hoàng Văn Em',
      email: 'hoang.van.em@email.com',
      phone: '0777888999',
      address: '654 Đường JKL, Quận 5, TP.HCM',
      registrationDate: '2023-04-12',
      lastLoginDate: '2024-12-25',
      status: 'active',
      totalBookings: 32,
      totalSpent: 6800000,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'banned':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      case 'banned':
        return 'Bị cấm';
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

  const getFilteredUsers = () => {
    let filtered = users;
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(user => user.status === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }
    
    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleAction = (type: 'ban' | 'unban' | 'activate') => {
    setActionType(type);
    setActionDialogOpen(true);
    handleMenuClose();
  };

  const confirmAction = () => {
    // Handle action logic here
    console.log(`${actionType} user:`, selectedUser?.name);
    setActionDialogOpen(false);
    setActionType(null);
    setSelectedUser(null);
  };

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  const bannedUsers = users.filter(u => u.status === 'banned').length;

  return (
    <Container maxWidth="xl" disableGutters>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                {totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số người dùng
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
                {activeUsers}
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
                {inactiveUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Không hoạt động
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f', mb: 1 }}>
                {bannedUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bị cấm
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
            icon={<History />}
            iconPosition="start"
            label={`Tất cả (${totalUsers})`}
            value="all"
          />
          <Tab
            icon={<CheckCircle />}
            iconPosition="start"
            label={`Hoạt động (${activeUsers})`}
            value="active"
          />
          <Tab
            icon={<Timer />}
            iconPosition="start"
            label={`Không hoạt động (${inactiveUsers})`}
            value="inactive"
          />
          <Tab
            icon={<Block />}
            iconPosition="start"
            label={`Bị cấm (${bannedUsers})`}
            value="banned"
          />
        </Tabs>
      </Paper>

      {/* Search and Actions */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            placeholder="Tìm kiếm người dùng..."
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
            Thêm người dùng
          </Button>
        </Box>
      </Paper>

      {/* Users Table */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Người dùng</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Liên hệ</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Địa chỉ</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ngày đăng ký</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Lần đăng nhập cuối</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Số vé đã đặt</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tổng chi tiêu</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2">{user.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone fontSize="small" color="action" />
                          <Typography variant="body2">{user.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          {user.address}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DateRange fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDate(user.registrationDate)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(user.lastLoginDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(user.status)}
                        color={getStatusColor(user.status) as 'success' | 'warning' | 'error' | 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.totalBookings}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(user.totalSpent)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, user)}>
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
          count={filteredUsers.length}
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
        {selectedUser?.status === 'active' && (
          <MenuItem onClick={() => handleAction('ban')} sx={{ color: 'error.main' }}>
            <Block sx={{ mr: 1 }} />
            Cấm tài khoản
          </MenuItem>
        )}
        {selectedUser?.status === 'banned' && (
          <MenuItem onClick={() => handleAction('unban')} sx={{ color: 'success.main' }}>
            <CheckCircle sx={{ mr: 1 }} />
            Bỏ cấm
          </MenuItem>
        )}
        {selectedUser?.status === 'inactive' && (
          <MenuItem onClick={() => handleAction('activate')} sx={{ color: 'success.main' }}>
            <CheckCircle sx={{ mr: 1 }} />
            Kích hoạt
          </MenuItem>
        )}
      </Menu>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
        <DialogTitle>
          Xác nhận {actionType === 'ban' ? 'cấm tài khoản' : actionType === 'unban' ? 'bỏ cấm' : 'kích hoạt'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn {actionType === 'ban' ? 'cấm tài khoản' : actionType === 'unban' ? 'bỏ cấm' : 'kích hoạt'} người dùng{' '}
            <strong>{selectedUser?.name}</strong> không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>
            Hủy
          </Button>
          <Button 
            onClick={confirmAction} 
            color={actionType === 'ban' ? 'error' : 'success'} 
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageUsers; 