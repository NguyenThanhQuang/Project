import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  Facebook,
  Instagram,
  YouTube,
  Twitter,
} from "@mui/icons-material";

const Footer: React.FC = () => {
  return (
    <Box
      id="footer"
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)",
        color: "white",
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 3, color: "white" }}
            >
              VeXeRe
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 2, color: "rgba(255, 255, 255, 0.8)" }}
            >
              Nền tảng đặt vé xe khách hàng đầu Việt Nam, kết nối hàng triệu
              hành khách với các nhà xe uy tín.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton sx={{ color: "white" }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: "white" }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: "white" }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: "white" }}>
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 3, color: "white" }}
            >
              Dịch vụ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                Đặt vé xe khách
              </Link>
              <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                Thuê xe du lịch
              </Link>
              <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                Vé máy bay
              </Link>
              <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                Đặt phòng khách sạn
              </Link>
              <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                Bảo hiểm du lịch
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 3, color: "white" }}
            >
              Hỗ trợ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                Trung tâm trợ giúp
              </Link>
              <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                Liên hệ
              </Link>
              <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                Câu hỏi thường gặp
              </Link>
              <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                Điều khoản sử dụng
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 3, color: "white" }}
            >
              Liên hệ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone
                  sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 20 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  1900 6067
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email
                  sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 20 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  support@vexere.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <LocationOn
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: 20,
                    mt: 0.5,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  T
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2025 BusBooking
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link
              href="#"
              color="inherit"
              sx={{
                textDecoration: "none",
                opacity: 0.7,
                "&:hover": { opacity: 1 },
              }}
            >
              <Typography variant="body2">Chính sách bảo mật</Typography>
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{
                textDecoration: "none",
                opacity: 0.7,
                "&:hover": { opacity: 1 },
              }}
            >
              <Typography variant="body2">Điều khoản</Typography>
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{
                textDecoration: "none",
                opacity: 0.7,
                "&:hover": { opacity: 1 },
              }}
            >
              <Typography variant="body2">Cookies</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
