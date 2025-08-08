/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
  Card,
  LinearProgress,
  CardContent,
} from "@mui/material";
import {
  Cancel,
  CheckCircle,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import type { AppDispatch, RootState } from "../../../store";
import { changePassword, clearAuthStatus } from "../../../store/authSlice";

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
      minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
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

const ChangePasswordPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error, successMessage } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [clientError, setClientError] = useState("");

  const loading = status === "loading";
  const passwordValidation = validatePassword(formData.newPassword);
  const isPasswordMatch =
    formData.newPassword === formData.confirmNewPassword &&
    formData.confirmNewPassword !== "";

  useEffect(() => {
    // dispatch(clearAuthStatus());
    return () => {
      dispatch(clearAuthStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [successMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setClientError("");
    if (error) dispatch(clearAuthStatus());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClientError("");
    dispatch(clearAuthStatus());

    if (
      formData.currentPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      setClientError("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setClientError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (formData.newPassword.length < 8) {
      setClientError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    if (!passwordValidation.isValid) {
      setClientError("Mật khẩu mới không đáp ứng đủ các yêu cầu về bảo mật.");
      return;
    }

    dispatch(changePassword(formData));
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Đổi mật khẩu
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          {/* Hiển thị lỗi từ server */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          {/* Hiển thị lỗi từ client */}
          {clientError && (
            <Alert severity="warning" sx={{ mb: 2, width: "100%" }}>
              {clientError}
            </Alert>
          )}

          {/* Hiển thị thông báo thành công */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2, width: "100%" }}>
              {successMessage}
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            name="currentPassword"
            label="Mật khẩu hiện tại"
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            autoComplete="current-password"
            value={formData.currentPassword}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle current password visibility"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="Mật khẩu mới"
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            autoComplete="new-password"
            value={formData.newPassword}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {formData.newPassword && (
            <Box sx={{ mt: 1 }}>
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

              <Card sx={{ mt: 2, bgcolor: "grey.50" }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Yêu cầu mật khẩu:
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 0.5,
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
                    ].map((req) => (
                      <Box
                        key={req.text}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {req.check ? (
                          <CheckCircle color="success" sx={{ fontSize: 16 }} />
                        ) : (
                          <Cancel color="error" sx={{ fontSize: 16 }} />
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            color: req.check ? "success.main" : "error.main",
                          }}
                        >
                          {req.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmNewPassword"
            label="Xác nhận mật khẩu mới"
            type={showConfirmPassword ? "text" : "password"}
            id="confirmNewPassword"
            autoComplete="new-password"
            value={formData.confirmNewPassword}
            onChange={handleInputChange}
            error={
              formData.confirmNewPassword !== "" &&
              formData.newPassword !== formData.confirmNewPassword
            }
            helperText={
              formData.confirmNewPassword !== "" &&
              formData.newPassword !== formData.confirmNewPassword
                ? "Mật khẩu xác nhận không khớp."
                : ""
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={
              loading ||
              !formData.currentPassword ||
              !passwordValidation.isValid ||
              !isPasswordMatch
            }
            sx={{ mt: 3, mb: 2, py: 1.5, fontSize: "1.1rem", fontWeight: 600 }}
          >
            {loading ? (
              <CircularProgress size={26} color="inherit" />
            ) : (
              "Cập nhật mật khẩu"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChangePasswordPage;
