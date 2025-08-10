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
  Avatar,
  Chip,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { MoreVert, Email, Phone, LocationOn } from "@mui/icons-material";
import type { CompanyWithStats, CompanyStatus } from "../types/company";
// Helper functions
const getStatusColor = (status: CompanyStatus) =>
  (({
    active: "success",
    pending: "warning",
    suspended: "error",
  }[status] || "default") as "success" | "warning" | "error" | "default");

const getStatusText = (status: CompanyStatus) =>
  ({
    active: "Hoạt động",
    pending: "Chờ duyệt",
    suspended: "Tạm ngưng",
  }[status]);

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN").format(amount) + "đ";
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN");

interface CompanyTableProps {
  companies: CompanyWithStats[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    company: CompanyWithStats
  ) => void;
}

const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onMenuOpen,
}) => {
  return (
    <Paper elevation={2} sx={{ borderRadius: 3 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f7fa" }}>
              <TableCell sx={{ fontWeight: 600 }}>Nhà xe</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Liên hệ</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Địa chỉ</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ngày đăng ký</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Số chuyến</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Doanh thu</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Đánh giá</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((company) => (
                <TableRow key={company._id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {company.name.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {company.name}
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
                        <Typography variant="body2">{company.email}</Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2">{company.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {company.address}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(company.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(company.status)}
                      color={getStatusColor(company.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {company.totalTrips.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {company.totalRevenue > 0
                        ? formatCurrency(company.totalRevenue)
                        : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {company.averageRating
                        ? `${company.averageRating.toFixed(1)}/5`
                        : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => onMenuOpen(e, company)}>
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
        count={companies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Số dòng mỗi trang:"
      />
    </Paper>
  );
};

export default CompanyTable;
