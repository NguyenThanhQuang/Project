import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Tabs,
  Tab,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
} from '@mui/material';
import {
  Security,
  Notifications,
  Payment,
  Email,
  Backup,
  Settings,
  Edit,
  Save,
  Refresh,
  Warning,
  CheckCircle,
  Info,
  Delete,
  Add,
} from '@mui/icons-material';

interface SystemConfig {
  maintenanceMode: boolean;
  autoBackup: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  twoFactorAuth: boolean;
  publicRegistration: boolean;
}

interface PaymentConfig {
  vnpayEnabled: boolean;
  momoEnabled: boolean;
  zalopayEnabled: boolean;
  commissionRate: number;
  refundPolicy: number;
}

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    maintenanceMode: false,
    autoBackup: true,
    emailNotifications: true,
    smsNotifications: true,
    twoFactorAuth: true,
    publicRegistration: true,
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    vnpayEnabled: true,
    momoEnabled: true,
    zalopayEnabled: true,
    commissionRate: 15,
    refundPolicy: 24,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'admin@busapp.com',
    smtpPassword: '••••••••',
  });

  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [addAdminDialogOpen, setAddAdminDialogOpen] = useState(false);

  const handleSystemConfigChange = (key: keyof SystemConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSystemConfig(prev => ({
      ...prev,
      [key]: event.target.checked,
    }));
  };

  const handlePaymentConfigChange = (key: keyof PaymentConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (key === 'commissionRate' || key === 'refundPolicy') {
      setPaymentConfig(prev => ({
        ...prev,
        [key]: Number(event.target.value),
      }));
    } else {
      setPaymentConfig(prev => ({
        ...prev,
        [key]: event.target.checked,
      }));
    }
  };

  const handleEmailSettingsChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailSettings(prev => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log('Saving settings...');
  };

  const handleBackupNow = () => {
    setBackupDialogOpen(false);
    // Trigger backup logic here
    console.log('Starting backup...');
  };

  const adminUsers = [
    { id: '1', name: 'Super Admin', email: 'admin@busapp.com', role: 'Super Admin', lastLogin: '2024-12-27' },
    { id: '2', name: 'Quản lý Tài chính', email: 'finance@busapp.com', role: 'Finance Manager', lastLogin: '2024-12-26' },
    { id: '3', name: 'Quản lý Hệ thống', email: 'system@busapp.com', role: 'System Manager', lastLogin: '2024-12-25' },
  ];

  const systemLogs = [
    { time: '2024-12-27 15:30:22', type: 'info', message: 'Hệ thống backup thành công' },
    { time: '2024-12-27 14:15:10', type: 'warning', message: 'Tải cao trên server, thời gian phản hồi chậm' },
    { time: '2024-12-27 13:45:33', type: 'error', message: 'Lỗi kết nối database tạm thời' },
    { time: '2024-12-27 12:20:55', type: 'info', message: 'Nhà xe mới đăng ký: Xe Khách ABC' },
  ];

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <Warning color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <CheckCircle color="success" />;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'success';
    }
  };

  return (
    <Container maxWidth="xl" disableGutters>

      {/* Settings Tabs */}
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
          <Tab icon={<Settings />} iconPosition="start" label="Cài đặt chung" />
          <Tab icon={<Payment />} iconPosition="start" label="Thanh toán" />
          <Tab icon={<Email />} iconPosition="start" label="Email" />
          <Tab icon={<Security />} iconPosition="start" label="Bảo mật" />
          <Tab icon={<Backup />} iconPosition="start" label="Sao lưu" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Cài đặt hệ thống
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText
                    primary="Chế độ bảo trì"
                    secondary="Tạm ngưng hoạt động hệ thống để bảo trì"
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemConfig.maintenanceMode}
                          onChange={handleSystemConfigChange('maintenanceMode')}
                          color="warning"
                        />
                      }
                      label=""
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemIcon>
                    <Backup />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sao lưu tự động"
                    secondary="Tự động sao lưu dữ liệu hàng ngày"
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemConfig.autoBackup}
                          onChange={handleSystemConfigChange('autoBackup')}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText
                    primary="Thông báo Email"
                    secondary="Gửi thông báo qua email cho admin"
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemConfig.emailNotifications}
                          onChange={handleSystemConfigChange('emailNotifications')}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText
                    primary="Thông báo SMS"
                    secondary="Gửi thông báo qua SMS"
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemConfig.smsNotifications}
                          onChange={handleSystemConfigChange('smsNotifications')}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveSettings}
                  sx={{
                    background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                  }}
                >
                  Lưu cài đặt
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Thông tin hệ thống
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Phiên bản</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>v2.1.0</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Cập nhật cuối</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>27/12/2024</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Trạng thái</Typography>
                <Chip label="Hoạt động bình thường" color="success" size="small" />
              </Box>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                fullWidth
                sx={{ mt: 2 }}
              >
                Kiểm tra cập nhật
              </Button>
            </Paper>
            
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Nhật ký hệ thống
              </Typography>
              {systemLogs.map((log, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {getLogIcon(log.type)}
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 600 }}>
                      {log.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {log.message}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Cổng thanh toán
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="VNPay"
                    secondary="Cổng thanh toán VNPay"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={paymentConfig.vnpayEnabled}
                      onChange={handlePaymentConfigChange('vnpayEnabled')}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemText
                    primary="MoMo"
                    secondary="Ví điện tử MoMo"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={paymentConfig.momoEnabled}
                      onChange={handlePaymentConfigChange('momoEnabled')}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemText
                    primary="ZaloPay"
                    secondary="Ví điện tử ZaloPay"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={paymentConfig.zalopayEnabled}
                      onChange={handlePaymentConfigChange('zalopayEnabled')}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Cài đặt phí và chính sách
              </Typography>
              
              <TextField
                fullWidth
                label="Tỷ lệ hoa hồng (%)"
                type="number"
                value={paymentConfig.commissionRate}
                onChange={handlePaymentConfigChange('commissionRate')}
                sx={{ mb: 3 }}
                InputProps={{
                  inputProps: { min: 0, max: 100 }
                }}
              />
              
              <TextField
                fullWidth
                label="Thời gian cho phép hủy vé (giờ)"
                type="number"
                value={paymentConfig.refundPolicy}
                onChange={handlePaymentConfigChange('refundPolicy')}
                sx={{ mb: 3 }}
                InputProps={{
                  inputProps: { min: 1, max: 168 }
                }}
              />
              
              <Alert severity="info" sx={{ mb: 3 }}>
                Thay đổi cài đặt này sẽ ảnh hưởng đến tất cả các giao dịch mới
              </Alert>
              
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveSettings}
                sx={{
                  background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                }}
              >
                Lưu cài đặt
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Cấu hình SMTP
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SMTP Server"
                    value={emailSettings.smtpServer}
                    onChange={handleEmailSettingsChange('smtpServer')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SMTP Port"
                    value={emailSettings.smtpPort}
                    onChange={handleEmailSettingsChange('smtpPort')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SMTP User"
                    value={emailSettings.smtpUser}
                    onChange={handleEmailSettingsChange('smtpUser')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SMTP Password"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={handleEmailSettingsChange('smtpPassword')}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveSettings}
                  sx={{
                    background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                  }}
                >
                  Lưu cấu hình
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Email />}
                >
                  Gửi email test
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quản lý Admin
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddAdminDialogOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                  }}
                >
                  Thêm Admin
                </Button>
              </Box>
              
              {adminUsers.map((admin) => (
                <Box key={admin.id} sx={{ p: 2, border: '1px solid #f0f0f0', borderRadius: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {admin.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {admin.email} • {admin.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Đăng nhập cuối: {admin.lastLogin}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton>
                        <Edit />
                      </IconButton>
                      <IconButton color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Paper>
            
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Cài đặt bảo mật
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Xác thực 2 bước"
                    secondary="Bắt buộc xác thực 2 bước cho tài khoản admin"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={systemConfig.twoFactorAuth}
                      onChange={handleSystemConfigChange('twoFactorAuth')}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemText
                    primary="Đăng ký công khai"
                    secondary="Cho phép người dùng tự đăng ký tài khoản"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={systemConfig.publicRegistration}
                      onChange={handleSystemConfigChange('publicRegistration')}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Sao lưu dữ liệu
              </Typography>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                Sao lưu gần nhất: 27/12/2024 03:00 AM
              </Alert>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Backup />}
                  onClick={() => setBackupDialogOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                  }}
                >
                  Sao lưu ngay
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                >
                  Khôi phục
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Backup Confirmation Dialog */}
      <Dialog open={backupDialogOpen} onClose={() => setBackupDialogOpen(false)}>
        <DialogTitle>Xác nhận sao lưu</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn thực hiện sao lưu dữ liệu ngay bây giờ?
            Quá trình này có thể mất vài phút.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupDialogOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleBackupNow} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Admin Dialog */}
      <Dialog open={addAdminDialogOpen} onClose={() => setAddAdminDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm Admin mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Họ và tên" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select defaultValue="" label="Vai trò">
                  <MenuItem value="Super Admin">Super Admin</MenuItem>
                  <MenuItem value="Finance Manager">Finance Manager</MenuItem>
                  <MenuItem value="System Manager">System Manager</MenuItem>
                  <MenuItem value="Content Manager">Content Manager</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Mật khẩu" type="password" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddAdminDialogOpen(false)}>
            Hủy
          </Button>
          <Button variant="contained">
            Thêm Admin
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SystemSettings; 