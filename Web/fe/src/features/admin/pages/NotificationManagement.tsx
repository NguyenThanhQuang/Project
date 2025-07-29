import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Delete,
  Add,
  MarkEmailRead,
  NotificationsActive,
  Schedule,
  CheckCircle,
  Info,
  Warning,
  Error,
  Settings,
  DirectionsBus,
  Person,
  MonetizationOn,
} from "@mui/icons-material";
import { useNotifications } from "../../../contexts/NotificationContext";
import type { NotificationItem } from "../../../types/notification";

const NotificationManagement: React.FC = () => {
  const {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    unreadCount,
  } = useNotifications();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState<
    Partial<NotificationItem>
  >({
    type: "info",
    category: "system",
    title: "",
    message: "",
    isRead: false,
  });

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.isRead);
      case "read":
        return notifications.filter((n) => n.isRead);
      case "system":
        return notifications.filter((n) => n.category === "system");
      case "user":
        return notifications.filter((n) => n.category === "user");
      case "company":
        return notifications.filter((n) => n.category === "company");
      case "finance":
        return notifications.filter((n) => n.category === "finance");
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const paginatedNotifications = filteredNotifications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "company":
        return <DirectionsBus />;
      case "user":
        return <Person />;
      case "finance":
        return <MonetizationOn />;
      case "system":
        return <Settings />;
      default:
        return <Info />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle color="success" />;
      case "warning":
        return <Warning color="warning" />;
      case "error":
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("vi-VN");
  };

  const handleCreateNotification = () => {
    if (newNotification.title && newNotification.message) {
      addNotification({
        type: newNotification.type as NotificationItem["type"],
        category: newNotification.category as NotificationItem["category"],
        title: newNotification.title,
        message: newNotification.message,
        isRead: false,
      });

      setNewNotification({
        type: "info",
        category: "system",
        title: "",
        message: "",
        isRead: false,
      });
      setCreateDialogOpen(false);
    }
  };

  const statistics = [
    {
      title: "Tổng thông báo",
      value: notifications.length,
      icon: <NotificationsActive />,
      color: "primary.main",
    },
    {
      title: "Chưa đọc",
      value: unreadCount,
      icon: <Schedule />,
      color: "warning.main",
    },
    {
      title: "Đã đọc",
      value: notifications.length - unreadCount,
      icon: <CheckCircle />,
      color: "success.main",
    },
    {
      title: "Hệ thống",
      value: notifications.filter((n) => n.category === "system").length,
      icon: <Settings />,
      color: "info.main",
    },
  ];

  return (
    <Box>
      {/* Statistics Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {statistics.map((stat, index) => (
          <Card
            key={index}
            sx={{
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              border: "1px solid rgba(0, 119, 190, 0.1)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: stat.color,
                    mr: 2,
                    width: 56,
                    height: 56,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Main Content */}
      <Card
        sx={{ borderRadius: 3, border: "1px solid rgba(0, 119, 190, 0.1)" }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Quản lý thông báo
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<MarkEmailRead />}
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Đánh dấu tất cả đã đọc
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
              >
                Xóa tất cả
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  background:
                    "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
                }}
              >
                Tạo thông báo
              </Button>
            </Box>
          </Box>

          {/* Filter Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => {
              setActiveTab(newValue);
              setPage(0);
            }}
            sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label={`Tất cả (${notifications.length})`} value="all" />
            <Tab label={`Chưa đọc (${unreadCount})`} value="unread" />
            <Tab
              label={`Đã đọc (${notifications.length - unreadCount})`}
              value="read"
            />
            <Tab
              label={`Hệ thống (${
                notifications.filter((n) => n.category === "system").length
              })`}
              value="system"
            />
            <Tab
              label={`Người dùng (${
                notifications.filter((n) => n.category === "user").length
              })`}
              value="user"
            />
            <Tab
              label={`Nhà xe (${
                notifications.filter((n) => n.category === "company").length
              })`}
              value="company"
            />
            <Tab
              label={`Tài chính (${
                notifications.filter((n) => n.category === "finance").length
              })`}
              value="finance"
            />
          </Tabs>

          {/* Notifications Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Loại</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tiêu đề</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Nội dung</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Danh mục</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Thời gian</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedNotifications.map((notification) => (
                  <TableRow
                    key={notification.id}
                    sx={{
                      "&:hover": { bgcolor: "grey.50" },
                      bgcolor: notification.isRead
                        ? "transparent"
                        : "action.hover",
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {getTypeIcon(notification.type)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {notification.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300 }}>
                        {notification.message.length > 50
                          ? `${notification.message.substring(0, 50)}...`
                          : notification.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {getCategoryIcon(notification.category)}
                        <Typography
                          variant="body2"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {notification.category === "system" && "Hệ thống"}
                          {notification.category === "user" && "Người dùng"}
                          {notification.category === "company" && "Nhà xe"}
                          {notification.category === "finance" && "Tài chính"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={notification.isRead ? "Đã đọc" : "Chưa đọc"}
                        color={notification.isRead ? "default" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDateTime(notification.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {!notification.isRead && (
                          <IconButton
                            size="small"
                            onClick={() => markAsRead(notification.id)}
                            color="primary"
                          >
                            <MarkEmailRead />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => deleteNotification(notification.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredNotifications.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Số hàng mỗi trang:"
          />
        </CardContent>
      </Card>

      {/* Create Notification Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Tạo thông báo mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            <TextField
              label="Tiêu đề"
              value={newNotification.title || ""}
              onChange={(e) =>
                setNewNotification((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              fullWidth
              required
            />

            <TextField
              label="Nội dung"
              value={newNotification.message || ""}
              onChange={(e) =>
                setNewNotification((prev) => ({
                  ...prev,
                  message: e.target.value,
                }))
              }
              fullWidth
              multiline
              rows={3}
              required
            />

            <FormControl fullWidth>
              <InputLabel>Loại thông báo</InputLabel>
              <Select
                value={newNotification.type || "info"}
                onChange={(e) =>
                  setNewNotification((prev) => ({
                    ...prev,
                    type: e.target.value as NotificationItem["type"],
                  }))
                }
                label="Loại thông báo"
              >
                <MenuItem value="info">Thông tin</MenuItem>
                <MenuItem value="success">Thành công</MenuItem>
                <MenuItem value="warning">Cảnh báo</MenuItem>
                <MenuItem value="error">Lỗi</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={newNotification.category || "system"}
                onChange={(e) =>
                  setNewNotification((prev) => ({
                    ...prev,
                    category: e.target.value as NotificationItem["category"],
                  }))
                }
                label="Danh mục"
              >
                <MenuItem value="system">Hệ thống</MenuItem>
                <MenuItem value="user">Người dùng</MenuItem>
                <MenuItem value="company">Nhà xe</MenuItem>
                <MenuItem value="finance">Tài chính</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleCreateNotification}
            variant="contained"
            disabled={!newNotification.title || !newNotification.message}
          >
            Tạo thông báo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationManagement;
