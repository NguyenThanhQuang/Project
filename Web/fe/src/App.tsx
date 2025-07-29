import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import { theme } from "./theme";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { NotificationProvider } from "./components/common/NotificationProvider";
import type { AppDispatch, RootState } from "./store";
import { loadUser } from "./store/authSlice";
import Homepage from "./features/trips/pages/Homepage";
import TripSearchResults from "./features/trips/pages/TripSearchResults";
import TripDetails from "./features/trips/pages/TripDetails";
import Policies from "./features/core/pages/Policies";
import CompanyRegistration from "./features/company/pages/CompanyRegistration";
import CompanyRegistrationSuccess from "./features/company/pages/CompanyRegistrationSuccess";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import PasswordReset from "./features/auth/pages/PasswordReset";
import MyBookings from "./features/profile/pages/MyBookings";
import LoyaltyProgram from "./features/profile/pages/LoyaltyProgram";
import ChangePassword from "./features/profile/pages/ChangePassword";
import PaymentStatus from "./features/bookings/pages/PaymentStatus";
import BookingCheckout from "./features/bookings/pages/BookingCheckout";
import AddTrip from "./features/company/pages/AddTrip";
import ManageTrips from "./features/company/pages/ManageTrips";
import { BusTracking } from "./features/tracking/pages/BusTracking";
import AdminDashboardContent from "./features/admin/pages/AdminDashboardContent";
import ManageCompanies from "./features/admin/pages/ManageCompanies";
import ManageUsers from "./features/admin/pages/ManageUsers";
import FinanceReports from "./features/admin/pages/FinanceReports";
import SystemSettings from "./features/admin/pages/SystemSettings";
import NotificationManagement from "./features/admin/pages/NotificationManagement";
import { NotificationProvider as AdminNotificationProvider } from "./contexts/NotificationContext";
import AdminLoginPage from "./features/admin/pages/AdminLoginPage";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [token, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NotificationProvider>
          <AdminNotificationProvider>
            <Routes>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/" element={<Layout />}>
                {/* Trang public */}
                <Route index element={<Homepage />} />
                <Route path="trips" element={<TripSearchResults />} />
                <Route path="trips/:tripId" element={<TripDetails />} />
                <Route path="policies" element={<Policies />} />
                <Route
                  path="company-registration"
                  element={<CompanyRegistration />}
                />
                <Route
                  path="company-registration-success"
                  element={<CompanyRegistrationSuccess />}
                />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<PasswordReset />} />

                {/* Trang được bảo vệ */}
                <Route
                  path="my-bookings"
                  element={
                    <ProtectedRoute allowedRoles={["user", "company_admin"]}>
                      <MyBookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="loyalty-program"
                  element={
                    <ProtectedRoute allowedRoles={["user", "company_admin"]}>
                      <LoyaltyProgram />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="change-password"
                  element={
                    <ProtectedRoute allowedRoles={["user", "company_admin"]}>
                      <ChangePassword />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="payment/status"
                  element={
                    <ProtectedRoute allowedRoles={["user", "company_admin"]}>
                      <PaymentStatus />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="bookings/checkout"
                  element={
                    <ProtectedRoute allowedRoles={["user", "company_admin"]}>
                      <BookingCheckout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="add-trip"
                  element={
                    <ProtectedRoute allowedRoles={["company_admin"]}>
                      <AddTrip />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="manage-trips"
                  element={
                    <ProtectedRoute allowedRoles={["company_admin"]}>
                      <ManageTrips />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="bus-tracking"
                  element={
                    <ProtectedRoute allowedRoles={["company_admin"]}>
                      <BusTracking />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Cấu trúc route lồng nhau cho Admin Layout */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboardContent />} />
                <Route path="companies" element={<ManageCompanies />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="finance" element={<FinanceReports />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route
                  path="notifications"
                  element={<NotificationManagement />}
                />
              </Route>

              {/* Route cho trang không tìm thấy */}
              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
          </AdminNotificationProvider>
        </NotificationProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
