import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DirectionsBus } from "@mui/icons-material";
import { getPopularRoutes } from "../../../trips/services/tripService";
import type { PopularRoute } from "../../types/trip";
import type { LocationData } from "../../types/location";

interface PopularRoutesProps {
  onRouteSelect: (from: LocationData, to: LocationData) => void;
}

export const PopularRoutes: React.FC<PopularRoutesProps> = ({
  onRouteSelect,
}) => {
  const [routes, setRoutes] = useState<PopularRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularRoutes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPopularRoutes();
        setRoutes(data);
      } catch (err) {
        console.error("Failed to fetch popular routes:", err);
        setError("Không thể tải danh sách các tuyến đường phổ biến.");
      } finally {
        setLoading(false);
      }
    };
    fetchPopularRoutes();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress size={50} />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="warning" sx={{ mt: 3 }}>
          {error}
        </Alert>
      );
    }

    if (routes.length === 0) {
      return (
        <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
          Hiện chưa có dữ liệu về các tuyến đường phổ biến.
        </Typography>
      );
    }

    return (
      <Grid container spacing={4}>
        {routes.map((route, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2.4 }} key={index}>
            <Card
              onClick={() =>
                onRouteSelect(route.fromLocation, route.toLocation)
              }
              sx={{
                height: "100%",
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: "0 20px 40px rgba(0, 119, 190, 0.2)",
                  borderColor: "primary.main",
                },
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)",
                border: "1px solid rgba(0, 119, 190, 0.1)",
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <DirectionsBus
                    sx={{ color: "primary.main", mr: 1.5, fontSize: 28 }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, lineHeight: 1.2 }}
                    >
                      {route.fromLocation.province}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      đến {route.toLocation.province}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

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
          {/* Những tuyến đường được hành khách lựa chọn nhiều nhất trong 90 ngày
          qua */}
        </Typography>
      </Box>
      {renderContent()}
    </Container>
  );
};

export default PopularRoutes;
