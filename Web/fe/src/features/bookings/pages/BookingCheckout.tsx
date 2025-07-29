import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  CardContent,
  Divider,
  Avatar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormLabel,
  FormGroup,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Person,
  Phone,
  Payment,
  Schedule,
  LocationOn,
  Timer,
  ExpandMore,
  CreditCard,
  AccountBalance,
  QrCode,
  EventSeat,
  DirectionsBus,
  MyLocation,
  Place,
} from "@mui/icons-material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useNotification } from "../../../components/common/NotificationProvider";
import { getTrip, getRoute, getCompany } from "../../../data/busData";

interface PassengerInfo {
  name: string;
  phone: string;
  seatNumber: string;
}

interface BookingData {
  tripId: string;
  selectedSeats: string[];
  totalPrice: number;
}

interface Seat {
  id: string;
  number: string;
  isOccupied: boolean;
  price: number;
}

interface PickupLocation {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  estimatedTime: string;
}

const BookingCheckout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotification();

  // Check if coming from map (URL params) or from seat selection (location.state)
  const bookingData = location.state as BookingData;
  const tripIdFromUrl = searchParams.get("trip");
  const seatsFromUrl = parseInt(searchParams.get("seats") || "1");
  const dateFromUrl = searchParams.get("date");

  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [holdTimer, setHoldTimer] = useState<number>(15 * 60); // 15 minutes
  const [loading, setLoading] = useState(false);

  // State for seat selection (when coming from map)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // State for pickup location selection
  const [selectedPickupLocation, setSelectedPickupLocation] =
    useState<PickupLocation | null>(null);

  // Trip data from centralized data
  const trip = getTrip(tripIdFromUrl || bookingData?.tripId || "");
  const route = trip ? getRoute(trip.routeId) : null;
  const company = trip ? getCompany(trip.companyId) : null;

  const steps = tripIdFromUrl
    ? ["Chọn ghế", "Địa chỉ đón", "Thông tin hành khách", "Thanh toán"]
    : ["Địa chỉ đón", "Thông tin hành khách", "Thanh toán"];

  // Generate pickup locations along the route
  const generatePickupLocations = (): PickupLocation[] => {
    if (!route) return [];

    const locations: PickupLocation[] = [];
    const routeNames: { [key: string]: PickupLocation[] } = {
      "hanoi-haiphong": [
        {
          id: "pickup-1",
          name: "Bến xe Giáp Bát",
          address: "Giải Phóng, Hoàng Mai, Hà Nội",
          coordinates: [21.0285, 105.8342],
          estimatedTime: "08:00",
        },
        {
          id: "pickup-2",
          name: "Cầu Chui Gia Lâm",
          address: "Gia Lâm, Hà Nội",
          coordinates: [21.0583, 105.9173],
          estimatedTime: "08:30",
        },
        {
          id: "pickup-3",
          name: "Trung tâm Hải Dương",
          address: "Nguyễn Lương Bằng, Hải Dương",
          coordinates: [21.1213, 106.1066],
          estimatedTime: "09:15",
        },
        {
          id: "pickup-4",
          name: "Chí Linh",
          address: "QL5, Chí Linh, Hải Dương",
          coordinates: [20.9653, 106.3969],
          estimatedTime: "09:45",
        },
      ],
      "hanoi-danang": [
        {
          id: "pickup-1",
          name: "Bến xe Giáp Bát",
          address: "Giải Phóng, Hoàng Mai, Hà Nội",
          coordinates: [21.0285, 105.8342],
          estimatedTime: "06:00",
        },
        {
          id: "pickup-2",
          name: "Ninh Bình",
          address: "QL1A, Ninh Bình",
          coordinates: [20.2506, 105.9745],
          estimatedTime: "08:30",
        },
        {
          id: "pickup-3",
          name: "Thanh Hóa",
          address: "QL1A, Thanh Hóa",
          coordinates: [19.8067, 105.7851],
          estimatedTime: "11:00",
        },
        {
          id: "pickup-4",
          name: "Vinh",
          address: "QL1A, Vinh, Nghệ An",
          coordinates: [18.6791, 105.6811],
          estimatedTime: "13:30",
        },
        {
          id: "pickup-5",
          name: "Huế",
          address: "QL1A, Huế, Thừa Thiên Huế",
          coordinates: [16.4637, 107.5908],
          estimatedTime: "18:00",
        },
      ],
      "hcmc-cantho": [
        {
          id: "pickup-1",
          name: "Bến xe Miền Tây",
          address: "An Lạc, Bình Tân, TP.HCM",
          coordinates: [10.7387, 106.6142],
          estimatedTime: "07:00",
        },
        {
          id: "pickup-2",
          name: "Long An",
          address: "QL1A, Tân An, Long An",
          coordinates: [10.5359, 106.4137],
          estimatedTime: "08:00",
        },
        {
          id: "pickup-3",
          name: "Cao Lãnh",
          address: "QL80, Cao Lãnh, Đồng Tháp",
          coordinates: [10.4592, 105.6344],
          estimatedTime: "09:00",
        },
      ],
      "danang-hue": [
        {
          id: "pickup-1",
          name: "Bến xe Trung tâm Đà Nẵng",
          address: "Điện Biên Phủ, Hải Châu, Đà Nẵng",
          coordinates: [16.0471, 108.2068],
          estimatedTime: "08:00",
        },
        {
          id: "pickup-2",
          name: "Đèo Hải Vân",
          address: "QL1A, Hải Vân, Đà Nẵng",
          coordinates: [16.2043, 108.1261],
          estimatedTime: "08:45",
        },
        {
          id: "pickup-3",
          name: "Lăng Cô",
          address: "QL1A, Lăng Cô, Thừa Thiên Huế",
          coordinates: [16.2388, 108.0867],
          estimatedTime: "09:15",
        },
      ],
    };

    return routeNames[route.id] || [];
  };

  const availablePickupLocations = generatePickupLocations();

  // Generate seat layout (simplified - 40 seats in 2 columns)
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const seatLetters = ["A", "B"];
    for (let row = 1; row <= 20; row++) {
      for (let col = 0; col < seatLetters.length; col++) {
        const seatNumber = `${seatLetters[col]}${row}`;
        const isOccupied = Math.random() < 0.3; // 30% chance of being occupied
        seats.push({
          id: `seat-${seatNumber}`,
          number: seatNumber,
          isOccupied,
          price: trip?.price || 150000,
        });
      }
    }
    return seats;
  };

  const availableSeats = generateSeats();

  // Extract start and end cities from route name
  const getRouteCities = () => {
    if (!route) return { startCity: "", endCity: "" };
    const cities = route.name.split(" - ");
    return {
      startCity: cities[0] || "",
      endCity: cities[1] || "",
    };
  };

  const { startCity, endCity } = getRouteCities();

  useEffect(() => {
    // If no trip data found, redirect to home
    if (!trip || !route || !company) {
      showNotification("Không tìm thấy thông tin chuyến xe", "error");
      navigate("/");
      return;
    }

    if (bookingData) {
      // Coming from seat selection - go directly to pickup selection
      const initialPassengers = bookingData.selectedSeats.map((seatId) => {
        const seat = availableSeats.find((s) => s.id === seatId);
        return {
          name: "",
          phone: "",
          seatNumber: seat?.number || "",
        };
      });
      setPassengers(initialPassengers);
      setCurrentStep(tripIdFromUrl ? 1 : 0); // Skip seat selection if coming from existing booking
    } else if (tripIdFromUrl) {
      // Coming from map - start with seat selection
      setCurrentStep(0);
    }
  }, [trip, route, company, bookingData, navigate, showNotification]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHoldTimer((prev) => {
        if (prev <= 1) {
          showNotification(
            "Hết thời gian giữ ghế. Vui lòng chọn lại ghế.",
            "warning"
          );
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, showNotification]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSeatToggle = (seatId: string, seatNumber: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else {
        if (prev.length >= seatsFromUrl) {
          showNotification(
            `Chỉ có thể chọn tối đa ${seatsFromUrl} ghế`,
            "warning"
          );
          return prev;
        }
        return [...prev, seatId];
      }
    });
  };

  const handleContinueToPickupSelection = () => {
    if (selectedSeats.length === 0) {
      showNotification("Vui lòng chọn ít nhất một ghế", "warning");
      return;
    }
    setCurrentStep(1);
  };

  const handlePickupLocationSelect = (location: PickupLocation) => {
    setSelectedPickupLocation(location);
  };

  const handleContinueToPassengerInfo = () => {
    if (!selectedPickupLocation) {
      showNotification("Vui lòng chọn địa chỉ đón", "warning");
      return;
    }

    const initialPassengers = (bookingData?.selectedSeats || selectedSeats).map(
      (seatId) => {
        const seat = availableSeats.find((s) => s.id === seatId);
        return {
          name: "",
          phone: "",
          seatNumber: seat?.number || "",
        };
      }
    );
    setPassengers(initialPassengers);
    setCurrentStep(tripIdFromUrl ? 2 : 1);
  };

  const handlePassengerChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const isFormValid = () => {
    const passengersValid = passengers.every(
      (p) => p.name.trim() && p.phone.trim()
    );
    const contactValid =
      contactInfo.name.trim() &&
      contactInfo.phone.trim() &&
      contactInfo.email.trim();
    const pickupValid = selectedPickupLocation !== null;
    return passengersValid && contactValid && paymentMethod && pickupValid;
  };

  const getTotalPrice = () => {
    const seats = bookingData?.selectedSeats || selectedSeats;
    return seats.length * (trip?.price || 0);
  };

  const handlePayment = async () => {
    if (!isFormValid()) {
      showNotification("Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to payment status page
      navigate("/payment/status", {
        state: {
          success: true,
          bookingId: "BK" + Date.now(),
          tripData: {
            id: trip?.id,
            companyName: company?.name,
            companyLogo: company?.name
              .split(" ")
              .map((w) => w[0])
              .join(""),
            vehicleType: trip?.vehicleType,
            departureTime: trip?.departureTime,
            arrivalTime: trip?.arrivalTime,
            fromLocation: startCity,
            toLocation: endCity,
            price: trip?.price,
          },
          passengers,
          contactInfo,
          pickupLocation: selectedPickupLocation,
          totalAmount: getTotalPrice(),
          paymentMethod,
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const paymentMethods = [
    {
      value: "vnpay",
      label: "VNPay",
      icon: <CreditCard />,
      description: "Thanh toán qua thẻ ATM, Visa, Master Card",
    },
    {
      value: "momo",
      label: "MoMo",
      icon: <QrCode />,
      description: "Thanh toán qua ví điện tử MoMo",
    },
    {
      value: "banking",
      label: "Chuyển khoản ngân hàng",
      icon: <AccountBalance />,
      description: "Chuyển khoản qua Internet Banking",
    },
  ];

  if (!trip || !route || !company) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Không tìm thấy thông tin chuyến xe. Vui lòng thử lại.
        </Alert>
      </Container>
    );
  }

  const renderSeatSelection = () => (
    <Paper elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
      <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <EventSeat />
          Chọn ghế ({selectedSeats.length}/{seatsFromUrl})
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Nhấn vào ghế để chọn. Ghế màu xám đã có người đặt.
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        {/* Driver area */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 2,
              bgcolor: "grey.100",
              borderRadius: 2,
              minWidth: 200,
              justifyContent: "center",
            }}
          >
            <DirectionsBus />
            <Typography variant="body2" fontWeight={600}>
              Tài xế
            </Typography>
          </Box>
        </Box>

        {/* Seat Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
            maxWidth: 300,
            mx: "auto",
          }}
        >
          {availableSeats.map((seat) => (
            <Box
              key={seat.id}
              onClick={() =>
                !seat.isOccupied && handleSeatToggle(seat.id, seat.number)
              }
              sx={{
                width: 60,
                height: 60,
                border: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: seat.isOccupied ? "not-allowed" : "pointer",
                borderColor: selectedSeats.includes(seat.id)
                  ? "primary.main"
                  : seat.isOccupied
                  ? "grey.400"
                  : "grey.300",
                bgcolor: selectedSeats.includes(seat.id)
                  ? "primary.100"
                  : seat.isOccupied
                  ? "grey.200"
                  : "white",
                "&:hover": {
                  borderColor: seat.isOccupied ? "grey.400" : "primary.main",
                  bgcolor: seat.isOccupied ? "grey.200" : "primary.50",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color={seat.isOccupied ? "text.disabled" : "text.primary"}
              >
                {seat.number}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Legend */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                border: 2,
                borderColor: "grey.300",
                borderRadius: 1,
              }}
            />
            <Typography variant="body2">Trống</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                border: 2,
                borderColor: "primary.main",
                bgcolor: "primary.100",
                borderRadius: 1,
              }}
            />
            <Typography variant="body2">Đã chọn</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                border: 2,
                borderColor: "grey.400",
                bgcolor: "grey.200",
                borderRadius: 1,
              }}
            />
            <Typography variant="body2">Đã đặt</Typography>
          </Box>
        </Box>

        {selectedSeats.length > 0 && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinueToPickupSelection}
              sx={{
                py: 2,
                px: 4,
                fontSize: "1.1rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #004c8b 0%, #003366 100%)",
                },
              }}
            >
              Tiếp tục ({selectedSeats.length} ghế)
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );

  const renderPickupLocationSelection = () => (
    <Paper elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
      <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MyLocation />
          Chọn địa chỉ đón
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Chọn điểm đón phù hợp trên tuyến đường. Xe sẽ đón bạn tại địa chỉ đã
          chọn.
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        {/* Route visualization */}
        <Box sx={{ mb: 4, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <DirectionsBus />
            Tuyến đường: {route.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "success.main",
              }}
            />
            <Typography variant="body2" sx={{ flex: 1 }}>
              {startCity}
            </Typography>
            <Box sx={{ flex: 2, height: 2, bgcolor: "grey.300", mx: 2 }} />
            <Typography variant="body2" sx={{ flex: 1, textAlign: "right" }}>
              {endCity}
            </Typography>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "error.main",
              }}
            />
          </Box>
        </Box>

        {/* Pickup locations list */}
        <List sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
          {availablePickupLocations.map((location, index) => (
            <ListItem key={location.id} disablePadding>
              <ListItemButton
                selected={selectedPickupLocation?.id === location.id}
                onClick={() => handlePickupLocationSelect(location)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  border: 1,
                  borderColor:
                    selectedPickupLocation?.id === location.id
                      ? "primary.main"
                      : "grey.300",
                  bgcolor:
                    selectedPickupLocation?.id === location.id
                      ? "primary.50"
                      : "transparent",
                }}
              >
                <ListItemIcon>
                  <Place
                    color={
                      selectedPickupLocation?.id === location.id
                        ? "primary"
                        : "action"
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {location.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {location.address}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <Schedule sx={{ fontSize: 16 }} />
                        Dự kiến đón: {location.estimatedTime}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {selectedPickupLocation && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinueToPassengerInfo}
              sx={{
                py: 2,
                px: 4,
                fontSize: "1.1rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #004c8b 0%, #003366 100%)",
                },
              }}
            >
              Tiếp tục với {selectedPickupLocation.name}
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );

  const renderPassengerInfo = () => (
    <>
      {/* Passenger Information */}
      <Paper elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
        <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Person />
            Thông tin hành khách
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          {passengers.map((passenger, index) => (
            <Accordion key={index} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Hành khách {index + 1} - Ghế {passenger.seatNumber}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Họ và tên"
                      fullWidth
                      value={passenger.name}
                      onChange={(e) =>
                        handlePassengerChange(index, "name", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Số điện thoại"
                      fullWidth
                      value={passenger.phone}
                      onChange={(e) =>
                        handlePassengerChange(index, "phone", e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>

      {/* Contact Information */}
      <Paper elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
        <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Phone />
            Thông tin liên hệ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Thông tin người đặt vé (nhận vé và liên lạc)
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Tên liên hệ"
                fullWidth
                required
                value={contactInfo.name}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, name: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Số điện thoại"
                fullWidth
                required
                value={contactInfo.phone}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, phone: e.target.value })
                }
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={contactInfo.email}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, email: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Payment Methods */}
      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Payment />
            Phương thức thanh toán
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentMethods.map((method) => (
                <Paper
                  key={method.value}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    borderColor:
                      paymentMethod === method.value
                        ? "primary.main"
                        : "divider",
                    bgcolor:
                      paymentMethod === method.value
                        ? "primary.50"
                        : "transparent",
                  }}
                >
                  <FormControlLabel
                    value={method.value}
                    control={<Radio />}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          width: "100%",
                        }}
                      >
                        <Box sx={{ color: "primary.main" }}>{method.icon}</Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {method.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {method.description}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ width: "100%", m: 0 }}
                  />
                </Paper>
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      </Paper>
    </>
  );

  const getCurrentStepIndex = () => {
    if (tripIdFromUrl) {
      // From map: Seat -> Pickup -> Passenger -> Payment
      return currentStep;
    } else {
      // From existing booking: Pickup -> Passenger -> Payment
      return currentStep;
    }
  };

  const isPaymentStep = () => {
    const maxStep = tripIdFromUrl ? 3 : 2;
    return currentStep === maxStep;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Progress Stepper */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stepper activeStep={getCurrentStepIndex()} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Grid container spacing={4}>
        {/* Left Column - Forms */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Timer Alert */}
          <Alert severity="warning" sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Timer />
              <Typography variant="body2">
                Thời gian giữ ghế: <strong>{formatTime(holdTimer)}</strong>. Vui
                lòng hoàn tất thanh toán trước khi hết thời gian.
              </Typography>
            </Box>
          </Alert>

          {/* Render appropriate step */}
          {currentStep === 0 && tripIdFromUrl && renderSeatSelection()}
          {currentStep === (tripIdFromUrl ? 1 : 0) &&
            renderPickupLocationSelection()}
          {currentStep >= (tripIdFromUrl ? 2 : 1) && renderPassengerInfo()}
        </Grid>

        {/* Right Column - Booking Summary */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              position: "sticky",
              top: 20,
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)",
            }}
          >
            <Box
              sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Tóm tắt đặt vé
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              {/* Trip Summary */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: company.color,
                    mr: 2,
                    width: 48,
                    height: 48,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {company.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {company.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trip.vehicleType}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2">
                    {startCity} → {endCity}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Schedule sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2">
                    {trip.departureTime} - {trip.arrivalTime}
                  </Typography>
                </Box>
              </Box>

              {/* Pickup Location */}
              {selectedPickupLocation && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Địa chỉ đón
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: "primary.50", borderRadius: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedPickupLocation.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedPickupLocation.address}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <Schedule sx={{ fontSize: 16 }} />
                        Thời gian đón: {selectedPickupLocation.estimatedTime}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Selected Seats */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Ghế đã chọn
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {(bookingData?.selectedSeats || selectedSeats).map(
                    (seatId) => {
                      const seat = availableSeats.find((s) => s.id === seatId);
                      return (
                        <Chip
                          key={seatId}
                          label={seat?.number || seatId}
                          color="primary"
                          variant="outlined"
                        />
                      );
                    }
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Số ghế: {(bookingData?.selectedSeats || selectedSeats).length}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Price Breakdown */}
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="body1">
                    Giá vé (
                    {(bookingData?.selectedSeats || selectedSeats).length} ghế)
                  </Typography>
                  <Typography variant="body1">
                    {formatPrice(getTotalPrice())}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Phí dịch vụ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Miễn phí
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Tổng cộng
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {formatPrice(getTotalPrice())}
                  </Typography>
                </Box>
              </Box>

              {isPaymentStep() && (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!isFormValid() || loading}
                  onClick={handlePayment}
                  sx={{
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #004c8b 0%, #003366 100%)",
                    },
                    "&:disabled": {
                      background:
                        "linear-gradient(135deg, #cccccc 0%, #999999 100%)",
                    },
                  }}
                >
                  {loading ? "Đang xử lý..." : "Thanh toán"}
                </Button>
              )}
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingCheckout;
