import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AppDispatch } from "../../../store";
import { loginUser } from "../../../store/authSlice";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import {
  activateAccount,
  validateActivationToken,
} from "../services/authService";

export const useActivateAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "validating" | "valid" | "invalid" | "submitting" | "success"
  >("validating");
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    userName: string;
    companyName: string;
  } | null>(null);

  const validateToken = useCallback(async () => {
    if (!token) {
      setStatus("invalid");
      setError("URL không hợp lệ, không tìm thấy token.");
      return;
    }
    try {
      const data = await validateActivationToken(token);
      setUserInfo({ userName: data.userName, companyName: data.companyName });
      setStatus("valid");
    } catch (err) {
      setStatus("invalid");
      setError(getErrorMessage(err, "Token không hợp lệ hoặc đã hết hạn."));
    }
  }, [token]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const handleSubmit = async (password: string, confirmPassword: string) => {
    if (!token) return;
    setError(null);
    setStatus("submitting");
    try {
      const data = await activateAccount({
        token,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });

      dispatch(
        loginUser.fulfilled(data, "", {
          credentials: { identifier: data.user.email, password },
        })
      );

      setStatus("success");
      setTimeout(() => navigate("/manage-trips"), 2000);
    } catch (err) {
      setError(getErrorMessage(err, "Kích hoạt tài khoản thất bại."));
      setStatus("valid");
    }
  };

  return { status, error, userInfo, handleSubmit };
};
