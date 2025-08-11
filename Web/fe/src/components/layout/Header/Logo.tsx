import React from "react";
import { Box, Typography } from "@mui/material";
import { DirectionsBus } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      onClick={() => navigate("/")}
    >
      <DirectionsBus sx={{ mr: 1, color: "primary.main", fontSize: 32 }} />
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
        Online Bus Ticket Platform
      </Typography>
    </Box>
  );
};

export default Logo;
