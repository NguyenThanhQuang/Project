import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Star,
  CardGiftcard,
  History,
  Redeem,
  DirectionsBus,
  LocalOffer,
  EmojiEvents,
  TrendingUp,
  Timer,
  CheckCircle,
  Close,
} from "@mui/icons-material";
import { useNotification } from "../../../components/common/NotificationProvider";

interface UserPoints {
  current: number;
  total: number;
  nextTierPoints: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

interface Voucher {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType: "percentage" | "fixed";
  pointsCost: number;
  validUntil: string;
  minOrderAmount: number;
  maxDiscount?: number;
  category: "discount" | "upgrade" | "service";
  available: number;
  used?: boolean;
}

interface PointHistory {
  id: string;
  type: "earn" | "spend";
  amount: number;
  description: string;
  date: string;
  tripId?: string;
}

const LoyaltyProgram: React.FC = () => {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);

  const userPoints: UserPoints = {
    current: 2450,
    total: 8750,
    nextTierPoints: 10000,
    tier: "Silver",
  };

  const availableVouchers: Voucher[] = [
    {
      id: "v1",
      title: "Giảm 15% tổng giá trị",
      description: "Áp dụng cho tất cả tuyến đường",
      discount: 15,
      discountType: "percentage",
      pointsCost: 500,
      validUntil: "2024-02-28",
      minOrderAmount: 200000,
      maxDiscount: 50000,
      category: "discount",
      available: 100,
    },
    {
      id: "v2",
      title: "Miễn phí nâng cấp ghế VIP",
      description: "Nâng cấp từ ghế thường lên ghế VIP miễn phí",
      discount: 50000,
      discountType: "fixed",
      pointsCost: 800,
      validUntil: "2024-03-15",
      minOrderAmount: 150000,
      category: "upgrade",
      available: 50,
    },
    {
      id: "v3",
      title: "Giảm 50,000₫",
      description: "Giảm cố định cho đơn hàng từ 300,000₫",
      discount: 50000,
      discountType: "fixed",
      pointsCost: 1000,
      validUntil: "2024-04-30",
      minOrderAmount: 300000,
      category: "discount",
      available: 25,
    },
    {
      id: "v4",
      title: "Combo ăn uống miễn phí",
      description: "Miễn phí combo ăn uống trên xe",
      discount: 25000,
      discountType: "fixed",
      pointsCost: 300,
      validUntil: "2024-02-15",
      minOrderAmount: 100000,
      category: "service",
      available: 200,
    },
  ];

  const myVouchers: Voucher[] = [
    {
      ...availableVouchers[0],
      id: "mv1",
      used: false,
    },
    {
      ...availableVouchers[1],
      id: "mv2",
      used: true,
    },
  ];

  const pointHistory: PointHistory[] = [
    {
      id: "h1",
      type: "earn",
      amount: 150,
      description: "Đặt vé thành công - HCM → Đà Lạt",
      date: "2024-01-15",
      tripId: "T123",
    },
    {
      id: "h2",
      type: "spend",
      amount: -500,
      description: "Đổi voucher giảm 15%",
      date: "2024-01-10",
    },
    {
      id: "h3",
      type: "earn",
      amount: 200,
      description: "Đặt vé thành công - Hà Nội → Đà Nẵng",
      date: "2024-01-05",
      tripId: "T124",
    },
    {
      id: "h4",
      type: "earn",
      amount: 100,
      description: "Bonus đánh giá 5 sao",
      date: "2024-01-03",
    },
  ];

  const tierInfo = {
    Bronze: { color: "#cd7f32", nextTier: "Silver", pointsNeeded: 5000 },
    Silver: { color: "#c0c0c0", nextTier: "Gold", pointsNeeded: 10000 },
    Gold: { color: "#ffd700", nextTier: "Platinum", pointsNeeded: 25000 },
    Platinum: { color: "#e5e4e2", nextTier: null, pointsNeeded: null },
  };

  const getTierProgress = () => {
    const currentTierInfo = tierInfo[userPoints.tier];
    if (!currentTierInfo.pointsNeeded) return 100;

    return (userPoints.total / currentTierInfo.pointsNeeded) * 100;
  };

  const handleRedeemVoucher = async (voucher: Voucher) => {
    if (userPoints.current < voucher.pointsCost) {
      showNotification("Điểm không đủ để đổi voucher này", "error");
      return;
    }

    setSelectedVoucher(voucher);
    setRedeemDialogOpen(true);
  };

  const confirmRedeem = async () => {
    if (!selectedVoucher) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showNotification("Đổi voucher thành công!", "success");
      setRedeemDialogOpen(false);
      setSelectedVoucher(null);
    } catch (error) {
      console.error("Redeem error:", error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại.", "error");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
  };

  const getVoucherIcon = (category: string) => {
    switch (category) {
      case "discount":
        return <LocalOffer />;
      case "upgrade":
        return <TrendingUp />;
      case "service":
        return <CardGiftcard />;
      default:
        return <Redeem />;
    }
  };

  const renderOverview = () => (
    <Grid container spacing={4}>
      {/* Points Overview */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: tierInfo[userPoints.tier].color,
                width: 64,
                height: 64,
                mr: 3,
              }}
            >
              <EmojiEvents sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: tierInfo[userPoints.tier].color }}
              >
                {userPoints.tier}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hạng thành viên hiện tại
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  {userPoints.current.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Điểm hiện có
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {userPoints.total.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng điểm tích lũy
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "success.main" }}
                >
                  {tierInfo[userPoints.tier].pointsNeeded
                    ? (
                        tierInfo[userPoints.tier].pointsNeeded! -
                        userPoints.total
                      ).toLocaleString()
                    : "∞"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Điểm để lên hạng
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {tierInfo[userPoints.tier].nextTier && (
            <Box sx={{ mt: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">
                  Tiến độ lên hạng {tierInfo[userPoints.tier].nextTier}
                </Typography>
                <Typography variant="body2">
                  {Math.round(getTierProgress())}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getTierProgress()}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Quick Stats */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                borderRadius: 3,
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <DirectionsBus
                  sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  15 chuyến đi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tháng này
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                borderRadius: 3,
                background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <CardGiftcard
                  sx={{ fontSize: 40, color: "secondary.main", mb: 1 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {myVouchers.length} voucher
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đang sở hữu
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderVouchers = () => (
    <Grid container spacing={3}>
      {availableVouchers.map((voucher) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={voucher.id}>
          <Card
            sx={{
              borderRadius: 3,
              height: "100%",
              position: "relative",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  {getVoucherIcon(voucher.category)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, lineHeight: 1.2 }}
                  >
                    {voucher.title}
                  </Typography>
                  <Chip
                    label={
                      voucher.category === "discount"
                        ? "Giảm giá"
                        : voucher.category === "upgrade"
                        ? "Nâng cấp"
                        : "Dịch vụ"
                    }
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {voucher.description}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Điều kiện: Đơn từ {formatPrice(voucher.minOrderAmount)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hết hạn: {formatDate(voucher.validUntil)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Còn lại: {voucher.available} voucher
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Star sx={{ color: "warning.main", fontSize: 20 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "warning.main" }}
                  >
                    {voucher.pointsCost}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleRedeemVoucher(voucher)}
                  disabled={
                    userPoints.current < voucher.pointsCost ||
                    voucher.available === 0
                  }
                  sx={{
                    background:
                      "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                  }}
                >
                  Đổi ngay
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderMyVouchers = () => (
    <Grid container spacing={3}>
      {myVouchers.map((voucher) => (
        <Grid size={{ xs: 12, sm: 6 }} key={voucher.id}>
          <Card
            sx={{
              borderRadius: 3,
              opacity: voucher.used ? 0.6 : 1,
              border: voucher.used
                ? "2px dashed #ccc"
                : "2px solid transparent",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {voucher.title}
                </Typography>
                <Chip
                  label={voucher.used ? "Đã sử dụng" : "Có thể sử dụng"}
                  color={voucher.used ? "default" : "success"}
                  size="small"
                  icon={voucher.used ? <CheckCircle /> : <Timer />}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {voucher.description}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Hết hạn: {formatDate(voucher.validUntil)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderHistory = () => (
    <Box>
      {pointHistory.map((item) => (
        <Card key={item.id} variant="outlined" sx={{ mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {item.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(item.date)}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: item.type === "earn" ? "success.main" : "error.main",
                }}
              >
                {item.type === "earn" ? "+" : ""}
                {item.amount}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
            color: "white",
            p: 4,
            textAlign: "center",
          }}
        >
          <Star sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Chương trình tích điểm
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Tích điểm - Đổi quà - Nhận ưu đãi
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ mb: 4 }}
          >
            <Tab label="Tổng quan" icon={<EmojiEvents />} />
            <Tab label="Đổi voucher" icon={<CardGiftcard />} />
            <Tab label="Voucher của tôi" icon={<Redeem />} />
            <Tab label="Lịch sử điểm" icon={<History />} />
          </Tabs>

          {activeTab === 0 && renderOverview()}
          {activeTab === 1 && renderVouchers()}
          {activeTab === 2 && renderMyVouchers()}
          {activeTab === 3 && renderHistory()}
        </Box>
      </Paper>

      {/* Redeem Confirmation Dialog */}
      <Dialog
        open={redeemDialogOpen}
        onClose={() => setRedeemDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Xác nhận đổi voucher
            <IconButton onClick={() => setRedeemDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedVoucher && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Bạn có chắc chắn muốn đổi voucher này không?
              </Alert>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedVoucher.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedVoucher.description}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1">
                  Chi phí: <strong>{selectedVoucher.pointsCost} điểm</strong>
                </Typography>
                <Typography variant="body1">
                  Điểm còn lại:{" "}
                  <strong>
                    {userPoints.current - selectedVoucher.pointsCost} điểm
                  </strong>
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRedeemDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={confirmRedeem}>
            Xác nhận đổi
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoyaltyProgram;
