import React from "react";
import { AppBar, Toolbar, Box, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { RootState } from "../../fe/src/store";
import { useNavigate } from "react-router-dom";

import Logo from "./Header/Logo";
import DesktopNav from "./Header/DesktopNav";
import AuthButtons from "./Header/AuthButtons";
import UserAccountMenu from "./Header/UserMenu";

interface HeaderProps {
  onOpenAuthModal: (mode: "login" | "register") => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAuthModal }) => {
  const { user } = useSelector(
    (state: RootState) => state.auth as RootState["auth"]
  );
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{ backgroundColor: "white", color: "text.primary" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        <Logo />

        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", px: 2 }}>
          <TextField
            placeholder="Tìm kiếm chuyến đi..."
            size="small"
            sx={{
              maxWidth: 400,
              width: "100%",
              display: { xs: "none", md: "block" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 3, backgroundColor: "#f8fafb" },
            }}
            onFocus={() => navigate("/trips")}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <DesktopNav />
          {user ? (
            <UserAccountMenu />
          ) : (
            <>
              <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                <AuthButtons onOpenAuthModal={onOpenAuthModal} />
              </Box>
              {/* Có thể tạo một GuestMobileMenu riêng nếu muốn */}
              <Box sx={{ display: { xs: "flex", sm: "none" } }}>
                {/* ... Nút hamburger cho mobile guest ... */}
              </Box>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
