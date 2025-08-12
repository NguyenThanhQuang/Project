// File: fe/src/features/admin/components/VehicleTable.tsx

import React from "react";
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Box,
  Avatar,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import {
  MoreVert,
  Hotel,
  AirlineSeatReclineNormal,
  DirectionsBus,
} from "@mui/icons-material";
import type { Vehicle, VehicleStatus } from "../types/vehicle";

interface VehicleTableProps {
  vehicles: Vehicle[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, vehicle: Vehicle) => void;
}

// Helper functions để giữ cho JSX sạch sẽ
const getStatusColor = (status: VehicleStatus) =>
  (({
    active: "success",
    maintenance: "warning",
    inactive: "error",
  }[status] || "default") as "success" | "warning" | "error" | "default");

const getStatusText = (status: VehicleStatus) =>
  ({
    active: "Hoạt động",
    maintenance: "Bảo trì",
    inactive: "Ngừng hoạt động",
  }[status]);

const getVehicleTypeIcon = (type: string) => {
  if (type.toLowerCase().includes("giường")) return <Hotel />;
  if (type.toLowerCase().includes("ghế")) return <AirlineSeatReclineNormal />;
  return <DirectionsBus />;
};

const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onMenuOpen,
}) => (
  <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.100" }}>
            <TableCell sx={{ fontWeight: 600 }}>Thông tin xe</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Số ghế</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">
              Thao tác
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((vehicle) => (
              <TableRow
                key={vehicle._id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.light" }}>
                      {getVehicleTypeIcon(vehicle.type)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {vehicle.vehicleNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.type}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {vehicle.totalSeats}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(vehicle.status)}
                    color={getStatusColor(vehicle.status)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={(e) => onMenuOpen(e, vehicle)}>
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
      count={vehicles.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      labelRowsPerPage="Số dòng mỗi trang"
      labelDisplayedRows={({ from, to, count }) =>
        `${from}-${to} trên ${count}`
      }
    />
  </Paper>
);

export default VehicleTable;
