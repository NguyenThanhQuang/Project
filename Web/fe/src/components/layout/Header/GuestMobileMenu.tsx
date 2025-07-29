import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Divider } from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Person,
  ContactSupport,
  Help,
  TrackChanges,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface GuestMobileMenuProps {
  onOpenAuthModal: (mode: "login" | "register") => void;
}

const GuestMobileMenu: React.FC<GuestMobileMenuProps> = ({
  onOpenAuthModal,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const handleOpenAuth = (mode: "login" | "register") => {
    onOpenAuthModal(mode);
    handleMenuClose();
  };

  return (
    <>
      <IconButton size="large" onClick={handleMenuOpen} color="inherit">
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleNavigate("/")}>Trang chủ</MenuItem>
        <MenuItem onClick={() => handleNavigate("/company-registration")}>
          Đăng ký nhà xe
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/help")}>
          <Help sx={{ mr: 1.5 }} /> Trợ giúp
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/contact")}>
          <ContactSupport sx={{ mr: 1.5 }} /> Liên hệ
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/bus-tracking")}>
          <TrackChanges sx={{ mr: 1.5 }} /> Theo dõi xe
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleOpenAuth("login")}>
          <AccountCircle sx={{ mr: 1.5 }} /> Đăng nhập
        </MenuItem>
        <MenuItem onClick={() => handleOpenAuth("register")}>
          <Person sx={{ mr: 1.5 }} /> Đăng ký
        </MenuItem>
      </Menu>
    </>
  );
};

export default GuestMobileMenu;
