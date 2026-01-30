import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
} from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  Cancel,
  Warning,
  EventSeat,
  LocationOn,
  Schedule,
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useNotification } from "../../../components/common/NotificationProvider";
import api from "../../../services/api";

interface Booking {
  _id: string;
  status: "HELD" | "CONFIRMED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  totalAmount: number;
  passengers: Array<{
    name: string;
    phone: string;
    seatNumber: string;
    price: number;
  }>;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  heldUntil?: string;
  ticketCode?: string;
  createdAt: string;
  tripId: {
    _id: string;
    departureTime: string;
    arrivalTime: string;
    companyId: {
      name: string;
      logoUrl?: string;
    };
    route: {
      fromLocationId: {
        name: string;
        fullAddress: string;
      };
      toLocationId: {
        name: string;
        fullAddress: string;
      };
    };
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bookings-tabpanel-${index}`}
      aria-labelledby={`bookings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const MyBookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [heldBookings, setHeldBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  
  const { showNotification } = useNotification();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Lấy vé đang giữ chỗ
      const heldResponse = await api.get("/bookings/held");
      // Kiểm tra cấu trúc response
      const heldData = Array.isArray(heldResponse) ? heldResponse : 
                      heldResponse?.data ? heldResponse.data : 
                      heldResponse?.data?.data ? heldResponse.data.data : [];
      setHeldBookings(heldData);

      // Lấy tất cả vé (đã xác nhận và đã hủy)
      try {
        const allResponse = await api.get("/bookings/my-bookings");
        // Kiểm tra cấu trúc response
        const allBookings = Array.isArray(allResponse) ? allResponse : 
                           allResponse?.data ? allResponse.data : 
                           allResponse?.data?.data ? allResponse.data.data : [];
        
        // Phân loại booking
        const confirmed = Array.isArray(allBookings) ? allBookings.filter(
          (b: Booking) => b.status === "CONFIRMED"
        ) : [];
        const cancelled = Array.isArray(allBookings) ? allBookings.filter(
          (b: Booking) => b.status === "CANCELLED"
        ) : [];
        
        setConfirmedBookings(confirmed);
        setCancelledBookings(cancelled);
      } catch (apiError) {
        // Nếu API /my-bookings chưa có, sử dụng dữ liệu mẫu
        console.log("API /bookings/my-bookings not available, using sample data");
      }
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      
      // Sử dụng dữ liệu mẫu khi API lỗi
      const sampleBookings: Booking[] = [
        {
          _id: "1",
          status: "HELD",
          paymentStatus: "PENDING",
          totalAmount: 250000,
          passengers: [
            { name: "Nguyễn Văn A", phone: "0123456789", seatNumber: "A1", price: 250000 }
          ],
          contactName: "Nguyễn Văn A",
          contactPhone: "0123456789",
          heldUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          tripId: {
            _id: "trip1",
            departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            arrivalTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
            companyId: {
              name: "Công ty Xe khách ABC",
              logoUrl: "https://via.placeholder.com/50"
            },
            route: {
              fromLocationId: {
                name: "Hà Nội",
                fullAddress: "Bến xe Mỹ Đình, Hà Nội"
              },
              toLocationId: {
                name: "Hải Phòng",
                fullAddress: "Bến xe Lạch Tray, Hải Phòng"
              }
            }
          }
        },
        {
          _id: "2",
          status: "CONFIRMED",
          paymentStatus: "PAID",
          totalAmount: 500000,
          passengers: [
            { name: "Trần Thị B", phone: "0987654321", seatNumber: "B3", price: 250000 },
            { name: "Trần Văn C", phone: "0987654322", seatNumber: "B4", price: 250000 }
          ],
          contactName: "Trần Thị B",
          contactPhone: "0987654321",
          ticketCode: "ABC12345",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          tripId: {
            _id: "trip2",
            departureTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            arrivalTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
            companyId: {
              name: "Công ty Xe khách XYZ",
              logoUrl: "https://via.placeholder.com/50"
            },
            route: {
              fromLocationId: {
                name: "Hà Nội",
                fullAddress: "Bến xe Mỹ Đình, Hà Nội"
              },
              toLocationId: {
                name: "Đà Nẵng",
                fullAddress: "Bến xe Đà Nẵng"
              }
            }
          }
        }
      ];
      
      const held = sampleBookings.filter(b => b.status === "HELD");
      const confirmed = sampleBookings.filter(b => b.status === "CONFIRMED");
      const cancelled: Booking[] = [];
      
      setHeldBookings(held);
      setConfirmedBookings(confirmed);
      setCancelledBookings(cancelled);
      
      showNotification("Đang sử dụng dữ liệu mẫu", "info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    
    // Refresh mỗi 30 giây để cập nhật trạng thái thời gian (chỉ cho tab vé đang giữ)
    const interval = setInterval(() => {
      if (activeTab === 0) {
        fetchBookings();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;
    
    try {
      await api.delete(`/bookings/${selectedBookingId}`);
      showNotification("Hủy vé thành công", "success");
      fetchBookings();
    } catch (error) {
      showNotification("Không thể hủy vé", "error");
    } finally {
      setOpenCancelDialog(false);
      setSelectedBookingId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm - dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return "Không xác định";
    }
  };

  const getTimeRemaining = (heldUntil?: string) => {
    if (!heldUntil) return "Không xác định";
    
    try {
      const now = new Date();
      const heldDate = new Date(heldUntil);
      const diffMs = heldDate.getTime() - now.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 0) return "Đã hết hạn";
      if (diffMins < 60) return `${diffMins} phút`;
      
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours} giờ ${mins} phút`;
    } catch (error) {
      return "Không xác định";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "HELD":
        return <AccessTime color="warning" />;
      case "CONFIRMED":
        return <CheckCircle color="success" />;
      case "CANCELLED":
        return <Cancel color="error" />;
      default:
        return <Warning color="warning" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "HELD":
        return "Đang giữ chỗ";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "HELD":
        return "warning";
      case "CONFIRMED":
        return "success";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  // Kiểm tra xem booking có hợp lệ không
  const isValidBooking = (booking: any): booking is Booking => {
    return booking && 
           booking._id && 
           booking.tripId && 
           booking.tripId.route && 
           booking.tripId.route.fromLocationId && 
           booking.tripId.route.toLocationId;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Vé của tôi
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab 
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTime />
                <span>Đang giữ chỗ ({Array.isArray(heldBookings) ? heldBookings.length : 0})</span>
              </Box>
            }
          />
          <Tab 
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircle />
                <span>Đã xác nhận ({Array.isArray(confirmedBookings) ? confirmedBookings.length : 0})</span>
              </Box>
            }
          />
          <Tab 
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Cancel />
                <span>Đã hủy ({Array.isArray(cancelledBookings) ? cancelledBookings.length : 0})</span>
              </Box>
            }
          />
        </Tabs>

        {loading && <LinearProgress />}

        {/* Tab 1: Vé đang giữ chỗ */}
        <TabPanel value={activeTab} index={0}>
          {!Array.isArray(heldBookings) || heldBookings.length === 0 ? (
            <Alert severity="info">
              Bạn không có vé nào đang trong trạng thái giữ chỗ.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {heldBookings
                .filter(isValidBooking)
                .map((booking) => (
                <Grid size={{ xs: 12 }} key={booking._id}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {booking.tripId.route.fromLocationId?.name || "Điểm đi"} →{" "}
                            {booking.tripId.route.toLocationId?.name || "Điểm đến"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {booking.tripId.companyId?.name || "Hãng xe"}
                          </Typography>
                        </Box>
                        <Chip
                          icon={getStatusIcon(booking.status)}
                          label={getStatusText(booking.status)}
                          color={getStatusColor(booking.status) as any}
                          variant="outlined"
                        />
                      </Box>

                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Schedule fontSize="small" />
                            <Typography variant="body2">
                              Khởi hành: {formatDateTime(booking.tripId.departureTime)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <EventSeat fontSize="small" />
                            <Typography variant="body2">
                              Số ghế: {booking.passengers?.map(p => p.seatNumber).join(", ") || "Không xác định"}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <AccessTime fontSize="small" color="warning" />
                            <Typography variant="body2" color="warning.main">
                              Thời gian còn lại: {getTimeRemaining(booking.heldUntil)}
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            Tổng tiền:{" "}
                            <Typography
                              component="span"
                              variant="body2"
                              color="primary"
                              sx={{ fontWeight: 600 }}
                            >
                              {formatPrice(booking.totalAmount || 0)}
                            </Typography>
                          </Typography>
                        </Grid>
                      </Grid>

                      <Alert severity="warning" sx={{ mb: 2 }}>
                        Vé đang trong trạng thái giữ chỗ. Vui lòng thanh toán trước khi hết thời gian.
                      </Alert>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setSelectedBookingId(booking._id);
                          setOpenCancelDialog(true);
                        }}
                      >
                        Hủy vé
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Tab 2: Vé đã xác nhận */}
        <TabPanel value={activeTab} index={1}>
          {!Array.isArray(confirmedBookings) || confirmedBookings.length === 0 ? (
            <Alert severity="info">
              Bạn không có vé nào đã được xác nhận.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {confirmedBookings
                .filter(isValidBooking)
                .map((booking) => (
                <Grid size={{ xs: 12 }} key={booking._id}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {booking.tripId.route.fromLocationId?.name || "Điểm đi"} →{" "}
                            {booking.tripId.route.toLocationId?.name || "Điểm đến"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {booking.tripId.companyId?.name || "Hãng xe"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                          <Chip
                            icon={<CheckCircle />}
                            label="Đã xác nhận"
                            color="success"
                            variant="outlined"
                          />
                          {booking.ticketCode && (
                            <Typography variant="caption" color="primary">
                              Mã vé: {booking.ticketCode}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Schedule fontSize="small" />
                            <Typography variant="body2">
                              Khởi hành: {formatDateTime(booking.tripId.departureTime)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LocationOn fontSize="small" />
                            <Typography variant="body2">
                              Đến: {formatDateTime(booking.tripId.arrivalTime)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <EventSeat fontSize="small" />
                            <Typography variant="body2">
                              Số ghế: {booking.passengers?.map(p => p.seatNumber).join(", ") || "Không xác định"}
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            Hành khách: {booking.passengers?.length || 0} người
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Liên hệ: {booking.contactName || "Không xác định"}
                          </Typography>
                          <Typography variant="body2">
                            Tổng tiền:{" "}
                            <Typography
                              component="span"
                              variant="body2"
                              color="primary"
                              sx={{ fontWeight: 600 }}
                            >
                              {formatPrice(booking.totalAmount || 0)}
                            </Typography>
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          if (booking.ticketCode) {
                            window.open(`/bookings/lookup?ticket=${booking.ticketCode}`, "_blank");
                          }
                        }}
                      >
                        Xem vé
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setSelectedBookingId(booking._id);
                          setOpenCancelDialog(true);
                        }}
                      >
                        Hủy vé
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Tab 3: Vé đã hủy */}
        <TabPanel value={activeTab} index={2}>
          {!Array.isArray(cancelledBookings) || cancelledBookings.length === 0 ? (
            <Alert severity="info">
              Bạn không có vé nào đã bị hủy.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {cancelledBookings
                .filter(isValidBooking)
                .map((booking) => (
                <Grid size={{ xs: 12 }} key={booking._id}>
                  <Card sx={{ opacity: 0.7 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {booking.tripId.route.fromLocationId?.name || "Điểm đi"} →{" "}
                            {booking.tripId.route.toLocationId?.name || "Điểm đến"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {booking.tripId.companyId?.name || "Hãng xe"}
                          </Typography>
                        </Box>
                        <Chip
                          icon={<Cancel />}
                          label="Đã hủy"
                          color="error"
                          variant="outlined"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        Đã hủy vào: {formatDateTime(booking.createdAt)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Paper>

      {/* Dialog hủy vé */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle>Xác nhận hủy vé</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn hủy vé này? Hành động này không thể hoàn tác.
            {selectedBookingId && heldBookings.find(b => b._id === selectedBookingId)?.status === "HELD" && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Vé đang giữ chỗ sẽ bị hủy ngay lập tức và không thể khôi phục.
              </Alert>
            )}
            {selectedBookingId && confirmedBookings.find(b => b._id === selectedBookingId)?.status === "CONFIRMED" && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Vé đã xác nhận sẽ bị hủy. Có thể áp dụng chính sách hoàn tiền theo quy định.
              </Alert>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>Không</Button>
          <Button onClick={handleCancelBooking} color="error" autoFocus>
            Có, hủy vé
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyBookingsPage;