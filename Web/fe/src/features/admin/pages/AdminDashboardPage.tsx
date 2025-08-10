import React from "react";
import { Container, Grid, Alert, CircularProgress } from "@mui/material";
import {
  DirectionsBus,
  MonetizationOn,
  LocalShipping,
  Person,
} from "@mui/icons-material";

import { useAdminStats } from "../hooks/useAdminStats";
import StatCard from "../components/StatCard";
import TodayActivityCard from "../components/TodayActivityCard";
import QuickAccessCard from "../components/QuickAccessCard";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN").format(amount) + "đ";
const formatNumber = (num: number) =>
  new Intl.NumberFormat("vi-VN").format(num);

const AdminDashboardPage: React.FC = () => {
  const { stats, loading, error } = useAdminStats();

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error || !stats) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error">{error || "Không có dữ liệu."}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<DirectionsBus />}
            title="Nhà xe"
            value={formatNumber(stats.totalCompanies)}
            subtitle="Tổng số nhà xe đang hoạt động"
            color="#1976d2"
            bgColor="#e3f2fd"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<Person />}
            title="Người dùng"
            value={formatNumber(stats.totalUsers)}
            subtitle="Tổng số người dùng cuối"
            color="#2e7d32"
            bgColor="#e8f5e8"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<LocalShipping />}
            title="Đặt vé"
            value={formatNumber(stats.totalBookings)}
            subtitle="Tổng số vé đã được xác nhận"
            color="#f57c00"
            bgColor="#fff3e0"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<MonetizationOn />}
            title="Doanh thu"
            value={formatCurrency(stats.totalRevenue)}
            subtitle="Tổng doanh thu"
            color="#7b1fa2"
            bgColor="#f3e5f5"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TodayActivityCard
            todayBookings={stats.todayBookings}
            activeTrips={stats.activeTrips}
            newCompanies={stats.newCompaniesToday}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <QuickAccessCard />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboardPage;
