import { Box, Button } from "@mui/material";
import {
  BookOnline,
  ConfirmationNumber,
  DirectionsBus,
  TrackChanges,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import HomeIcon from "@mui/icons-material/Home";
import GavelIcon from "@mui/icons-material/Gavel";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import HelpIcon from "@mui/icons-material/Help";

const DesktopNav = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
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
        startIcon={<HomeIcon />}
        sx={{ fontWeight: 600 }}
      >
        Trang chủ
      </Button>
      <Button
        color="inherit"
        onClick={() => navigate("/lookup")}
        startIcon={<ConfirmationNumber />}
        sx={{ fontWeight: 600 }}
      >
        Tra cứu vé
      </Button>
      <Button
        color="inherit"
        onClick={() => scrollToSection("footer")}
        startIcon={<HelpIcon />}
        sx={{ fontWeight: 600 }}
      >
        Trợ giúp
      </Button>
      <Button
        color="inherit"
        onClick={() => scrollToSection("contact-section")}
        startIcon={<ConnectWithoutContactIcon />}
        sx={{ fontWeight: 600 }}
      >
        Liên hệ
      </Button>
      <Button
        color="inherit"
        onClick={() => navigate("/TermOfService")}
        startIcon={<GavelIcon />}
        sx={{ fontWeight: 600 }}
      >
        Chính sách
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
                Quản lý chuyến xe
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default DesktopNav;
