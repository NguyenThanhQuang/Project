import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const PoliciesSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Chính sách & Điều khoản
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Tìm hiểu về các chính sách, quy định và cam kết của chúng tôi
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/policies")}
          sx={{
            py: 2,
            px: 4,
            fontWeight: 700,
            fontSize: "1.1rem",
            background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #004c8b 0%, #003366 100%)",
            },
            borderRadius: 3,
            boxShadow: "0 4px 15px rgba(0, 119, 190, 0.3)",
          }}
        >
          Xem chính sách & điều khoản
        </Button>
      </Box>
    </Container>
  );
};
