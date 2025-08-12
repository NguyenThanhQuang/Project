import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

import type { RootState } from "../../../store";

const LoginRedirect = () => {
  const { user, status } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  if (from && from !== "/") {
    return <Navigate to={from} replace />;
  }

  if (status === "loading" || !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải thông tin người dùng...</Typography>
      </Box>
    );
  }

  if (user.roles.includes("admin")) {
    return <Navigate to="/admin" replace />;
  }

  if (user.roles.includes("company_admin")) {
    if (from && from !== "/") {
      return <Navigate to={from} replace />;
    }
    return <Navigate to="/company/dashboard" replace />;
  }

  if (user.roles.includes("user")) {
    if (from && from !== "/") {
      return <Navigate to={from} replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default LoginRedirect;
