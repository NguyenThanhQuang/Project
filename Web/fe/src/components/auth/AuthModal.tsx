import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Close,
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  Email,
  Lock,
  Person,
  Phone,
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { loginUser, registerUser } from "../../store/authSlice";
interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}

const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  initialTab = "login",
}) => {
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab, open]);

  useEffect(() => {
    if (isLoginSuccess()) {
      onClose();
    }
    if (isRegisterSuccess()) {
      alert(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );
      setTab("login");
      setFormData({
        email: "",
        password: "",
        name: "",
        phone: "",
        confirmPassword: "",
      });
    }
  }, [status]);

  const isLoginSuccess = () => status === "succeeded" && tab === "login";
  const isRegisterSuccess = () => status === "succeeded" && tab === "register";

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: "login" | "register"
  ) => {
    setTab(newValue);
    setFormData({
      email: "",
      password: "",
      name: "",
      phone: "",
      confirmPassword: "",
    });
    // Có thể dispatch action để clear error trong Redux state nếu cần
    // dispatch(clearAuthError());
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === "login") {
      dispatch(
        loginUser({
          identifier: formData.email,
          password: formData.password,
        })
      );
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp");
        return;
      }
      dispatch(
        registerUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        })
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 1301 }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            pb: 1,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {tab === "login" ? "🚀 Đăng nhập" : "✨ Đăng ký"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Tabs value={tab} onChange={handleTabChange} /* ... */>
          <Tab label="Đăng nhập" value="login" />
          <Tab label="Đăng ký" value="register" />
        </Tabs>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {status === "failed" && error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {tab === "register" && (
            <TextField
              fullWidth
              label="Họ và tên"
              value={formData.name}
              onChange={handleInputChange("name")}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <TextField
            fullWidth
            label={tab === "login" ? "Email hoặc Số điện thoại" : "Email"}
            type={tab === "register" ? "email" : "text"}
            value={formData.email}
            onChange={handleInputChange("email")}
            required
            sx={{ mb: 2 }}
            InputProps={
              {
                /* ... */
              }
            }
          />
          {tab === "register" && (
            <TextField
              fullWidth
              label="Số điện thoại"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <TextField
            fullWidth
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange("password")}
            required
            sx={{ mb: tab === "register" ? 2 : 3 }}
            InputProps={
              {
                /* ... */
              }
            }
          />

          {tab === "register" && (
            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              required
              sx={{ mb: 3 }}
              InputProps={
                {
                  /* ... */
                }
              }
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={status === "loading"}
            sx={
              {
                /* ...sx props... */
              }
            }
          >
            {status === "loading" ? (
              <CircularProgress size={24} color="inherit" />
            ) : tab === "login" ? (
              "Đăng nhập"
            ) : (
              "Đăng ký"
            )}
          </Button>

          <Divider sx={{ my: 2 }}>...</Divider>
          <Box sx={{ display: "flex", gap: 2 }}>...</Box>
          {tab === "login" && <Box>...</Box>}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
