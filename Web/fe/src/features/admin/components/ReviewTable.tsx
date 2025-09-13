import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Rating,
  Chip,
  IconButton,
  Box,
  Typography,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  MoreVert,
  Visibility,
  VisibilityOff,
  Delete,
} from "@mui/icons-material";
import type { AdminReview } from "../types/review";

interface ReviewTableProps {
  reviews: AdminReview[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAction: (type: "toggle" | "delete", review: AdminReview) => void;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN");

const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onAction,
}) => {
  const paginatedReviews = reviews.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 600 }}>Người đánh giá</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Đánh giá</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Bình luận</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ngày</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReviews.map((review) => (
              <TableRow key={review._id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{ bgcolor: "primary.light", color: "primary.dark" }}
                    >
                      {review.displayName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {review.displayName}{" "}
                        {review.isAnonymous && "( ẩn danh )"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {review.userId ? review.userId.email : "Guest"}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Rating value={review.rating} readOnly />
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ maxWidth: 300, whiteSpace: "pre-wrap" }}
                  >
                    {review.comment || "(Không có bình luận)"}
                  </Typography>
                </TableCell>
                <TableCell>{formatDate(review.createdAt)}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={review.isVisible ? "Đang hiển thị" : "Đã ẩn"}
                    color={review.isVisible ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip
                    title={
                      review.isVisible ? "Ẩn đánh giá" : "Hiển thị đánh giá"
                    }
                  >
                    <IconButton onClick={() => onAction("toggle", review)}>
                      {review.isVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa đánh giá">
                    <IconButton
                      color="error"
                      onClick={() => onAction("delete", review)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={reviews.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Số dòng mỗi trang"
      />
    </Paper>
  );
};

export default ReviewTable;
