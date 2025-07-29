import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Email,
  CheckCircle,
  ErrorOutline,
  Refresh,
  ArrowBack,
  Schedule,
  Security,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const email = searchParams.get('email') || 'example@email.com';
  const token = searchParams.get('token');

  useEffect(() => {
    // Simulate verification process
    const verifyEmail = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate different verification outcomes
        if (token === 'expired') {
          setStatus('expired');
          setMessage('Liên kết xác thực đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.');
        } else if (token === 'invalid') {
          setStatus('error');
          setMessage('Liên kết xác thực không hợp lệ. Vui lòng kiểm tra lại email hoặc yêu cầu gửi lại.');
        } else {
          setStatus('success');
          setMessage('Email đã được xác thực thành công! Bạn có thể đăng nhập vào tài khoản.');
          // Auto redirect after 5 seconds
          setTimeout(() => navigate('/'), 5000);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0 && (status === 'expired' || status === 'error')) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, status]);

  const handleResendEmail = async () => {
    setCanResend(false);
    setCountdown(30);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Email xác thực đã được gửi lại! Vui lòng kiểm tra hộp thư.');
    } catch (error) {
      setMessage('Có lỗi xảy ra khi gửi email. Vui lòng thử lại.');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={48} sx={{ mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Đang xác thực email...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vui lòng chờ trong giây lát
            </Typography>
          </Box>
        );

      case 'success':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 3 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'success.main' }}>
              Xác thực thành công!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Alert severity="success" sx={{ mb: 3 }}>
              Bạn sẽ được chuyển hướng về trang chủ trong 5 giây...
            </Alert>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                py: 1.5,
                px: 4,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #004c8b 0%, #003366 100%)',
                },
              }}
            >
              Đi đến trang chủ
            </Button>
          </Box>
        );

      case 'error':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 3 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'error.main' }}>
              Xác thực thất bại
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={handleResendEmail}
                disabled={!canResend}
                sx={{
                  py: 1.5,
                  px: 3,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #004c8b 0%, #003366 100%)',
                  },
                }}
              >
                {canResend ? 'Gửi lại email' : `Gửi lại (${countdown}s)`}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                sx={{ py: 1.5, px: 3, fontWeight: 600 }}
              >
                Quay lại trang chủ
              </Button>
            </Box>
          </Box>
        );

      case 'expired':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Schedule sx={{ fontSize: 64, color: 'warning.main', mb: 3 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'warning.main' }}>
              Liên kết đã hết hạn
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={handleResendEmail}
                disabled={!canResend}
                sx={{
                  py: 1.5,
                  px: 3,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #004c8b 0%, #003366 100%)',
                  },
                }}
              >
                {canResend ? 'Gửi lại email' : `Gửi lại (${countdown}s)`}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                sx={{ py: 1.5, px: 3, fontWeight: 600 }}
              >
                Quay lại trang chủ
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={10}
        sx={{
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Xác Thực Email
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Xác thực tài khoản email của bạn
          </Typography>
        </Box>

        {/* Email Info */}
        <Card sx={{ mb: 4, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.100' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Email sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email đang xác thực:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {email}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Box sx={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {renderContent()}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Help Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Cần hỗ trợ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Nếu bạn gặp vấn đề với việc xác thực email, vui lòng liên hệ với chúng tôi:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
              📞 Hotline: 1900-xxxx
            </Typography>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
              📧 Email: support@busapp.com
            </Typography>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
              💬 Chat: 24/7
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Additional Info Cards */}
      <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Security sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Bảo mật tài khoản
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Xác thực email giúp bảo vệ tài khoản và cung cấp các dịch vụ tốt hơn
          </Typography>
        </Card>

        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Email sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Thông báo quan trọng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nhận thông báo về chuyến đi, khuyến mãi và cập nhật dịch vụ
          </Typography>
        </Card>
      </Box>
    </Container>
  );
};

export default EmailVerification; 