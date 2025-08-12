import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

interface VehicleStatsCardsProps {
  stats: {
    total: number;
    active: number;
    maintenance: number;
    inactive: number;
  };
}

const VehicleStatsCards: React.FC<VehicleStatsCardsProps> = ({ stats }) => (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            {stats.total}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Tổng số xe
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            color="success.main"
            sx={{ fontWeight: 700 }}
          >
            {stats.active}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Đang hoạt động
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            color="warning.main"
            sx={{ fontWeight: 700 }}
          >
            {stats.maintenance}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Bảo trì
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
            {stats.inactive}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Ngừng hoạt động
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

export default VehicleStatsCards;
