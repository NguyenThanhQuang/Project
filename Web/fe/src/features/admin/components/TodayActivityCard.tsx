import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import type { TodayActivityCardProps } from "../types/dashboard";

const formatNumber = (num: number) =>
  new Intl.NumberFormat("vi-VN").format(num);

const TodayActivityCard: React.FC<TodayActivityCardProps> = ({
  todayBookings,
  activeTrips,
  newCompanies,
}) => (
  <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Hoạt động hôm nay
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="body1">Vé đặt mới</Typography>
        <Chip
          label={formatNumber(todayBookings)}
          color="primary"
          sx={{ fontWeight: 600 }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="body1">Chuyến đang hoạt động</Typography>
        <Chip
          label={formatNumber(activeTrips)}
          color="success"
          sx={{ fontWeight: 600 }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">Nhà xe mới đăng ký</Typography>
        <Chip
          label={formatNumber(newCompanies)}
          color="warning"
          sx={{ fontWeight: 600 }}
        />
      </Box>
    </CardContent>
  </Card>
);

export default TodayActivityCard;
