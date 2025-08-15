import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search,
  MoreVert,
  Block,
  CheckCircle,
  Phone,
  Email,
  DateRange,
  Timer,
  History,
} from "@mui/icons-material";
import { useManageUsers } from "../hooks/useManageUsers";
import type { UserStatus } from "../types/user";

const ManageUsers: React.FC = () => {
  const {
    loading,
    error,
    stats,
    filteredUsers,
    page,
    rowsPerPage,
    searchTerm,
    activeTab,
    anchorEl,
    selectedUser,
    actionDialogOpen,
    actionType,
    setSearchTerm,
    setActiveTab,
    handleChangePage,
    handleChangeRowsPerPage,
    handleMenuOpen,
    handleMenuClose,
    handleAction,
    confirmAction,
    setActionDialogOpen,
  } = useManageUsers();

  const getStatusColor = (status: UserStatus) =>
    (({
      active: "success",
      inactive: "warning",
      banned: "error",
    }[status] || "default") as "success" | "warning" | "error" | "default");

  const getStatusText = (status: UserStatus) =>
    ({
      active: "Hoạt động",
      inactive: "Không hoạt động",
      banned: "Bị cấm",
    }[status]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString("vi-VN") : "Chưa có";

  if (loading && filteredUsers.length === 0) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#1976d2", mb: 1 }}
              >
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số người dùng
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#2e7d32", mb: 1 }}
              >
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang hoạt động
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#f57c00", mb: 1 }}
              >
                {stats.inactive}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Không hoạt động
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#d32f2f", mb: 1 }}
              >
                {stats.banned}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bị cấm
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Tabs */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              py: 2,
            },
          }}
        >
          <Tab
            icon={<History />}
            iconPosition="start"
            label={`Tất cả (${stats.total})`}
            value="all"
          />
          <Tab
            icon={<CheckCircle />}
            iconPosition="start"
            label={`Hoạt động (${stats.active})`}
            value="active"
          />
          <Tab
            icon={<Timer />}
            iconPosition="start"
            label={`Không hoạt động (${stats.inactive})`}
            value="inactive"
          />
          <Tab
            icon={<Block />}
            iconPosition="start"
            label={`Bị cấm (${stats.banned})`}
            value="banned"
          />
        </Tabs>
      </Paper>

      {/* Search and Actions */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>
      </Paper>

      {/* Users Table */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f7fa" }}>
                <TableCell sx={{ fontWeight: 600 }}>Người dùng</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Liên hệ</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ngày đăng ký</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  Lần đăng nhập cuối
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Số vé đã đặt</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tổng chi tiêu</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2">{user.email}</Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Phone fontSize="small" color="action" />
                          <Typography variant="body2">{user.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <DateRange fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDate(user.createdAt)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(user.lastLoginDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(user.status)}
                        color={getStatusColor(user.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.totalBookings}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(user.totalSpent)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedUser?.status !== "banned" && (
          <MenuItem
            onClick={() => handleAction("ban")}
            sx={{ color: "error.main" }}
          >
            <Block sx={{ mr: 1 }} />
            Cấm tài khoản
          </MenuItem>
        )}
        {selectedUser?.status === "banned" && (
          <MenuItem
            onClick={() => handleAction("unban")}
            sx={{ color: "success.main" }}
          >
            <CheckCircle sx={{ mr: 1 }} />
            Bỏ cấm
          </MenuItem>
        )}
      </Menu>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
      >
        <DialogTitle>
          Xác nhận {actionType === "ban" ? "cấm tài khoản" : "bỏ cấm"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn{" "}
            {actionType === "ban" ? "cấm tài khoản" : "bỏ cấm"} người dùng{" "}
            <strong>{selectedUser?.name}</strong> không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={confirmAction}
            color={actionType === "ban" ? "error" : "success"}
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageUsers;
