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
  Divider,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Button,
  MenuItem,
  Menu,
  Avatar,
} from "@mui/material";
import {
  Dashboard,
  DirectionsBus,
  People,
  Assessment,
  Settings,
  Menu as MenuIcon,
  Logout,
  NavigateNext,
  Notifications,
  AirportShuttle,
} from "@mui/icons-material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import NotificationDropdown from "../common/NotificationDropdown";
import { useNotifications } from "../../contexts/NotificationContext";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { logout } from "../../store/authSlice";

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 88;

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State cho drawer trên mobile
  const [mobileOpen, setMobileOpen] = useState(false);
  // State cho drawer trên desktop
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

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
      id: "vehicles",
      title: "Quản lý Xe",
      icon: <AirportShuttle />,
      path: "/admin/vehicles",
      description: "Quản lý các loại xe của nhà xe",
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

  // Hàm mới để toggle sidebar trên desktop
  const handleDesktopDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getCurrentPageDescription = () => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname
    );
    return currentItem?.description || "Quản trị hệ thống";
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ title: "Admin", path: "/admin" }];

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

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Admin Header - SỬA LỖI 2 */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          transition: "opacity 0.3s",
          opacity: isDrawerOpen || isMobile ? 1 : 0,
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
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
        <List>
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
                    px: isDrawerOpen ? 2 : 3,
                    justifyContent: isDrawerOpen ? "initial" : "center",
                    transition: "all 0.3s ease",
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
                    },
                    "&:hover": {
                      bgcolor: "rgba(0, 119, 190, 0.08)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isDrawerOpen ? 3 : "auto",
                      justifyContent: "center",
                      color: isSelected ? "white" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: isSelected ? 600 : 500,
                    }}
                    sx={{
                      opacity: isDrawerOpen ? 1 : 0,
                      transition: "opacity 0.2s",
                    }} // Ẩn text khi thu gọn
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          opacity: isDrawerOpen || isMobile ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        <Divider sx={{ mb: 2 }} />
        {/* YÊU CẦU 1: Đã xóa ListItem "Về trang chủ" */}
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

  const currentDrawerWidth = isDrawerOpen
    ? DRAWER_WIDTH
    : COLLAPSED_DRAWER_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` }, // YÊU CẦU 3
          ml: { md: `${currentDrawerWidth}px` }, // YÊU CẦU 3
          bgcolor: "white",
          color: "text.primary",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
            {/* Desktop Toggle Button - YÊU CẦU 3 */}
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDesktopDrawerToggle}
              sx={{ mr: 2, display: { xs: "none", md: "block" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Page Title & Breadcrumbs */}
            <Box>
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
            </Box>
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
        sx={{
          width: { md: currentDrawerWidth },
          flexShrink: { md: 0 },
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }} // YÊU CẦU 3
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
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: currentDrawerWidth, // YÊU CẦU 3
              border: "none",
              overflowX: "hidden", // Ngăn thanh cuộn ngang khi thu gọn
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${currentDrawerWidth}px)` }, // YÊU CẦU 3
          bgcolor: "#f8fafc",
          minHeight: "100vh",
          position: "relative",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 } }}>{children || <Outlet />}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
