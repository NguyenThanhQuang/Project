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
  Facebook,
  Email,
  Lock,
  Person,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../store";
import {
  loginUser,
  registerUser,
  clearAuthStatus,
} from "../../../store/authSlice";

// interface RegisterUserData {
//   name: string;
//   email: string;
//   password: string;
//   phone?: string;
// }

// Google Logo SVG Component with correct colors
const GoogleLogo: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

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
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    status,
    error: authError,
    successMessage,
  } = useSelector((state: RootState) => state.auth);

  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    confirmPassword: "",
  });

  // Reset state khi modal đóng hoặc mở/chuyển tab
  useEffect(() => {
    if (open) {
      dispatch(clearAuthStatus());
      setTab(initialTab);
      setFormData({
        email: "",
        password: "",
        name: "",
        phone: "",
        confirmPassword: "",
      });
    }
  }, [open, initialTab, dispatch]);

  useEffect(() => {
    // Đăng nhập thành công, user có dữ liệu -> đóng modal
    if (status === "succeeded" && tab === "login" && !authError) {
      onClose();
    }
  }, [status, tab, authError, onClose]);

  const loading = status === "loading";

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: "login" | "register"
  ) => {
    setTab(newValue);
    dispatch(clearAuthStatus()); // Xóa lỗi khi chuyển tab
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  // Password validation
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return {
      isValid:
        minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
      checks: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
      },
    };
  };

  const isPasswordMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";
  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthStatus());

    if (tab === "login") {
      dispatch(
        loginUser({
          credentials: {
            identifier: formData.email,
            password: formData.password,
          },
        })
      );
    } else {
      if (formData.password !== formData.confirmPassword) {
        // Validation phía client
        return;
      }
      if (!passwordValidation.isValid) {
        return;
      }
      dispatch(
        registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        })
      );
    }
  };

  const handleForgotPassword = () => {
    onClose();
    navigate("/forgot-password");
  };

  //JSX
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
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
            {tab === "login" ? "Đăng nhập" : "Đăng ký"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{
            px: 3,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
            },
          }}
        >
          <Tab label="Đăng nhập" value="login" />
          <Tab label="Đăng ký" value="register" />
        </Tabs>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* THAY ĐỔI: Hiển thị lỗi hoặc thông báo thành công từ Redux store */}
          {authError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {authError}
            </Alert>
          )}
          {successMessage && tab === "register" && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {tab === "register" && (
            <>
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
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                placeholder="+84987654321"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">📱</InputAdornment>
                  ),
                }}
              />
            </>
          )}

          <TextField
            fullWidth
            label="Email hoặc Số điện thoại"
            type="text"
            value={formData.email}
            onChange={handleInputChange("email")}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange("password")}
            required
            sx={{ mb: tab === "register" ? 2 : 3 }}
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

          {tab === "register" && (
            <>
              <TextField
                fullWidth
                label="Xác nhận mật khẩu"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                required
                sx={{ mb: 2 }}
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {formData.confirmPassword !== "" && (
                          <>
                            {isPasswordMatch ? (
                              <CheckCircle
                                sx={{ color: "success.main", fontSize: 20 }}
                              />
                            ) : (
                              <Cancel
                                sx={{ color: "error.main", fontSize: 20 }}
                              />
                            )}
                          </>
                        )}
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Requirements */}
              {formData.password && (
                <Box sx={{ mb: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Yêu cầu mật khẩu:
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
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
                            fontSize: "0.875rem",
                          }}
                        >
                          {requirement.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={
              loading ||
              (tab === "register" &&
                (!passwordValidation.isValid || !isPasswordMatch))
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
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : tab === "login" ? (
              "Đăng nhập"
            ) : (
              "Đăng ký"
            )}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Hoặc
            </Typography>
          </Divider>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleLogo size={20} />}
              sx={{
                py: 1.5,
                borderColor: "#db4437",
                color: "#db4437",
                "&:hover": {
                  borderColor: "#db4437",
                  backgroundColor: "rgba(219, 68, 55, 0.04)",
                },
              }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Facebook />}
              sx={{
                py: 1.5,
                borderColor: "#1877f2",
                color: "#1877f2",
                "&:hover": {
                  borderColor: "#1877f2",
                  backgroundColor: "rgba(24, 119, 242, 0.04)",
                },
              }}
            >
              Facebook
            </Button>
          </Box>

          {tab === "login" && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="text"
                size="small"
                onClick={handleForgotPassword}
              >
                Quên mật khẩu?
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
