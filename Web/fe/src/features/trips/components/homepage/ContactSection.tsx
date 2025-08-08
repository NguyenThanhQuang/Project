import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Subject,
  Message,
  Send,
  LocationOn,
  Schedule,
  HeadsetMic,
} from "@mui/icons-material";

export const ContactSection: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactMessage("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setContactMessage("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }
    setContactLoading(true);
    setContactMessage("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setContactMessage(
        "Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất."
      );
      setTimeout(() => {
        setContactForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }, 3000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setContactMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setContactLoading(false);
    }
  };

  const handleContactInputChange = (field: string, value: string) => {
    setContactForm({ ...contactForm, [field]: value });
    if (contactMessage) setContactMessage("");
  };

  return (
    <Box
      id="contact-section"
      sx={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 10,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(0, 119, 190, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 167, 38, 0.1) 0%, transparent 50%)",
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}
          >
            Liên hệ với chúng tôi
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Để lại thông tin và chúng tôi sẽ liên lạc với bạn trong thời gian
            sớm nhất
          </Typography>
        </Box>
        <Grid container spacing={6} justifyContent="center">
          {/* Contact Form */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper
              elevation={10}
              sx={{
                p: 5,
                borderRadius: 4,
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background:
                    "linear-gradient(135deg, #0077be 0%, #ffa726 100%)",
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 4, color: "primary.main" }}
              >
                📝 Gửi tin nhắn cho chúng tôi
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Họ và tên"
                    fullWidth
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      handleContactInputChange("name", e.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <Person sx={{ color: "primary.main", mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      handleContactInputChange("email", e.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <Email sx={{ color: "primary.main", mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Số điện thoại"
                    fullWidth
                    value={contactForm.phone}
                    onChange={(e) =>
                      handleContactInputChange("phone", e.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <Phone sx={{ color: "primary.main", mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Chủ đề"
                    fullWidth
                    value={contactForm.subject}
                    onChange={(e) =>
                      handleContactInputChange("subject", e.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <Subject sx={{ color: "primary.main", mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    label="Tin nhắn"
                    multiline
                    rows={4}
                    fullWidth
                    required
                    value={contactForm.message}
                    onChange={(e) =>
                      handleContactInputChange("message", e.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <Message
                          sx={{
                            color: "primary.main",
                            mr: 1,
                            alignSelf: "flex-start",
                            mt: 1,
                          }}
                        />
                      ),
                    }}
                  />
                </Grid>
                {contactMessage && (
                  <Grid size={12}>
                    <Alert
                      severity={
                        contactMessage.includes("Cảm ơn") ? "success" : "error"
                      }
                      sx={{
                        borderRadius: 2,
                        "& .MuiAlert-icon": {
                          fontSize: "1.5rem",
                        },
                      }}
                    >
                      {contactMessage}
                    </Alert>
                  </Grid>
                )}
                <Grid size={12}>
                  <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleContactSubmit}
                      disabled={contactLoading}
                      startIcon={
                        contactLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <Send />
                        )
                      }
                      sx={{
                        py: 2,
                        px: 6,
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        background:
                          "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #004c8b 0%, #003366 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(0, 119, 190, 0.4)",
                        },
                        borderRadius: 3,
                        boxShadow: "0 4px 15px rgba(0, 119, 190, 0.3)",
                        minWidth: 250,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {contactLoading ? "Đang gửi..." : "Gửi thông tin liên hệ"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background: "rgba(255, 167, 38, 0.2)",
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, mb: 3, position: "relative" }}
                >
                  📞 Thông tin liên hệ
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    position: "relative",
                  }}
                >
                  <LocationOn
                    sx={{ fontSize: 24, mr: 2, color: "secondary.main" }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Địa chỉ
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      123 Đường ABC, Quận 1, TP.HCM
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    position: "relative",
                  }}
                >
                  <Phone
                    sx={{ fontSize: 24, mr: 2, color: "secondary.main" }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Hotline
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      1900-xxxx (24/7)
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    position: "relative",
                  }}
                >
                  <Email
                    sx={{ fontSize: 24, mr: 2, color: "secondary.main" }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      support@busapp.com
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Schedule
                    sx={{ fontSize: 24, mr: 2, color: "secondary.main" }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Giờ làm việc
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      24/7 - Hỗ trợ không ngừng nghỉ
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #ffa726 0%, #ff9800 100%)",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <HeadsetMic sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Hỗ trợ 24/7
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.95, lineHeight: 1.6 }}
                >
                  Đội ngũ chăm sóc khách hàng chuyên nghiệp luôn sẵn sàng hỗ trợ
                  bạn mọi lúc, mọi nơi
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
