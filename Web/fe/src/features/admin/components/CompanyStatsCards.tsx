import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
    <CardContent sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color, mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

interface CompanyStatsCardsProps {
  stats: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
  };
}

const CompanyStatsCards: React.FC<CompanyStatsCardsProps> = ({ stats }) => (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <StatCard title="Tổng số nhà xe" value={stats.total} color="#1976d2" />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <StatCard title="Đang hoạt động" value={stats.active} color="#2e7d32" />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <StatCard title="Chờ duyệt" value={stats.pending} color="#f57c00" />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <StatCard title="Tạm ngưng" value={stats.suspended} color="#d32f2f" />
    </Grid>
  </Grid>
);

export default CompanyStatsCards;
