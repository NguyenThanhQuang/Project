import React from "react";
import { Box, Button } from "@mui/material";
import {
  Add,
  BookOnline,
  DirectionsBus,
  TrackChanges,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../fe/src/store";

const DesktopNav = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  // Thêm hàm xử lý cuộn trang mượt mà
  const scrollToSection = (sectionId: string) => {
    // Tìm phần tử theo ID
    const sectionElement = document.getElementById(sectionId);
    // Nếu tìm thấy, cuộn đến phần tử đó
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Box
      sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}
    >
      <Button
        color="inherit"
        onClick={() => navigate("/")}
        sx={{ fontWeight: 600 }}
      >
        Trang chủ
      </Button>
      <Button
        color="inherit"
        onClick={() => scrollToSection("footer")}
        sx={{ fontWeight: 600 }}
      >
        Trợ giúp
      </Button>
      <Button
        color="inherit"
        onClick={() => scrollToSection("contact-section")}
        sx={{ fontWeight: 600 }}
      >
        Liên hệ
      </Button>
      <Button
        color="inherit"
        onClick={() => navigate("/bus-tracking")}
        startIcon={<TrackChanges />}
        sx={{ fontWeight: 600, color: "secondary.main" }}
      >
        Theo dõi xe
      </Button>
      {/* 1. Nếu CHƯA đăng nhập, hiển thị "Đăng ký nhà xe" */}
      {!user && (
        <Button
          color="inherit"
          onClick={() => navigate("/company-registration")}
          sx={{ fontWeight: 600, color: "primary.main" }}
        >
          Đăng ký nhà xe
        </Button>
      )}

      {/* 2. Nếu ĐÃ đăng nhập */}
      {user && (
        <>
          {/* 2a. Nếu có vai trò 'user', hiển thị "Chuyến đi của tôi" */}
          {user.roles.includes("user") && (
            <Button
              color="inherit"
              onClick={() => navigate("/my-bookings")}
              startIcon={<BookOnline />}
              sx={{ fontWeight: 600 }}
            >
              Chuyến đi của tôi
            </Button>
          )}

          {/* 2b. Nếu có vai trò 'company_admin', hiển thị các nút quản lý */}
          {user.roles.includes("company_admin") && (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/manage-trips")}
                startIcon={<DirectionsBus />}
                sx={{ fontWeight: 600 }}
              >
                Quản lý chuyến
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/add-trip")}
                startIcon={<Add />}
                sx={{ fontWeight: 600, color: "success.main" }}
              >
                Thêm chuyến
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default DesktopNav;
