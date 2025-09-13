import { useEffect, useMemo, useState } from "react";
import { useNotification } from "../../../components/common/NotificationProvider";
import { submitReview } from "../../reviews/services/reviewService";
import type { ReviewFormData } from "../../reviews/types/review";
import { getMyBookings } from "../services/bookingProfileService";
import type { MyBooking } from "../types/booking";

export const useMyBookings = () => {
  const { showNotification } = useNotification();
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<MyBooking | null>(
    null
  );

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    switch (activeTab) {
      case "upcoming":
        return bookings.filter(
          (b) =>
            b.trip.departureDate >= today &&
            ["confirmed", "held"].includes(b.status)
        );
      case "completed":
        return bookings.filter(
          (b) => b.trip.departureDate < today || b.status === "completed"
        );
      case "cancelled":
        return bookings.filter((b) =>
          ["cancelled", "expired"].includes(b.status)
        );
      default:
        return bookings;
    }
  }, [bookings, activeTab]);

  const handleOpenReviewDialog = (booking: MyBooking) => {
    setSelectedBooking(booking);
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleReviewSubmit = async (
    data: Omit<ReviewFormData, "bookingId" | "tripId">
  ) => {
    if (!selectedBooking) return;
    await submitReview({
      ...data,
      bookingId: selectedBooking.id,
      tripId: selectedBooking.trip.id,
    });
    showNotification("Đánh giá của bạn đã được ghi nhận. Cảm ơn!", "success");
    handleCloseReviewDialog();
    fetchBookings();
  };

  return {
    isLoading,
    error,
    bookings,
    filteredBookings,
    activeTab,
    setActiveTab,
    reviewDialogOpen,
    selectedBooking,
    handleOpenReviewDialog,
    handleCloseReviewDialog,
    handleReviewSubmit,
  };
};
