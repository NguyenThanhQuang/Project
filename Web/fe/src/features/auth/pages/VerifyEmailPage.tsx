import React, { useEffect, useState, useRef } from 'react'; // THÊM useRef
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  List,
  ListItem,
  ListItemIcon,
} from '@mui/material';
import { CheckCircle, Error, ArrowBack, Email, Circle } from '@mui/icons-material';
import api from '../../../services/api';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  
  const hasVerified = useRef(false); // THÊM: Ref để track đã verify chưa

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Link xác thực không hợp lệ. Vui lòng kiểm tra lại email hoặc yêu cầu gửi lại email xác thực.');
      return;
    }

    // CHẶN DUPLICATE CALL - THÊM
    if (hasVerified.current) {
      console.log('Already verified, skipping duplicate call');
      return;
    }

    const verifyEmail = async () => {
      try {
        hasVerified.current = true; // ĐÁNH DẤU ĐÃ BẮT ĐẦU VERIFY
        
        const response = await api.get<{
          success: boolean;
          message: string;
          accessToken?: string;
          user?: any;
        }>("/auth/verify-email", {
          params: { token },
          timeout: 10000,
        });

        const data = response.data;
        
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Email của bạn đã được xác thực thành công!');
          if (data.accessToken) {
            setAccessToken(data.accessToken);
            localStorage.setItem('accessToken', data.accessToken);
            if (data.user) {
              setUserData(data.user);
              localStorage.setItem('user', JSON.stringify(data.user));
            }
          }
        } else {
          setStatus('error');
          setMessage(data.message || 'Xác thực thất bại.');
        }
      } catch (error: any) {
        console.error('Verification error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        
        setStatus('error');
        
        if (error.response) {
          const errorData = error.response.data;
          // Kiểm tra nếu lỗi 400 từ backend
          if (error.response.status === 400) {
            const backendMessage = errorData.message || '';
            
            if (backendMessage.includes('Token đã được sử dụng') || 
                backendMessage.includes('đã được sử dụng')) {
              setMessage('Email của bạn đã được xác thực trước đó. Vui lòng thử đăng nhập.');
            } else if (backendMessage.includes('hết hạn')) {
              setMessage('Link xác thực đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.');
            } else if (backendMessage.includes('Đang xử lý')) {
              setMessage('Đang xử lý yêu cầu xác thực. Vui lòng đợi vài giây...');
              // Retry sau 2 giây
              setTimeout(() => {
                hasVerified.current = false;
                verifyEmail();
              }, 2000);
              return;
            } else {
              setMessage(backendMessage || 'Link xác thực không hợp lệ.');
            }
          } else if (error.response.status === 404) {
            setMessage('Không tìm thấy thông tin xác thực.');
          } else {
            setMessage('Đã xảy ra lỗi trong quá trình xác thực.');
          }
        } else if (error.request) {
          setMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet và thử lại.');
        } else {
          setMessage('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.');
        }
      }
    };

    verifyEmail();
    
    // Cleanup function
    return () => {
      // Reset nếu component unmount
      hasVerified.current = false;
    };
  }, [token]);

  // Auto redirect
  useEffect(() => {
    if (status === 'success' && accessToken) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, accessToken, navigate]);

  const handleLoginNow = () => {
    if (accessToken) {
      navigate('/', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  const handleResendVerification = () => {
    if (userData?.email) {
      navigate(`/auth/resend-verification?email=${encodeURIComponent(userData.email)}`);
    } else {
      navigate('/auth/resend-verification');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4, minHeight: '70vh' }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
        {status === 'loading' && (
          <>
            <CircularProgress size={60} sx={{ mb: 3, color: "primary.main" }} />
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Đang xác thực email...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vui lòng đợi trong giây lát.
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom color="success.main" fontWeight={600}>
              🎉 Xác thực thành công!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {message}
            </Typography>
            
            <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2">
                ✅ Tài khoản của bạn đã được kích hoạt.
                {accessToken && ' Bạn sẽ được chuyển hướng về trang chủ sau 3 giây...'}
              </Typography>
            </Alert>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleLoginNow}
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                {accessToken ? 'Về trang chủ ngay' : 'Đăng nhập ngay'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Khám phá dịch vụ
              </Button>
            </Box>
          </>
        )}

        {status === 'error' && (
          <>
            <Error sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom color="error.main" fontWeight={600}>
              ❌ Xác thực không thành công
            </Typography>
            
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body1">
                {message}
              </Typography>
            </Alert>
            
            <Box sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Nguyên nhân có thể do:
              </Typography>
              <List dense sx={{ pl: 0 }}>
                <ListItem sx={{ py: 0.5, pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <Circle sx={{ fontSize: 6, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <Typography variant="body2" color="text.secondary">
                    Link đã hết hạn (hiệu lực 24 giờ)
                  </Typography>
                </ListItem>
                <ListItem sx={{ py: 0.5, pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <Circle sx={{ fontSize: 6, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <Typography variant="body2" color="text.secondary">
                    Link đã được sử dụng
                  </Typography>
                </ListItem>
                <ListItem sx={{ py: 0.5, pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <Circle sx={{ fontSize: 6, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <Typography variant="body2" color="text.secondary">
                    Token không hợp lệ
                  </Typography>
                </ListItem>
              </List>
            </Box>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
              <Button
                variant="contained"
                startIcon={<Email />}
                onClick={handleResendVerification}
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Gửi lại email xác thực
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/auth/register')}
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Đăng ký tài khoản mới
              </Button>
              <Button
                variant="text"
                onClick={() => navigate('/')}
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Quay lại trang chủ
              </Button>
            </Box>
          </>
        )}
      </Paper>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Vẫn gặp vấn đề?{' '}
          <Button 
            variant="text" 
            size="small" 
            onClick={() => window.open('mailto:quangnguyen.21062005@gmail.com?subject=Hỗ trợ xác thực email')}
            sx={{ textTransform: 'none' }}
          >
            Liên hệ hỗ trợ
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default VerifyEmailPage;