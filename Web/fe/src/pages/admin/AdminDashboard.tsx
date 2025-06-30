import React from "react";
import { Typography, Container } from "@mui/material";

const AdminDashboard: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography>
        Chào mừng Admin! Đây là khu vực quản trị hệ thống.
      </Typography>
    </Container>
  );
};

export default AdminDashboard;
