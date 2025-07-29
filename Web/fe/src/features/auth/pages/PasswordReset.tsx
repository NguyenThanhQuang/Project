import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  LinearProgress,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  CheckCircle,
  Cancel,
  Email,
  ArrowBack,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PasswordReset: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    resetToken: '',
  });

  // Password validation function
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const validCount = [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      strength: validCount,
      checks: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
      }
    };
  };

  const passwordValidation = validatePassword(formData.password);
  const isPasswordMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError('');
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage('Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.');
      setStep('reset');
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!passwordValidation.isValid) {
      setError('Mật khẩu không đáp ứng yêu cầu bảo mật');
      setLoading(false);
      return;
    }

    if (!isPasswordMatch) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage('Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập với mật khẩu mới.');
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return 'error';
    if (strength <= 3) return 'warning';
    if (strength <= 4) return 'info';
    return 'success';
  };

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength <= 2) return 'Yếu';
    if (strength <= 3) return 'Trung bình';
    if (strength <= 4) return 'Mạnh';
    return 'Rất mạnh';
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
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
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {step === 'email' ? 'Đặt lại mật khẩu' : 'Tạo mật khẩu mới'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {step === 'email' 
              ? 'Nhập email của bạn để nhận liên kết đặt lại mật khẩu'
              : 'Tạo mật khẩu mới cho tài khoản của bạn'
            }
          </Typography>
        </Box>

        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
          variant="text"
        >
          Quay lại trang chủ
        </Button>

        {/* Messages */}
        {message && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Step 1: Email Input */}
        {step === 'email' && (
          <Box component="form" onSubmit={handleSendResetEmail}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: 700,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #004c8b 0%, #003366 100%)',
                },
                mb: 2,
              }}
            >
              {loading ? 'Đang gửi...' : 'Gửi email đặt lại'}
            </Button>
          </Box>
        )}

        {/* Step 2: Password Reset */}
        {step === 'reset' && (
          <Box component="form" onSubmit={handleResetPassword}>
            <TextField
              fullWidth
              label="Mật khẩu mới"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Strength Indicator */}
            {formData.password && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Độ mạnh mật khẩu:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: `${getPasswordStrengthColor(passwordValidation.strength)}.main`,
                      fontWeight: 600 
                    }}
                  >
                    {getPasswordStrengthLabel(passwordValidation.strength)}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(passwordValidation.strength / 5) * 100}
                  color={getPasswordStrengthColor(passwordValidation.strength)}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            )}

            {/* Password Requirements */}
            {formData.password && (
              <Card sx={{ mb: 2, bgcolor: 'grey.50' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Yêu cầu mật khẩu:
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    {[
                      { check: passwordValidation.checks.minLength, text: 'Ít nhất 8 ký tự' },
                      { check: passwordValidation.checks.hasUpperCase, text: 'Có chữ hoa' },
                      { check: passwordValidation.checks.hasLowerCase, text: 'Có chữ thường' },
                      { check: passwordValidation.checks.hasNumbers, text: 'Có số' },
                      { check: passwordValidation.checks.hasSpecialChar, text: 'Có ký tự đặc biệt' },
                    ].map((requirement, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {requirement.check ? (
                          <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                        ) : (
                          <Cancel sx={{ color: 'error.main', fontSize: 16 }} />
                        )}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: requirement.check ? 'success.main' : 'error.main',
                            fontSize: '0.75rem',
                            fontWeight: requirement.check ? 600 : 400
                          }}
                        >
                          {requirement.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              required
              sx={{ mb: 3 }}
              error={formData.confirmPassword !== '' && !isPasswordMatch}
              helperText={
                formData.confirmPassword !== '' && !isPasswordMatch 
                  ? 'Mật khẩu xác nhận không khớp' 
                  : ''
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {formData.confirmPassword !== '' && (
                        <>
                          {isPasswordMatch ? (
                            <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                          ) : (
                            <Cancel sx={{ color: 'error.main', fontSize: 20 }} />
                          )}
                        </>
                      )}
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !passwordValidation.isValid || !isPasswordMatch}
              sx={{
                py: 1.5,
                fontWeight: 700,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #004c8b 0%, #003366 100%)',
                },
                mb: 2,
              }}
            >
              {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Help Text */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Cần hỗ trợ? Liên hệ với chúng tôi:
          </Typography>
          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
            📞 Hotline: 1900-xxxx | 📧 Email: support@busapp.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PasswordReset; 