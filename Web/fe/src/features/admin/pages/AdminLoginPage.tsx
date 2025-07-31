import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AdminPanelSettings } from "@mui/icons-material";

import type { AppDispatch, RootState } from "../../../store";
import { loginUser, logout, clearAuthStatus } from "../../../store/authSlice";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, status, error } = useSelector((state: RootState) => state.auth);

  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(clearAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (user && status === "succeeded") {
      if (user.roles.includes("admin")) {
        navigate("/admin", { replace: true });
      } else {
        setAuthError(
          "Tài khoản của bạn không có quyền truy cập vào khu vực quản trị."
        );
        setTimeout(() => {
          dispatch(logout());
          setAuthError(null);
        }, 3000);
      }
    }
    if (status === "failed" && error) {
      setAuthError(error);
    }
  }, [user, status, error, navigate, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    dispatch(clearAuthStatus());
    dispatch(
      loginUser({
        credentials,
        source: "admin-portal",
      })
    );
  };

  const loading = status === "loading";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          <AdminPanelSettings
            sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
          />
          <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
            Admin Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 3 }}
          >
            {authError && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {authError}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="identifier"
              label="Email hoặc Số điện thoại"
              name="identifier"
              autoComplete="email"
              autoFocus
              value={credentials.identifier}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLoginPage;
