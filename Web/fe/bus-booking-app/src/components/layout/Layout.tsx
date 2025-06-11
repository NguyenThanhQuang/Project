import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
  onLogout?: () => void;
  onLogin?: () => void;
  onRegister?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onLogin, onRegister }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header user={user} onLogout={onLogout} onLogin={onLogin} onRegister={onRegister} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout; 