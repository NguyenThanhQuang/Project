import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Rating,
  Avatar,
} from "@mui/material";
import { Verified } from "@mui/icons-material";

const customerReviewsData = [
  {
    name: "Khanh",
    rating: 5,
    comment: "Dịch vụ tuyệt vời, xe sạch sẽ và đúng giờ. Sẽ tiếp tục ủng hộ!",
    route: "TP.HCM - Đà Lạt",
    verified: true,
  },
  {
    name: "Lan Anh",
    rating: 5,
    comment:
      "Tài xế thân thiện, hỗ trợ khách hàng rất nhiệt tình. Tôi rất hài lòng với chuyến đi.",
    route: "Hà Nội - Hải Phòng",
    verified: true,
  },
  {
    name: "Minh Đức",
    rating: 4,
    comment:
      "Xe chạy êm, ghế ngồi thoải mái. Chỉ có một điểm trừ nhỏ là wifi hơi yếu.",
    route: "Đà Nẵng - Huế",
    verified: false,
  },
];

export const CustomerReviews: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Khách hàng nói gì về chúng tôi?
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Hơn 10,000+ đánh giá 5 sao từ khách hàng thực tế
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {customerReviewsData.map((review, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 15px 35px rgba(0, 119, 190, 0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      mr: 2,
                      width: 48,
                      height: 48,
                      background:
                        "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                    }}
                  >
                    {review.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {review.name}
                      </Typography>
                      {review.verified && (
                        <Verified
                          sx={{ fontSize: 18, color: "success.main" }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {review.route}
                    </Typography>
                  </Box>
                </Box>
                <Rating value={review.rating} readOnly sx={{ mb: 2 }} />
                <Typography
                  variant="body1"
                  sx={{ fontStyle: "italic", lineHeight: 1.6 }}
                >
                  "{review.comment}"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
