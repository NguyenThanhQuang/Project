import React from "react";
import { Box, Container, Typography, Grid, Chip } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { SearchForm } from "./SearchForm";
import type { Location } from "../../../../types";

interface HeroSectionProps {
  searchData: {
    from: Location | null;
    to: Location | null;
    date: Dayjs;
    passengers: number;
  };
  setSearchData: React.Dispatch<
    React.SetStateAction<{
      from: Location | null;
      to: Location | null;
      date: Dayjs;
      passengers: number;
    }>
  >;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchData,
  setSearchData,
}) => {
  return (
    <Box
      id="hero-section"
      sx={{
        background:
          "linear-gradient(135deg, #0077be 0%, #004c8b 20%, #ffa726 100%)",
        color: "white",
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 30% 20%, rgba(255, 167, 38, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0, 119, 190, 0.4) 0%, transparent 50%)",
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 4 }}>
              <Chip
                label="Nền tảng đặt vé xe hàng đầu Việt Nam"
                sx={{
                  backgroundColor: "rgba(255, 167, 38, 0.2)",
                  color: "white",
                  fontWeight: 600,
                  mb: 3,
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 167, 38, 0.3)",
                }}
              />
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                lineHeight: 1.1,
              }}
            >
              Đặt vé xe khách
              <br />
              <Typography
                component="span"
                variant="h1"
                sx={{
                  background:
                    "linear-gradient(135deg, #ffa726 0%, #ffcc02 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "2.4rem", md: "3.4rem" },
                }}
              >
                thông minh & tiện lợi
              </Typography>
            </Typography>
            <Typography
              variant="h5"
              sx={{ mb: 4, opacity: 0.95, fontWeight: 400 }}
            >
              Hơn 5000+ tuyến đường và 2000+ nhà xe uy tín trên toàn quốc.
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "secondary.main" }}
                  >
                    1000+
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Chuyến xe mỗi ngày
                  </Typography>
                </Box>
              </Grid>
              <Grid size={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "secondary.main" }}
                  >
                    99%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Khách hàng hài lòng
                  </Typography>
                </Box>
              </Grid>
              <Grid size={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "secondary.main" }}
                  >
                    24/7
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Hỗ trợ chuyên nghiệp
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <SearchForm searchData={searchData} setSearchData={setSearchData} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
