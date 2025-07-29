import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import type { AppDispatch, RootState } from "../../../store";
import { resetPassword } from "../../../store/authSlice"; //clearError

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Xóa lỗi cũ khi component được mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Token không hợp lệ hoặc đã hết hạn.");
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      alert("Mật khẩu xác nhận không khớp.");
      return;
    }
    dispatch(resetPassword({ token, ...formData }))
      .unwrap()
      .then(() => {
        setSubmitted(true);
      })
      .catch(() => {});
  };

  if (!token) {
    return (
      <Container>
        <Typography color="error">
          Lỗi: Không tìm thấy token đặt lại mật khẩu.
        </Typography>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Thành công!
          </Typography>
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            Mật khẩu của bạn đã được đặt lại thành công.
          </Alert>
          <Button variant="contained" onClick={() => navigate("/")}>
            Đăng nhập ngay
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Đặt lại Mật khẩu
        </Typography>

        {status === "failed" && error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          label="Mật khẩu mới"
          type="password"
          value={formData.newPassword}
          onChange={handleInputChange("newPassword")}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Xác nhận mật khẩu mới"
          type="password"
          value={formData.confirmNewPassword}
          onChange={handleInputChange("confirmNewPassword")}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={status === "loading"}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          {status === "loading" ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Lưu mật khẩu mới"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default ResetPassword;
