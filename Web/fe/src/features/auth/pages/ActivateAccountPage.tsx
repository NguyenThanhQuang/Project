import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useActivateAccount } from "../hooks/useActivateAccount";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ActivateAccountPage: React.FC = () => {
  const { status, error, userInfo, handleSubmit } = useActivateAccount();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    handleSubmit(password, confirmPassword);
  };

  const renderContent = () => {
    if (status === "validating") {
      return (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Đang kiểm tra yêu cầu...</Typography>
        </Box>
      );
    }
    if (status === "invalid") {
      return <Alert severity="error">{error}</Alert>;
    }
    if (status === "success") {
      return (
        <Alert severity="success">
          Kích hoạt thành công! Đang chuyển hướng đến trang quản lý của bạn...
        </Alert>
      );
    }
    if (status === "valid" || status === "submitting") {
      return (
        <Box component="form" onSubmit={onFormSubmit}>
          <Typography variant="h6" gutterBottom>
            Chào mừng, <strong>{userInfo?.userName}</strong>!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Bạn đang kích hoạt tài khoản quản trị cho nhà xe{" "}
            <strong>{userInfo?.companyName}</strong>. Vui lòng đặt mật khẩu để
            hoàn tất.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            required
            sx={{ mb: 2 }}
            label="Mật khẩu mới"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
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
            <PasswordStrengthIndicator password={password} />
          </Box>

          <TextField
            fullWidth
            required
            sx={{ mb: 3 }}
            label="Xác nhận mật khẩu"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={password !== confirmPassword && confirmPassword !== ""}
            helperText={
              password !== confirmPassword && confirmPassword !== ""
                ? "Mật khẩu không khớp"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              <CircularProgress size={24} />
            ) : (
              "Kích hoạt và Đăng nhập"
            )}
          </Button>
        </Box>
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 3, fontWeight: 700, textAlign: "center" }}
        >
          Kích hoạt tài khoản
        </Typography>
        {renderContent()}
      </Paper>
    </Container>
  );
};

export default ActivateAccountPage;
