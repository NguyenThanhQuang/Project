import React from "react";
import { Box, Button } from "@mui/material";

interface AuthButtonsProps {
  onOpenAuthModal: (mode: "login" | "register") => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ onOpenAuthModal }) => {
  return (
    <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
      <Button
        variant="outlined"
        onClick={() => onOpenAuthModal("login")}
        sx={{
          borderRadius: 3,
          fontWeight: 600,
          borderWidth: 2,
          "&:hover": { borderWidth: 2 },
        }}
      >
        Đăng nhập
      </Button>
      <Button
        variant="contained"
        onClick={() => onOpenAuthModal("register")}
        sx={{
          borderRadius: 3,
          fontWeight: 600,
          background: "linear-gradient(135deg, #ffa726 0%, #ff8f00 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #ff8f00 0%, #e65100 100%)",
          },
        }}
      >
        Đăng ký
      </Button>
    </Box>
  );
};

export default AuthButtons;
