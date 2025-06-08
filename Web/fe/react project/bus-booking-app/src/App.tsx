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
import { NotificationProvider } from './components/common/NotificationProvider';
import AuthModal from './components/auth/AuthModal';

// Mock user type
interface User {
  id: string;
  name: string;
  email: string;
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

  const handleLogin = async (email: string, _password: string) => {
    // Mock login implementation
    setUser({
      id: '1',
      name: 'User Demo',
      email: email,
    });
    closeAuthModal();
  };

  const handleRegister = async (userData: any) => {
    // Mock register implementation
    setUser({
      id: '1',
      name: userData.name || 'User Demo',
      email: userData.email,
    });
    closeAuthModal();
  };

  const handleLogout = () => {
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
