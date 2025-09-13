import React from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Button,
} from "@mui/material";
import { useBookingLookup } from "../hooks/useBookingLookup";
import { BookingLookupForm } from "../components/BookingLookupForm";
import { BookingDetailsCard } from "../components/BookingDetailsCard";

const BookingLookupPage: React.FC = () => {
  const { bookingResult, isLoading, error, performLookup, clearLookup } =
    useBookingLookup();
  const handleReviewSuccess = () => {
    if (bookingResult) {
      performLookup({
        identifier: bookingResult.ticketCode || bookingResult._id,
        contactPhone: bookingResult.contactPhone,
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{ fontWeight: 700, mb: 4 }}
        >
          Tra cứu thông tin vé
        </Typography>

        {!bookingResult ? (
          <BookingLookupForm onLookup={performLookup} isLoading={isLoading} />
        ) : (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Kết quả tra cứu:
            </Typography>

            <BookingDetailsCard
              booking={bookingResult}
              onReviewSubmitSuccess={handleReviewSuccess}
            />

            <Button onClick={clearLookup} variant="outlined" sx={{ mt: 3 }}>
              Tra cứu vé khác
            </Button>
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ mt: 3, visibility: bookingResult ? "hidden" : "visible" }}
          >
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default BookingLookupPage;
