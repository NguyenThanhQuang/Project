import React, { useState } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
} from "@mui/material";

interface ReviewFormProps {
  onSubmit: (data: {
    rating: number;
    comment?: string;
    isAnonymous: boolean;
  }) => Promise<void>;
  initialData?: { rating: number; comment?: string; isAnonymous: boolean };
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [rating, setRating] = useState<number | null>(
    initialData?.rating || null
  );
  const [comment, setComment] = useState(initialData?.comment || "");
  const [isAnonymous, setIsAnonymous] = useState(
    initialData?.isAnonymous || false
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === null) {
      setError("Vui lòng chọn số sao đánh giá.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await onSubmit({ rating, comment, isAnonymous });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 2,
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Để lại đánh giá của bạn
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography component="legend">Chất lượng chuyến đi</Typography>
        <Rating
          name="rating"
          value={rating}
          onChange={(_, newValue) => setRating(newValue)}
          size="large"
        />
      </Box>

      <TextField
        label="Chia sẻ cảm nhận của bạn (không bắt buộc)"
        multiline
        rows={4}
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 1 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
        }
        label="Gửi đánh giá ẩn danh"
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        fullWidth
        sx={{ mt: 2, py: 1.5 }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Gửi đánh giá"
        )}
      </Button>
    </Box>
  );
};
