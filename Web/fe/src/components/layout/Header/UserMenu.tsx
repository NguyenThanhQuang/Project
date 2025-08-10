import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Avatar, Divider } from "@mui/material";
import {
  Person,
  Logout,
  BookOnline,
  Add,
  AdminPanelSettings,
  Business,
  DirectionsBus,
  LockReset,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../fe/src/store";
import { logout } from "../../../fe/src/store/authSlice";

const UserMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    handleMenuClose();
  };

  if (!user) {
    return null;
  }

  const renderMenuItems = () => {
    if (!user.roles || user.roles.length === 0) {
      return (
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1.5 }} /> Đăng xuất (Lỗi vai trò)
        </MenuItem>
      );
    }
    const menuItems: React.ReactNode[] = [];

    // --- Mục chung ---
    menuItems.push(
      <MenuItem
        key="profile"
        onClick={() => handleNavigation("/loyalty-program")}
      >
        <Person sx={{ mr: 1.5 }} /> Tài khoản của tôi
      </MenuItem>,
      <MenuItem
        key="change-password"
        onClick={() => handleNavigation("/change-password")}
      >
        <LockReset sx={{ mr: 1.5 }} /> Đổi mật khẩu
      </MenuItem>
    );

    // --- Mục cho vai trò 'user' ---
    if (user.roles.includes("user")) {
      menuItems.push(
        <MenuItem
          key="my-bookings"
          onClick={() => handleNavigation("/my-bookings")}
        >
          <BookOnline sx={{ mr: 1.5 }} /> Chuyến đi của tôi
        </MenuItem>
      );
    }

    // --- Mục cho vai trò 'company_admin' ---
    if (user.roles.includes("company_admin")) {
      menuItems.push(<Divider key="d-company" />);
      menuItems.push(
        <MenuItem
          key="c-dashboard"
          onClick={() => handleNavigation("/company/dashboard")}
        >
          <Business sx={{ mr: 1.5 }} /> Quản lý nhà xe
        </MenuItem>,
        <MenuItem
          key="c-manage"
          onClick={() => handleNavigation("/manage-trips")}
        >
          <DirectionsBus sx={{ mr: 1.5 }} /> Quản lý chuyến xe
        </MenuItem>,
        <MenuItem key="c-add" onClick={() => handleNavigation("/add-trip")}>
          <Add sx={{ mr: 1.5 }} /> Thêm chuyến xe
        </MenuItem>
      );
    }

    // --- Mục cho vai trò 'admin' ---
    if (user.roles.includes("admin")) {
      menuItems.push(<Divider key="d-admin" />);
      menuItems.push(
        <MenuItem key="a-panel" onClick={() => handleNavigation("/admin")}>
          <AdminPanelSettings sx={{ mr: 1.5 }} /> Bảng điều khiển Admin
        </MenuItem>
      );
    }

    // --- Mục Đăng xuất ---
    menuItems.push(<Divider key="d-logout" />);
    menuItems.push(
      <MenuItem key="logout" onClick={handleLogout}>
        <Logout sx={{ mr: 1.5 }} /> Đăng xuất
      </MenuItem>
    );

    return menuItems;
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
            fontWeight: 600,
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            minWidth: 240,
            borderRadius: 2,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {renderMenuItems()}
      </Menu>
    </>
  );
};

export default UserMenu;
