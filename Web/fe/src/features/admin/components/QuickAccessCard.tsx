import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  DirectionsBus,
  People,
  Assessment,
  Settings,
} from "@mui/icons-material";

const QuickAccessCard: React.FC = () => {
  const navigate = useNavigate();
  const quickLinks = [
    {
      title: "Quản lý Nhà xe",
      icon: <DirectionsBus />,
      path: "/admin/companies",
      color: "#1976d2",
      bgColor: "#e3f2fd",
    },
    {
      title: "Quản lý Người dùng",
      icon: <People />,
      path: "/admin/users",
      color: "#2e7d32",
      bgColor: "#e8f5e8",
    },
    {
      title: "Báo cáo Tài chính",
      icon: <Assessment />,
      path: "/admin/finance",
      color: "#f57c00",
      bgColor: "#fff3e0",
    },
    {
      title: "Cấu hình Hệ thống",
      icon: <Settings />,
      path: "/admin/settings",
      color: "#7b1fa2",
      bgColor: "#f3e5f5",
    },
  ];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Truy cập nhanh
        </Typography>
        <Grid container spacing={2}>
          {quickLinks.map((link) => (
            <Grid size={{ xs: 12 }} key={link.path}>
              <Box
                onClick={() => navigate(link.path)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: link.bgColor,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 20px ${link.color}33`,
                  },
                }}
              >
                <Box sx={{ color: link.color, mb: 1 }}>{link.icon}</Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: link.color }}
                >
                  {link.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickAccessCard;
