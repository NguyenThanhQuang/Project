import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import { forgotPassword } from "../../../store/authSlice.ts";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(forgotPassword(email))
      .unwrap()
      .then(() => {
        setSubmitted(true); // Hiển thị thông báo thành công
      })
      .catch(() => {
        // Lỗi đã được lưu trong Redux state, không cần làm gì thêm
      });
  };

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
            Kiểm tra Email
          </Typography>
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            Nếu địa chỉ email của bạn tồn tại trong hệ thống, bạn sẽ nhận được
            một email hướng dẫn đặt lại mật khẩu trong vài phút nữa.
          </Alert>
          <Button variant="contained" onClick={() => navigate("/")}>
            Quay về Trang chủ
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Quên Mật khẩu
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ mt: 1, mb: 3, textAlign: "center" }}
        >
          Đừng lo lắng! Hãy nhập địa chỉ email bạn đã đăng ký và chúng tôi sẽ
          gửi cho bạn một liên kết để đặt lại mật khẩu.
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
          id="email"
          label="Địa chỉ Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            "Gửi liên kết đặt lại mật khẩu"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
