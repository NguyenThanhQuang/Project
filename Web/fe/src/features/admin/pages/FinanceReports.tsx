import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  CircularProgress,
  Alert,
  type SelectChangeEvent,
} from "@mui/material";
import {
  MonetizationOn,
  Assessment,
  Download,
  AccountBalance,
  Receipt,
  LocalShipping,
  DirectionsBus,
  Refresh,
} from "@mui/icons-material";
import { useFinanceReport } from "../hooks/useFinanceReport";
import type { ReportPeriod, Transaction } from "../types/finance";

const FinanceReports: React.FC = () => {
  const { reportData, loading, error, period, setPeriod, refetch } =
    useFinanceReport();

  const handlePeriodChange = (event: SelectChangeEvent<ReportPeriod>) => {
    setPeriod(event.target.value as ReportPeriod);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getTransactionColor = (type: Transaction["type"]) =>
    (({
      booking: "success",
      refund: "error",
      commission: "info",
    }[type] || "default") as "success" | "error" | "info" | "default");

  const getTransactionText = (type: Transaction["type"]) =>
    ({
      booking: "Đặt vé",
      refund: "Hoàn tiền",
      commission: "Hoa hồng",
    }[type]);

  const getStatusColor = (status: Transaction["status"]) =>
    (({
      completed: "success",
    }[status] || "default") as "success");

  const getStatusText = (status: Transaction["status"]) =>
    ({
      completed: "Hoàn thành",
    }[status]);

  if (loading && !reportData) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert
          severity="error"
          action={
            <Button onClick={refetch}>
              <Refresh />
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!reportData) {
    return (
      <Container>
        <Alert severity="info">Không có dữ liệu để hiển thị.</Alert>
      </Container>
    );
  }

  const { overview, revenueChartData, topCompanies, recentTransactions } =
    reportData;
  const maxChartRevenue = Math.max(
    ...revenueChartData.map((d) => d.revenue),
    1
  );
  const totalTopCompanyRevenue = topCompanies.reduce(
    (sum, c) => sum + c.revenue,
    0
  );

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Filter Controls */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Thời gian</InputLabel>
              <Select
                value={period}
                label="Thời gian"
                onChange={handlePeriodChange}
              >
                <MenuItem value="7d">7 ngày qua</MenuItem>
                <MenuItem value="30d">30 ngày qua</MenuItem>
                <MenuItem value="90d">90 ngày qua</MenuItem>
                <MenuItem value="365d">1 năm qua</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              fullWidth
              sx={{ height: 56 }}
            >
              Xuất báo cáo
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Button
              variant="contained"
              startIcon={<Assessment />}
              fullWidth
              sx={{
                height: 56,
                background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
              }}
            >
              Tạo báo cáo tùy chỉnh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Financial Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#e3f2fd", color: "#1976d2", mr: 2 }}>
                  <MonetizationOn />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Doanh thu kỳ
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#1976d2", mb: 1 }}
              >
                {formatCurrency(overview.periodRevenue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng doanh thu toàn thời gian:{" "}
                {formatCurrency(overview.totalRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Other stat cards */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#fff3e0", color: "#f57c00", mr: 2 }}>
                  <LocalShipping />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Tổng vé đặt
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#f57c00", mb: 1 }}
              >
                {overview.totalBookings.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trong kỳ báo cáo
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#f3e5f5", color: "#7b1fa2", mr: 2 }}>
                  <Receipt />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Giá trị TB/Đơn
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#7b1fa2", mb: 1 }}
              >
                {formatCurrency(overview.averageOrderValue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trung bình mỗi vé
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#e8f5e8", color: "#2e7d32", mr: 2 }}>
                  <AccountBalance />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Hoa hồng
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#2e7d32", mb: 1 }}
              >
                {formatCurrency(overview.commission)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {((overview.commission / overview.periodRevenue) * 100).toFixed(
                  0
                )}
                % doanh thu kỳ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Revenue Chart and Top Companies */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Biểu đồ doanh thu
            </Typography>
            {revenueChartData.map((item) => (
              <Box key={item.date} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatDate(item.date)}
                  </Typography>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "primary.main" }}
                    >
                      {formatCurrency(item.revenue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.bookings} vé
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(item.revenue / maxChartRevenue) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Top nhà xe theo doanh thu
            </Typography>
            {topCompanies.map((company, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      mr: 2,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {company.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {company.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {company.bookings} vé
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatCurrency(company.revenue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(
                        (company.revenue / totalTopCompanyRevenue) *
                        100
                      ).toFixed(0)}
                      %
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(company.revenue / totalTopCompanyRevenue) * 100}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <Box sx={{ p: 3, borderBottom: "1px solid #f0f0f0" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Giao dịch gần đây
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f7fa" }}>
                <TableCell sx={{ fontWeight: 600 }}>Mã giao dịch</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ngày</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Loại</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nhà xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Số tiền</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {transaction.id.split("-")[0]}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(transaction.date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getTransactionText(transaction.type)}
                      color={getTransactionColor(transaction.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{ bgcolor: "primary.main", width: 24, height: 24 }}
                      >
                        <DirectionsBus fontSize="small" />
                      </Avatar>
                      <Typography variant="body2">
                        {transaction.company}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {transaction.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color:
                          transaction.amount > 0
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(transaction.status)}
                      color={getStatusColor(transaction.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default FinanceReports;
