import React from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

import UserMenu from "./UserMenu";
import GuestMobileMenu from "./GuestMobileMenu";

interface MobileMenuProps {
  onOpenAuthModal: (mode: "login" | "register") => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onOpenAuthModal }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Box sx={{ display: { xs: "flex", md: "none" } }}>
      {user ? (
        <UserMenu />
      ) : (
        <GuestMobileMenu onOpenAuthModal={onOpenAuthModal} />
      )}
    </Box>
  );
};

export default MobileMenu;
