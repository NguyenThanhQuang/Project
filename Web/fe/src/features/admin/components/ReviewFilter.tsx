import React from "react";
import {
  Paper,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Box,
  Grid,
  Autocomplete,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import type { CompanyWithStats } from "../types/company";

interface ReviewFilterProps {
  filter: "all" | "visible" | "hidden";
  onFilterChange: (newValue: "all" | "visible" | "hidden") => void;
  searchTerm: string;
  onSearchChange: (newSearchTerm: string) => void;
  companies: CompanyWithStats[];
  selectedCompany: string | null;
  onCompanyChange: (companyId: string | null) => void;
}

const ReviewFilter: React.FC<ReviewFilterProps> = ({
  filter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  companies,
  selectedCompany,
  onCompanyChange,
}) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      {/* Hàng chứa các Tab lọc trạng thái */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={filter}
          onChange={(_, newValue) => onFilterChange(newValue)}
        >
          <Tab label="Tất cả" value="all" />
          <Tab label="Đang hiển thị" value="visible" />
          <Tab label="Đã ẩn" value="hidden" />
        </Tabs>
      </Box>

      {/* Hàng chứa các bộ lọc chi tiết */}
      <Grid container spacing={2} alignItems="center">
        {/* Bộ lọc theo nhà xe */}
        <Grid size = {{ xs: 12, md: 5 }}>
          <Autocomplete
            options={companies}
            getOptionLabel={(option) => option.name}
            value={companies.find((c) => c._id === selectedCompany) || null}
            onChange={(_, newValue) => {
              onCompanyChange(newValue?._id || null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Lọc theo nhà xe"
                size="small"
                variant="outlined"
              />
            )}
            fullWidth
          />
        </Grid>

        {/* Ô tìm kiếm */}
        <Grid size = {{ xs: 12, md: 7 }}>
          <TextField
            placeholder="Tìm theo bình luận, người gửi, email..."
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
            fullWidth
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ReviewFilter;
