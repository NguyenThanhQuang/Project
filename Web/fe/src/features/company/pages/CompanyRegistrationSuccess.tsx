import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  Stack,
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  Email,
  Phone,
  Business,
  Verified,
  Assignment,
  Home,
  Print,
  Info,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

interface RegistrationSuccessData {
  registrationId: string;
  companyName: string;
  email: string;
}

const CompanyRegistrationSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const data = location.state as RegistrationSuccessData;
  
  if (!data) {
    navigate('/');
    return null;
  }

  const approvalSteps = [
    {
      title: 'Đăng ký thành công',
      description: 'Đơn đăng ký của bạn đã được gửi thành công',
      status: 'completed',
      icon: <CheckCircle />,
      time: 'Hoàn thành',
    },
    {
      title: 'Xem xét hồ sơ',
      description: 'Bộ phận quản trị đang xem xét hồ sơ của bạn',
      status: 'pending',
      icon: <Assignment />,
      time: '1-2 ngày',
    },
    {
      title: 'Xác minh thông tin',
      description: 'Xác minh giấy tờ và thông tin công ty',
      status: 'pending',
      icon: <Verified />,
      time: '2-3 ngày',
    },
    {
      title: 'Phê duyệt',
      description: 'Quyết định cuối cùng và kích hoạt tài khoản',
      status: 'pending',
      icon: <Business />,
      time: '1 ngày',
    },
  ];

  const supportInfo = [
    {
      icon: <Email />,
      title: 'Email hỗ trợ',
      content: 'support@busapp.com',
      action: 'mailto:support@busapp.com',
    },
    {
      icon: <Phone />,
      title: 'Hotline',
      content: '1900-1234',
      action: 'tel:19001234',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* Success Message */}
          <Paper
            elevation={6}
            sx={{
              borderRadius: 4,
              textAlign: 'center',
              p: 6,
              background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8f1 100%)',
              border: '2px solid',
              borderColor: 'success.light',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #4caf50, #66bb6a, #4caf50)',
              }
            }}
          >
            <CheckCircle
              sx={{
                fontSize: 100,
                color: 'success.main',
                mb: 3,
                filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))',
              }}
            />
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                color: 'success.main', 
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Đăng ký thành công!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              Cảm ơn <strong style={{ color: '#2e7d32' }}>{data.companyName}</strong> đã đăng ký trở thành đối tác của chúng tôi
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center" 
              sx={{ mb: 4 }}
            >
              <Chip
                label={`Mã đăng ký: ${data.registrationId}`}
                color="primary"
                variant="filled"
                sx={{ 
                  fontSize: '1.1rem', 
                  py: 3, 
                  px: 2, 
                  fontWeight: 600,
                  minHeight: 50,
                  borderRadius: 3,
                }}
              />
              <Chip
                label="Đang chờ duyệt"
                color="warning"
                variant="filled"
                sx={{ 
                  fontSize: '1.1rem', 
                  py: 3, 
                  px: 2, 
                  fontWeight: 600,
                  minHeight: 50,
                  borderRadius: 3,
                }}
              />
            </Stack>

            <Alert 
              severity="info" 
              icon={<Info />}
              sx={{ 
                maxWidth: 700, 
                mx: 'auto', 
                textAlign: 'left',
                borderRadius: 3,
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Thông tin quan trọng:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  • <strong>Thời gian xử lý:</strong> 3-5 ngày làm việc
                </Typography>
                <Typography variant="body2">
                  • <strong>Kết quả sẽ được gửi qua email:</strong> {data.email}
                </Typography>
                <Typography variant="body2">
                  • <strong>Lưu ý:</strong> Vui lòng kiểm tra cả hộp thư spam/junk
                </Typography>
                <Typography variant="body2">
                  • <strong>Mã đăng ký:</strong> Vui lòng lưu lại để tra cứu
                </Typography>
              </Stack>
            </Alert>
          </Paper>

          {/* Main Content */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4 
          }}>
            {/* Approval Process Timeline */}
            <Box sx={{ flex: 1 }}>
              <Paper 
                elevation={4} 
                sx={{ 
                  borderRadius: 4, 
                  p: 4,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Schedule sx={{ color: 'primary.main', fontSize: 32 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Quy trình phê duyệt
                  </Typography>
                </Box>
                
                <Stepper orientation="vertical" activeStep={0}>
                  {approvalSteps.map((step, index) => (
                    <Step key={index} completed={step.status === 'completed'}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              bgcolor: step.status === 'completed' ? 'success.main' : 'grey.300',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              boxShadow: step.status === 'completed' 
                                ? '0 4px 12px rgba(76, 175, 80, 0.4)' 
                                : '0 2px 8px rgba(0,0,0,0.1)',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {step.icon}
                          </Box>
                        )}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {step.title}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Box sx={{ pl: 2, pb: 3 }}>
                          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            {step.description}
                          </Typography>
                          <Chip
                            label={step.time}
                            size="medium"
                            color={step.status === 'completed' ? 'success' : 'default'}
                            variant={step.status === 'completed' ? 'filled' : 'outlined'}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            </Box>

            {/* Support Information */}
            <Box sx={{ width: { xs: '100%', md: '350px' } }}>
              <Paper 
                elevation={4} 
                sx={{ 
                  borderRadius: 4, 
                  p: 4,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  height: 'fit-content'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                  Cần hỗ trợ?
                </Typography>
                
                <Stack spacing={2}>
                  {supportInfo.map((info, index) => (
                    <Card 
                      key={index} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box 
                            sx={{ 
                              color: 'primary.main',
                              bgcolor: 'primary.light',
                              borderRadius: '50%',
                              p: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {info.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              {info.title}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                              {info.content}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            href={info.action}
                            target={info.action.startsWith('mailto:') ? '_blank' : undefined}
                            sx={{ 
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600
                            }}
                          >
                            Liên hệ
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Alert 
                  severity="warning" 
                  sx={{ 
                    borderRadius: 3,
                    '& .MuiAlert-message': {
                      width: '100%'
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Lưu ý quan trọng:
                  </Typography>
                  <Typography variant="body2">
                    Không thể thay đổi thông tin sau khi gửi đăng ký. 
                    Nếu cần chỉnh sửa, vui lòng liên hệ bộ phận hỗ trợ.
                  </Typography>
                </Alert>
              </Paper>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Paper 
            elevation={3}
            sx={{ 
              borderRadius: 4, 
              p: 4, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            }}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="outlined"
                size="large"
                startIcon={<Home />}
                onClick={() => navigate('/')}
                sx={{
                  minWidth: 200,
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  }
                }}
              >
                Về trang chủ
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<Print />}
                onClick={() => window.print()}
                sx={{
                  minWidth: 200,
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.5)',
                  }
                }}
              >
                In giấy xác nhận
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default CompanyRegistrationSuccess; 