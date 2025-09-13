import React from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { validatePassword } from "../utils/passwordValidator";

interface PasswordStrengthIndicatorProps {
  password?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password = "",
}) => {
  if (!password) {
    return null;
  }

  const validation = validatePassword(password);

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return "error";
    if (strength <= 3) return "warning";
    if (strength <= 4) return "info";
    return "success";
  };

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength <= 2) return "Yếu";
    if (strength <= 3) return "Trung bình";
    if (strength <= 4) return "Mạnh";
    return "Rất mạnh";
  };

  const requirements = [
    { check: validation.checks.minLength, text: "Ít nhất 8 ký tự" },
    { check: validation.checks.hasUpperCase, text: "Có chữ hoa" },
    { check: validation.checks.hasLowerCase, text: "Có chữ thường" },
    { check: validation.checks.hasNumbers, text: "Có số" },
    { check: validation.checks.hasSpecialChar, text: "Có ký tự đặc biệt" },
  ];

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Độ mạnh mật khẩu:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: `${getPasswordStrengthColor(validation.strength)}.main`,
              fontWeight: 600,
            }}
          >
            {getPasswordStrengthLabel(validation.strength)}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(validation.strength / 5) * 100}
          color={getPasswordStrengthColor(validation.strength)}
          sx={{ height: 6, borderRadius: 3 }}
        />
      </Box>
      <Card sx={{ bgcolor: "grey.50" }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Yêu cầu mật khẩu:
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {requirements.map((req, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {req.check ? (
                  <CheckCircle sx={{ color: "success.main", fontSize: 16 }} />
                ) : (
                  <Cancel sx={{ color: "error.main", fontSize: 16 }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: req.check ? "success.main" : "error.main",
                    fontSize: "0.75rem",
                    fontWeight: req.check ? 600 : 400,
                  }}
                >
                  {req.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PasswordStrengthIndicator;
