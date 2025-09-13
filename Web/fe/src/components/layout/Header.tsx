import React from "react";
import { AppBar, Toolbar, Box, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
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

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{ backgroundColor: "white", color: "text.primary" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        <Logo />

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
