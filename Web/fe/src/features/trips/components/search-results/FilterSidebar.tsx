import React from "react";
import {
  Box,
  Typography,
  Paper,
  Slider,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import type { Company, Filters } from "../../../../types";

// Định nghĩa kiểu dữ liệu cho các tùy chọn bộ lọc được truyền từ trang cha
export interface FilterOptions {
  companies: Company[];
  vehicleTypes: string[];
  maxPrice: number;
}

// Định nghĩa props
interface FilterSidebarProps {
  filters: Filters;
  onFiltersChange: (newFilters: Filters) => void;
  filterOptions: FilterOptions;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  filterOptions,
}) => {
  const timeSlots = [
    { value: "morning", label: "Sáng (06:00 - 12:00)" },
    { value: "afternoon", label: "Chiều (12:00 - 18:00)" },
    { value: "evening", label: "Tối (18:00 - 00:00)" },
    { value: "night", label: "Đêm (00:00 - 06:00)" },
  ];

  // Hàm helper để xử lý thay đổi checkbox
  const handleCheckboxChange = (filterKey: keyof Filters, value: string) => {
    const currentValues = filters[filterKey] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    onFiltersChange({ ...filters, [filterKey]: newValues });
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    onFiltersChange({ ...filters, priceRange: newValue as number[] });
  };

  return (
    <Paper
      elevation={2}
      sx={{ p: 3, borderRadius: 3, position: "sticky", top: 20 }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <FilterList sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Bộ lọc
        </Typography>
      </Box>

      {/* Lọc theo Nhà xe */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Nhà xe
        </Typography>
        {filterOptions.companies.map((company) => (
          <FormControlLabel
            key={company._id}
            control={
              <Checkbox
                checked={filters.companies.includes(company._id)}
                onChange={() => handleCheckboxChange("companies", company._id)}
                size="small"
              />
            }
            label={company.name}
          />
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Lọc theo Giờ khởi hành */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Giờ khởi hành
        </Typography>
        {timeSlots.map((slot) => (
          <FormControlLabel
            key={slot.value}
            control={
              <Checkbox
                checked={filters.timeSlots.includes(slot.value)}
                onChange={() => handleCheckboxChange("timeSlots", slot.value)}
                size="small"
              />
            }
            label={slot.label}
          />
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Lọc theo Loại xe */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Loại xe
        </Typography>
        {filterOptions.vehicleTypes.map((type) => (
          <FormControlLabel
            key={type}
            control={
              <Checkbox
                checked={filters.vehicleTypes.includes(type)}
                onChange={() => handleCheckboxChange("vehicleTypes", type)}
                size="small"
              />
            }
            label={type}
          />
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Lọc theo Khoảng giá */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Khoảng giá
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={filterOptions.maxPrice || 1000000}
          step={10000}
          valueLabelFormat={(value) => `${value.toLocaleString()}đ`}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="caption">
            {filters.priceRange[0].toLocaleString()}đ
          </Typography>
          <Typography variant="caption">
            {filters.priceRange[1].toLocaleString()}đ
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
