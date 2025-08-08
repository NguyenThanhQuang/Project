import React, { useEffect, useState } from "react";
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
import { clearAuthStatus, forgotPassword } from "../../../store/authSlice.ts";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  // const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { status, error, successMessage } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      dispatch(clearAuthStatus());
    };
  }, [dispatch]);

  const getMailProviderLink = (email: string): string => {
    const domain = email.split("@")[1];
    if (domain.includes("gmail")) return "https://mail.google.com";
    if (domain.includes("outlook") || domain.includes("hotmail"))
      return "https://outlook.live.com";
    return "about:blank";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(forgotPassword(email))
      .unwrap()
      .then(() => {
        window.open(getMailProviderLink(email), "_blank");
        navigate("/");
      })
      .catch(() => {
        // []
      });
  };

  if (status === "succeeded" && successMessage) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Alert severity="success">{successMessage}</Alert>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
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
