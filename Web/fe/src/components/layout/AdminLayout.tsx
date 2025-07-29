/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Button,
  MenuItem,
  Menu,
} from "@mui/material";
import {
  Dashboard,
  DirectionsBus,
  People,
  Assessment,
  Settings,
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Home,
  NavigateNext,
  Notifications,
} from "@mui/icons-material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import NotificationDropdown from "../common/NotificationDropdown";
import { useNotifications } from "../../contexts/NotificationContext";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { logout } from "../../store/authSlice";

const DRAWER_WIDTH = 280;

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login", { replace: true });
    handleUserMenuClose();
  };

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <Dashboard />,
      path: "/admin",
      description: "Tổng quan hệ thống",
    },
    {
      id: "companies",
      title: "Quản lý Nhà xe",
      icon: <DirectionsBus />,
      path: "/admin/companies",
      description: "Quản lý các nhà xe đăng ký",
    },
    {
      id: "users",
      title: "Quản lý Người dùng",
      icon: <People />,
      path: "/admin/users",
      description: "Quản lý tài khoản người dùng",
    },
    {
      id: "finance",
      title: "Tài chính & Báo cáo",
      icon: <Assessment />,
      path: "/admin/finance",
      description: "Theo dõi doanh thu và báo cáo",
    },
    {
      id: "notifications",
      title: "Quản lý Thông báo",
      icon: <Notifications />,
      path: "/admin/notifications",
      description: "Quản lý thông báo hệ thống",
    },
    {
      id: "settings",
      title: "Cấu hình Hệ thống",
      icon: <Settings />,
      path: "/admin/settings",
      description: "Cài đặt và cấu hình",
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname
    );
    return currentItem?.title || "Admin Panel";
  };

  const getCurrentPageDescription = () => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname
    );
    return currentItem?.description || "Quản trị hệ thống";
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [
      { title: "Trang chủ", path: "/" },
      { title: "Admin", path: "/admin" },
    ];

    if (pathSegments.length > 1) {
      const currentItem = menuItems.find(
        (item) => item.path === location.pathname
      );
      if (currentItem && currentItem.path !== "/admin") {
        breadcrumbs.push({ title: currentItem.title, path: currentItem.path });
      }
    }

    return breadcrumbs;
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Admin Header */}
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Admin Panel
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Hệ thống quản lý xe khách
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, px: 2, py: 2 }}>
        <List sx={{ gap: 1 }}>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => handleMenuClick(item.path)}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&.Mui-selected": {
                      background:
                        "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                      color: "white",
                      boxShadow: "0 4px 20px rgba(0, 119, 190, 0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #005a9e 0%, #003d73 100%)",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "white",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                      },
                    },
                    "&:hover": {
                      bgcolor: isSelected
                        ? undefined
                        : "rgba(0, 119, 190, 0.08)",
                      transform: "translateX(4px)",
                      "& .MuiListItemIcon-root": {
                        color: isSelected ? "white" : "primary.main",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 48,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={!isSelected ? item.description : undefined}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: isSelected ? 600 : 500,
                    }}
                    secondaryTypographyProps={{
                      fontSize: "0.75rem",
                      sx: {
                        opacity: 0.7,
                        mt: 0.5,
                        display: { xs: "none", lg: "block" },
                      },
                    }}
                  />
                  {isSelected && (
                    <Box
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 4,
                        height: 20,
                        bgcolor: "white",
                        borderRadius: 2,
                        opacity: 0.8,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/")}
            sx={{
              borderRadius: 3,
              py: 1.5,
              color: "text.secondary",
              "&:hover": {
                bgcolor: "grey.100",
                "& .MuiListItemIcon-root": {
                  color: "primary.main",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Home />
            </ListItemIcon>
            <ListItemText
              primary="Về trang chủ"
              primaryTypographyProps={{
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </ListItem>

        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Admin Panel v2.1.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: "white",
          color: "text.primary",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Page Title & Breadcrumbs */}
          <Box sx={{ flex: 1 }}>
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              sx={{ mb: 0.5 }}
            >
              {getBreadcrumbs().map((crumb, index) => (
                <Link
                  key={crumb.path}
                  color={
                    index === getBreadcrumbs().length - 1
                      ? "text.primary"
                      : "inherit"
                  }
                  href={crumb.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(crumb.path);
                  }}
                  sx={{
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight:
                      index === getBreadcrumbs().length - 1 ? 600 : 400,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {crumb.title}
                </Link>
              ))}
            </Breadcrumbs>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {getCurrentPageTitle()}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.85rem" }}
            >
              {getCurrentPageDescription()}
            </Typography>
          </Box>

          {/* Header Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <NotificationDropdown
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDeleteNotification={deleteNotification}
            />
            {user ? (
              <>
                <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 40,
                      height: 40,
                      background:
                        "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 180,
                      borderRadius: 2,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <MenuItem disabled>
                    <ListItemText
                      primary={user.name}
                      secondary="Administrator"
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ fontSize: "0.8rem" }}
                    />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button onClick={() => navigate("/admin/login")} color="primary">
                Đăng nhập
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              border: "none",
              boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              border: "none",
              boxShadow: "0 0 20px rgba(0,0,0,0.08)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: "#f8fafc",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 } }}>{children || <Outlet />}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
