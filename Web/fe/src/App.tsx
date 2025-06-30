import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
import AdminDashboard from "./pages/admin/AdminDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import { NotificationProvider } from "./components/common/NotificationProvider";
import AuthModal from "./components/auth/AuthModal";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(loadUser());
    }
  }, [dispatch, token, user]);

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NotificationProvider>
          <Layout
            user={user}
            onLogin={() => openAuthModal("login")}
            onRegister={() => openAuthModal("register")}
            onLogout={handleLogout}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/trips" element={<TripSearchResults />} />
              <Route path="/trips/:tripId" element={<TripDetails />} />
              <Route path="/payment/status" element={<PaymentStatus />} />

              {/* Protected Routes */}
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute
                    allowedRoles={["user", "admin", "company_admin"]}
                  >
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/checkout"
                element={
                  <ProtectedRoute
                    allowedRoles={["user", "admin", "company_admin"]}
                  >
                    <BookingCheckout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["company_admin"]}>
                    <CompanyDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback/Utility Routes */}
              <Route
                path="/unauthorized"
                element={<h1>Không có quyền truy cập</h1>}
              />
              <Route path="*" element={<h1>404 - Trang không tồn tại</h1>} />
            </Routes>
          </Layout>

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
