import React, { useState } from "react";
import {
  Grid,
  Button,
  TextField,
  Autocomplete,
  Paper,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { vietnameseProvinces } from "../../../../data/provinces";

interface HomepageSearchState {
  from: string | null;
  to: string | null;
  date: Dayjs;
  passengers: number;
}

export const SearchForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState<HomepageSearchState>({
    from: null,
    to: null,
    date: dayjs(),
    passengers: 1,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    setError(null);
    if (!searchData.from || !searchData.to) {
      setError("Vui lòng chọn điểm đi và điểm đến.");
      return;
    }
    if (searchData.from === searchData.to) {
      setError("Điểm đi và điểm đến không được trùng nhau.");
      return;
    }

    const searchParams = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      date: searchData.date.format("YYYY-MM-DD"),
      passengers: searchData.passengers.toString(),
    });

    navigate(`/trips/search-results?${searchParams.toString()}`);
  };

  return (
    <Paper
      elevation={20}
      sx={{
        p: 4,
        borderRadius: 4,
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 20px 40px rgba(0, 119, 190, 0.3)",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          color: "text.primary",
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        Tìm chuyến xe lý tưởng
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Autocomplete
            options={vietnameseProvinces}
            value={searchData.from}
            onChange={(_, newValue) =>
              setSearchData({ ...searchData, from: newValue })
            }
            renderInput={(params) => (
              <TextField {...params} label="Điểm đi" required />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Autocomplete
            options={vietnameseProvinces.filter((p) => p !== searchData.from)}
            value={searchData.to}
            onChange={(_, newValue) =>
              setSearchData({ ...searchData, to: newValue })
            }
            renderInput={(params) => (
              <TextField {...params} label="Điểm đến" required />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label="Ngày đi"
            value={searchData.date}
            onChange={(newValue) =>
              setSearchData({ ...searchData, date: newValue || dayjs() })
            }
            minDate={dayjs()}
            slotProps={{ textField: { fullWidth: true, required: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Số lượng khách"
            type="number"
            fullWidth
            value={searchData.passengers}
            onChange={(e) =>
              setSearchData({
                ...searchData,
                passengers: parseInt(e.target.value) || 1,
              })
            }
            inputProps={{ min: 1, max: 10 }}
          />
        </Grid>
        <Grid size={12}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<Search />}
            onClick={handleSearch}
            disabled={!searchData.from || !searchData.to}
            sx={{
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #0077be 0%, #004c8b 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #004c8b 0%, #003366 100%)",
                transform: "translateY(-2px)",
              },
              "&:disabled": { background: "rgba(0, 0, 0, 0.12)" },
            }}
          >
            Tìm chuyến xe
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
