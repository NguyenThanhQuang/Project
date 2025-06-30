import { useState, useEffect } from "react";
// THAY ĐỔI: Bỏ BrowserRouter vì nó đã được đặt ở main.tsx
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// THAY ĐỔI: Import các thành phần của Redux
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { logout, loadUser } from "./store/authSlice";

import { theme } from "./theme";
import Layout from "./components/layout/Layout";
import Homepage from "./pages/Homepage";
import TripSearchResults from "./pages/TripSearchResults";
import TripDetails from "./pages/TripDetails";
import BookingCheckout from "./pages/BookingCheckout";
import PaymentStatus from "./pages/PaymentStatus";
import MyBookings from "./pages/MyBookings";
import { NotificationProvider } from "./components/common/NotificationProvider";
import AuthModal from "./components/auth/AuthModal";

// THAY ĐỔI: Không cần mock user type ở đây nữa, đã có trong authSlice

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // THAY ĐỔI: Lấy state trực tiếp từ Redux store, bỏ useState cho user
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  // THAY ĐỔI: Thêm useEffect để tự động load thông tin user nếu có token
  // Điều này giúp duy trì trạng thái đăng nhập khi người dùng refresh trang
  useEffect(() => {
    if (token && !user) {
      dispatch(loadUser());
    }
  }, [dispatch, token, user]);

  const openAuthModal = (mode: "login" | "register") => {
    console.log(
      `[App] Nhận được yêu cầu từ Header. Đang mở modal với chế độ: ${mode}`
    );
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // THAY ĐỔI: Hàm logout bây giờ sẽ dispatch action của Redux
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NotificationProvider>
          {/* THAY ĐỔI: Component <Router> đã được chuyển ra file main.tsx để sửa lỗi */}
          <Layout
            user={user} // Dùng user từ Redux store
            onLogin={() => openAuthModal("login")}
            onRegister={() => openAuthModal("register")}
            onLogout={handleLogout} // Dùng hàm logout đã kết nối Redux
          >
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/trips" element={<TripSearchResults />} />
              <Route path="/trips/:tripId" element={<TripDetails />} />
              <Route path="/bookings/checkout" element={<BookingCheckout />} />
              <Route path="/payment/status" element={<PaymentStatus />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Routes>
          </Layout>

          {/* 
            THAY ĐỔI: AuthModal giờ đây tự kết nối với Redux,
            không cần truyền onLogin và onRegister nữa.
            Điều này giúp App.tsx gọn gàng hơn.
          */}
          <AuthModal
            open={authModalOpen}
            initialTab={authMode}
            onClose={closeAuthModal}
          />
        </NotificationProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
