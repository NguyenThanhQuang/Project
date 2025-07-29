import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "./Header";
import Footer from "./Footer";
import AuthModal from "../../features/auth/components/AuthModal";
import type { RootState } from "../../store";

const Layout: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const navigate = useNavigate();
  const location = useLocation();

  const { user, status } = useSelector((state: RootState) => state.auth);

  const [loginProcessed, setLoginProcessed] = useState(false);

  useEffect(() => {
    if (user && status === "succeeded" && !loginProcessed) {
      setLoginProcessed(true);
      setAuthModalOpen(false);
      const from = location.state?.from?.pathname || null;
      if (from && from !== "/") {
        navigate(from, { replace: true });
      }
    }

    if (location.state?.openAuth) {
      handleOpenAuthModal("login");
      window.history.replaceState({}, document.title);
    }
  }, [user, status, loginProcessed, navigate, location.state]);

  useEffect(() => {
    if (!user) {
      setLoginProcessed(false);
    }
  }, [user]);

  const handleOpenAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header onOpenAuthModal={handleOpenAuthModal} />
      <Box component="main" sx={{ flexGrow: 1, py: 3, px: { xs: 2, sm: 3 } }}>
        <Outlet />
      </Box>
      <Footer />
      <AuthModal
        open={authModalOpen}
        onClose={handleCloseAuthModal}
        initialTab={authMode}
      />
    </Box>
  );
};

export default Layout;
