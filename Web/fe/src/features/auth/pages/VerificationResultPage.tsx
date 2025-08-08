import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import type { AppDispatch } from "../../../store";
import { loadUser } from "../../../store/authSlice";

const VerificationResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const success = searchParams.get("success");
    const accessToken = searchParams.get("accessToken");
    const messageKey = searchParams.get("message");

    const processVerification = async () => {
      if (success === "true" && accessToken) {
        localStorage.setItem("accessToken", accessToken);

        await dispatch(loadUser()).unwrap();

        setStatus("success");
        setMessage("Xác thực email thành công! Bạn đã được tự động đăng nhập.");

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setStatus("error");
        let displayMessage = "Xác thực thất bại. Vui lòng thử lại.";
        switch (messageKey) {
          case "TokenExpired":
            displayMessage =
              "Token xác thực đã hết hạn. Vui lòng yêu cầu gửi lại.";
            break;
          case "TokenInvalidOrUsed":
            displayMessage = "Token không hợp lệ hoặc đã được sử dụng.";
            break;
          case "UserNotFoundWithToken":
            displayMessage = "Không tìm thấy người dùng với token này.";
            break;
          default:
            displayMessage = "Đã có lỗi không xác định xảy ra.";
            break;
        }
        setMessage(displayMessage);
      }
    };

    processVerification();
  }, [searchParams, dispatch, navigate]);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        {status === "loading" && (
          <>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h5">Đang xử lý xác thực...</Typography>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircleOutline
              sx={{ fontSize: 64, color: "success.main", mb: 2 }}
            />
            <Typography variant="h5" color="success.main" gutterBottom>
              Thành công!
            </Typography>
            <Alert severity="success">{message}</Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Sẽ tự động chuyển hướng về trang chủ...
            </Typography>
          </>
        )}

        {status === "error" && (
          <>
            <ErrorOutline sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
            <Typography variant="h5" color="error.main" gutterBottom>
              Xác thực thất bại
            </Typography>
            <Alert severity="error">{message}</Alert>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{ mt: 3 }}
            >
              Về trang chủ
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default VerificationResultPage;
