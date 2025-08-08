import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import type { AppDispatch, RootState } from "../../../store";
import { resetPassword, clearAuthStatus } from "../../../store/authSlice";

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
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock,
  CheckCircle,
  Cancel,
  Security,
} from "@mui/icons-material";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const {
    status: reduxStatus,
    error: reduxError,
    successMessage,
  } = useSelector((state: RootState) => state.auth);
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    dispatch(clearAuthStatus());

    if (!token) {
      setIsValidating(false);
      setValidationError(
        "URL không hợp lệ. Không tìm thấy token đặt lại mật khẩu."
      );
      return;
    }

    const validateToken = async () => {
      try {
        await api.get(`/auth/validate-reset-token?token=${token}`);
        setIsTokenValid(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setIsTokenValid(false);
        setValidationError(
          err.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn."
        );
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, dispatch]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const validCount = [
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    ].filter(Boolean).length;

    return {
      isValid:
        minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
      strength: validCount,
      checks: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
      },
    };
  };
  const passwordValidation = validatePassword(formData.password);
  const isPasswordMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      if (reduxError) {
        dispatch(clearAuthStatus());
      }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !passwordValidation.isValid || !isPasswordMatch) {
      return;
    }

    dispatch(
      resetPassword({
        token,
        newPassword: formData.password,
        confirmNewPassword: formData.confirmPassword,
      })
    );
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return "error";
    if (strength <= 3) return "warning";
    if (strength <= 4) return "info";
    return "success";
  };

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength <= 2) return "Yếu";
    if (strength <= 3) return "Trung bình";
    if (strength <= 4) return "Mạnh";
    return "Rất mạnh";
  };

  if (isValidating) {
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang kiểm tra yêu cầu...</Typography>
      </Container>
    );
  }

  if (!isTokenValid) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <Alert severity="error">{validationError}</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/forgot-password")}
          sx={{ mt: 2 }}
        >
          Yêu cầu một liên kết mới
        </Button>
      </Container>
    );
  }

  if (reduxStatus === "succeeded" && successMessage) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <Alert severity="success">{successMessage}</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Đăng nhập ngay
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={10}
        sx={{
          p: 4,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Security sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Tạo mật khẩu mới
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Mật khẩu mới của bạn phải khác với mật khẩu đã sử dụng trước đây.
          </Typography>
        </Box>
        {reduxStatus === "failed" && reduxError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {reduxError}
          </Alert>
        )}

        <Box>
          <TextField
            fullWidth
            label="Mật khẩu mới"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange("password")}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "primary.main" }} />
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

          {formData.password && (
            <>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Độ mạnh mật khẩu:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: `${getPasswordStrengthColor(
                        passwordValidation.strength
                      )}.main`,
                      fontWeight: 600,
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
              <Card sx={{ mb: 2, bgcolor: "grey.50" }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Yêu cầu mật khẩu:
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1,
                    }}
                  >
                    {[
                      {
                        check: passwordValidation.checks.minLength,
                        text: "Ít nhất 8 ký tự",
                      },
                      {
                        check: passwordValidation.checks.hasUpperCase,
                        text: "Có chữ hoa",
                      },
                      {
                        check: passwordValidation.checks.hasLowerCase,
                        text: "Có chữ thường",
                      },
                      {
                        check: passwordValidation.checks.hasNumbers,
                        text: "Có số",
                      },
                      {
                        check: passwordValidation.checks.hasSpecialChar,
                        text: "Có ký tự đặc biệt",
                      },
                    ].map((requirement, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {requirement.check ? (
                          <CheckCircle
                            sx={{ color: "success.main", fontSize: 16 }}
                          />
                        ) : (
                          <Cancel sx={{ color: "error.main", fontSize: 16 }} />
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            color: requirement.check
                              ? "success.main"
                              : "error.main",
                            fontSize: "0.75rem",
                            fontWeight: requirement.check ? 600 : 400,
                          }}
                        >
                          {requirement.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </>
          )}

          <TextField
            fullWidth
            label="Xác nhận mật khẩu"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleInputChange("confirmPassword")}
            required
            sx={{ mb: 3 }}
            error={formData.confirmPassword !== "" && !isPasswordMatch}
            helperText={
              formData.confirmPassword !== "" && !isPasswordMatch
                ? "Mật khẩu xác nhận không khớp"
                : ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {formData.confirmPassword !== "" && (
                      <>
                        {isPasswordMatch ? (
                          <CheckCircle
                            sx={{ color: "success.main", fontSize: 20 }}
                          />
                        ) : (
                          <Cancel sx={{ color: "error.main", fontSize: 20 }} />
                        )}
                      </>
                    )}
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
            disabled={
              reduxStatus === "loading" ||
              !passwordValidation.isValid ||
              !isPasswordMatch
            }
            sx={{
              py: 1.5,
              fontWeight: 700,
              fontSize: "1.1rem",
              background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #004c8b 0%, #003366 100%)",
              },
              mb: 2,
            }}
          >
            {reduxStatus === "loading" ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Cần hỗ trợ? Liên hệ với chúng tôi:
          </Typography>
          <Typography
            variant="body2"
            color="primary.main"
            sx={{ fontWeight: 600 }}
          >
            📞 Hotline: 1900-xxxx | 📧 Email: support@busapp.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
