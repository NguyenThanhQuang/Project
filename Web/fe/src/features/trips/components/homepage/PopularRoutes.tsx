import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  // CardActions,
  // Button,
  Chip,
} from "@mui/material";
import { DirectionsBus, TrendingUp } from "@mui/icons-material";

const popularRoutesData = [
  {
    from: "Hồ Chí Minh",
    to: "Đà Lạt",
    price: "150,000₫",
    duration: "6h",
    trend: "+15%",
  },
];

export const PopularRoutes: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Tuyến đường hot nhất
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Những tuyến đường được đặt nhiều nhất với mức tăng trưởng ấn tượng
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {popularRoutesData.map((route, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: "0 20px 40px rgba(0, 119, 190, 0.2)",
                },
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)",
                border: "1px solid rgba(0, 119, 190, 0.1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <DirectionsBus
                      sx={{ color: "primary.main", mr: 1, fontSize: 28 }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, lineHeight: 1.2 }}
                      >
                        {route.from}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        đến {route.to}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    icon={<TrendingUp />}
                    label={route.trend}
                    size="small"
                    sx={{
                      background:
                        "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Chip
                    label={route.price}
                    sx={{
                      background:
                        "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                      color: "white",
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    label={route.duration}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
