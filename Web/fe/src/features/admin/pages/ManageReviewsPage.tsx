import React from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useManageReviews } from "../hooks/useManageReviews";
import ReviewFilter from "../components/ReviewFilter";
import ReviewTable from "../components/ReviewTable";

const ManageReviewsPage: React.FC = () => {
  const {
    loading,
    error,
    filteredReviews,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    actionDialogOpen,
    actionType,
    selectedReview,
    handleAction,
    confirmAction,
    setActionDialogOpen,
  } = useManageReviews();

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Quản lý Đánh giá
      </Typography>

      <ReviewFilter
        filter={filter}
        onFilterChange={setFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <ReviewTable
        reviews={filteredReviews}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        onAction={handleAction}
      />

      {/* Dialog xác nhận hành động */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
      >
        <DialogTitle>Xác nhận hành động</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType === "delete"
              ? `Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá này không? Hành động này không thể hoàn tác.`
              : `Bạn có chắc chắn muốn ${
                  selectedReview?.isVisible ? "ẩn" : "hiển thị"
                } đánh giá này không?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={confirmAction}
            color={actionType === "delete" ? "error" : "primary"}
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageReviewsPage;
