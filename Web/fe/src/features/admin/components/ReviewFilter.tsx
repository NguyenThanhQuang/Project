import React from "react";
import {
  Paper,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import { Search } from "@mui/icons-material";

interface ReviewFilterProps {
  filter: "all" | "visible" | "hidden";
  onFilterChange: (newValue: "all" | "visible" | "hidden") => void;
  searchTerm: string;
  onSearchChange: (newSearchTerm: string) => void;
}

const ReviewFilter: React.FC<ReviewFilterProps> = ({
  filter,
  onFilterChange,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs
          value={filter}
          onChange={(_, newValue) => onFilterChange(newValue)}
        >
          <Tab label="Tất cả" value="all" />
          <Tab label="Đang hiển thị" value="visible" />
          <Tab label="Đã ẩn" value="hidden" />
        </Tabs>
        <TextField
          placeholder="Tìm theo bình luận, người gửi..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 350 }}
        />
      </Box>
    </Paper>
  );
};

export default ReviewFilter;
