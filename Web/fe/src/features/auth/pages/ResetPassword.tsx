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
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock,
  CheckCircle,
  Cancel,
  Security,
} from "@mui/icons-material";

import { validatePassword } from "../utils/passwordValidator";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";

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

          <Box sx={{ mb: 2 }}>
            <PasswordStrengthIndicator password={formData.password} />
          </Box>

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
