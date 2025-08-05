import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";

const stepsData = [
  {
    step: 1,
    title: "Tìm kiếm thông minh",
    desc: "Hệ thống tìm kiếm giúp bạn chọn chuyến xe phù hợp nhất.",
  },
  {
    step: 2,
    title: "Chọn ghế & giữ chỗ",
    desc: "Sơ đồ ghế trực quan giúp bạn chọn vị trí tốt nhất.",
  },
  {
    step: 3,
    title: "Thanh toán an toàn",
    desc: "Đa dạng phương thức thanh toán với bảo mật tối đa.",
  },
  {
    step: 4,
    title: "Lên xe & tận hưởng",
    desc: "Sử dụng mã vé điện tử để lên xe và bắt đầu hành trình.",
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, #0077be 0%, #004c8b 20%, #ffa726 100%)",
        py: 10,
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Cách thức hoạt động
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Chỉ 4 bước đơn giản để có chuyến đi hoàn hảo
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {stepsData.map((item, index) => (
            <Grid key={index} size={{ xs: 12, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    mx: "auto",
                    mb: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      background: "rgba(255, 167, 38, 0.3)",
                    },
                  }}
                >
                  {item.step}
                </Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                  {item.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.9, lineHeight: 1.6 }}
                >
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
