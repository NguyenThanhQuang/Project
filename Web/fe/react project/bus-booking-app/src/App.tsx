import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { theme } from './theme';
import Layout from './components/layout/Layout';
import Homepage from './pages/Homepage';
import TripSearchResults from './pages/TripSearchResults';
import TripDetails from './pages/TripDetails';
import BookingCheckout from './pages/BookingCheckout';
import PaymentStatus from './pages/PaymentStatus';
import MyBookings from './pages/MyBookings';
import CompanyRegistration from './pages/CompanyRegistration';
import CompanyRegistrationSuccess from './pages/CompanyRegistrationSuccess';
import LoyaltyProgram from './pages/LoyaltyProgram';
import AddTrip from './pages/AddTrip';
import ManageTrips from './pages/ManageTrips';
import { NotificationProvider } from './components/common/NotificationProvider';
import AuthModal from './components/auth/AuthModal';
import TestApiConnection from './components/TestApiConnection';
import { authApi } from './services/api';

// Mock user type
interface User {
  id: string;
  name: string;
  email: string;
}

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Login attempt with:', { email, password });
      const response = await authApi.login({ identifier: email, password });
      
      // Store token in localStorage
      localStorage.setItem('access_token', response.access_token);
      
      // Update user state
      setUser({
        id: response.user._id,
        name: response.user.name,
        email: response.user.email,
      });
      
      closeAuthModal();
      console.log('Login successful:', response);
    } catch (error) {
      console.error('Login failed:', error);
      // Let AuthModal handle the error display
      throw error;
    }
  };

  const handleRegister = async (userData: RegisterUserData) => {
    try {
      console.log('Register attempt with:', userData);
      const response = await authApi.register({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone || '+84987654321', // Use provided phone or default
      });
      
      // Store token in localStorage
      localStorage.setItem('access_token', response.access_token);
      
      // Update user state
      setUser({
        id: response.user._id,
        name: response.user.name,
        email: response.user.email,
      });
      
      closeAuthModal();
      console.log('Registration successful:', response);
    } catch (error) {
      console.error('Registration failed:', error);
      // Let AuthModal handle the error display
      throw error;
    }
  };

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NotificationProvider>
          <Router>
            <Layout
              user={user}
              onLogin={() => openAuthModal('login')}
              onRegister={() => openAuthModal('register')}
              onLogout={handleLogout}
            >
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/trips" element={<TripSearchResults />} />
                <Route path="/trips/:tripId" element={<TripDetails />} />
                <Route path="/bookings/checkout" element={<BookingCheckout />} />
                <Route path="/payment/status" element={<PaymentStatus />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/loyalty-program" element={<LoyaltyProgram />} />
                <Route path="/company-registration" element={<CompanyRegistration />} />
                <Route path="/company-registration-success" element={<CompanyRegistrationSuccess />} />
                <Route path="/add-trip" element={<AddTrip />} />
                <Route path="/manage-trips" element={<ManageTrips />} />
                <Route path="/test-api" element={<TestApiConnection />} />
              </Routes>
            </Layout>
            
            <AuthModal
              open={authModalOpen}
              initialTab={authMode}
              onClose={closeAuthModal}
              onLogin={handleLogin}
              onRegister={handleRegister}
            />
          </Router>
        </NotificationProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
