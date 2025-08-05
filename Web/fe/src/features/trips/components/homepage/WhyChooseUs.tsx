import { FlashOn, Security, Support } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Box, Container, Grid } from "@mui/system";

export const WhyChooseUs: React.FC = () => {
  return (
    <Box sx={{ bgcolor: "grey.50", py: 10 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Tại sao chọn BusBooking?
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Trải nghiệm đặt vé hoàn toàn mới với công nghệ tiên tiến
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: "center", p: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                  boxShadow: "0 10px 30px rgba(0, 119, 190, 0.3)",
                }}
              >
                <FlashOn sx={{ fontSize: 40, color: "white" }} />
              </Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                Đặt vé siêu tốc
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Công nghệ AI giúp tìm kiếm và đặt vé chỉ trong 30 giây với độ
                chính xác 99.9%
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: "center", p: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #ffa726 0%, #ff8f00 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                  boxShadow: "0 10px 30px rgba(255, 167, 38, 0.3)",
                }}
              >
                <Security sx={{ fontSize: 40, color: "white" }} />
              </Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                Bảo mật tuyệt đối
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Mã hóa SSL 256-bit và bảo mật 2 lớp cho mọi giao dịch thanh toán
                an toàn 100%
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: "center", p: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                  boxShadow: "0 10px 30px rgba(72, 187, 120, 0.3)",
                }}
              >
                <Support sx={{ fontSize: 40, color: "white" }} />
              </Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                Hỗ trợ 24/7
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Chatbot AI và đội ngũ chuyên viên sẵn sàng hỗ trợ bạn mọi lúc
                mọi nơi
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
