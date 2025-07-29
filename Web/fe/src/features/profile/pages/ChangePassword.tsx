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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import type { AppDispatch, RootState } from "../../../store";
import { changePassword, clearAuthStatus } from "../../../store/authSlice";

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

  useEffect(() => {
    dispatch(clearAuthStatus());
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClientError("");
    dispatch(clearAuthStatus());

    if (formData.newPassword !== formData.confirmNewPassword) {
      setClientError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    if (formData.newPassword.length < 8) {
      setClientError("Mật khẩu mới phải có ít nhất 8 ký tự.");
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
            disabled={loading}
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
