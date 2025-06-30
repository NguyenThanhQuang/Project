import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  AccountCircle,
  Menu as MenuIcon,
  DirectionsBus,
  Help,
  ContactSupport,
  Person,
  Logout,
  BookOnline,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  onLogout?: () => void;
  onLogin?: () => void;
  onRegister?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onLogin,
  onRegister,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleUserMenuClose();
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    onLogout?.();
    handleUserMenuClose();
  };

  const handleOpenAuth = (tab: "login" | "register") => {
    if (tab === "login" && onLogin) {
      onLogin();
    } else if (tab === "register" && onRegister) {
      onRegister();
    }
    handleMobileMenuClose();
  };

  const renderLoggedInMobileMenu = () => [
    <MenuItem
      key="my-bookings"
      onClick={() => handleNavigation("/my-bookings")}
    >
      Chuyến xe của tôi
    </MenuItem>,
  ];

  const renderGuestMobileMenu = () => [
    <Divider key="divider" />,
    <MenuItem key="login" onClick={() => handleOpenAuth("login")}>
      <AccountCircle sx={{ mr: 1 }} />
      Đăng nhập
    </MenuItem>,
    <MenuItem key="register" onClick={() => handleOpenAuth("register")}>
      <Person sx={{ mr: 1 }} />
      Đăng ký
    </MenuItem>,
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={2}
        sx={{ backgroundColor: "white", color: "text.primary" }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <DirectionsBus
              sx={{ mr: 1, color: "primary.main", fontSize: 32 }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textDecoration: "none",
                display: { xs: "none", sm: "block" },
              }}
            >
              BusBooking
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              mx: 2,
              maxWidth: 350,
              flex: 1,
            }}
          >
            <TextField
              placeholder="Tìm kiếm chuyến đi..."
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f8fafb",
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#e9ecef",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  },
                  "&.Mui-focused": {
                    backgroundColor: "white",
                    boxShadow: "0 0 0 3px rgba(0, 119, 190, 0.1)",
                  },
                },
              }}
              onFocus={() => navigate("/trips")}
            />
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              color="inherit"
              onClick={() => navigate("/")}
              sx={{
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(0, 119, 190, 0.04)",
                },
              }}
            >
              Trang chủ
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigation("/help")}
              sx={{
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(0, 119, 190, 0.04)",
                },
              }}
            >
              Trợ giúp
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigation("/contact")}
              sx={{
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(0, 119, 190, 0.04)",
                },
              }}
            >
              Liên hệ
            </Button>

            {user ? (
              <Button
                color="inherit"
                onClick={() => handleNavigation("/my-bookings")}
                startIcon={<BookOnline />}
                sx={{
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "rgba(0, 119, 190, 0.04)",
                  },
                }}
              >
                Chuyến xe của tôi
              </Button>
            ) : null}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user ? (
              <>
                <IconButton onClick={handleUserMenuOpen} sx={{ p: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      background:
                        "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                      fontWeight: 600,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: "0px 4px 20px rgba(0, 119, 190, 0.15)",
                    },
                  }}
                >
                  <MenuItem onClick={() => handleNavigation("/users/me")}>
                    <Person sx={{ mr: 1 }} />
                    Tài khoản của tôi
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation("/my-bookings")}>
                    <BookOnline sx={{ mr: 1 }} />
                    Chuyến xe của tôi
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => handleOpenAuth("login")}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 600,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                    },
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleOpenAuth("register")}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 600,
                    background:
                      "linear-gradient(135deg, #ffa726 0%, #ff8f00 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #ff8f00 0%, #e65100 100%)",
                    },
                  }}
                >
                  Đăng ký
                </Button>
              </Box>
            )}

            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton onClick={handleMobileMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMobileMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 220,
                    borderRadius: 2,
                    boxShadow: "0px 4px 20px rgba(0, 119, 190, 0.15)",
                  },
                }}
              >
                <MenuItem onClick={() => handleNavigation("/")}>
                  Trang chủ
                </MenuItem>

                <MenuItem onClick={() => handleNavigation("/help")}>
                  <Help sx={{ mr: 1.5 }} />
                  Trợ giúp
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/contact")}>
                  <ContactSupport sx={{ mr: 1.5 }} />
                  Liên hệ
                </MenuItem>

                {user ? renderLoggedInMobileMenu() : renderGuestMobileMenu()}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
