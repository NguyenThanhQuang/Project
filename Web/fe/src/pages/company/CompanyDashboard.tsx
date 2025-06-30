import React from "react";
import { Typography, Container } from "@mui/material";

const CompanyDashboard: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Company Dashboard
      </Typography>
      <Typography>
        Chào mừng Quản lý nhà xe! Đây là khu vực quản lý chuyến đi, xe, và tài
        xế.
      </Typography>
    </Container>
  );
};

export default CompanyDashboard;
