import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteReview,
  getAllReviews,
  updateReviewVisibility,
} from "../services/reviewAdminService";
import type { AdminReview } from "../types/review";

export const useManageReviews = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(
    null
  );
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"toggle" | "delete" | null>(
    null
  );

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const filteredReviews = useMemo(() => {
    return reviews
      .filter((review) => {
        if (filter === "visible") return review.isVisible;
        if (filter === "hidden") return !review.isVisible;
        return true;
      })
      .filter(
        (review) =>
          review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.userId?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [reviews, filter, searchTerm]);

  const handleAction = (type: "toggle" | "delete", review: AdminReview) => {
    setSelectedReview(review);
    setActionType(type);
    setActionDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedReview || !actionType) return;

    try {
      if (actionType === "toggle") {
        await updateReviewVisibility(
          selectedReview._id,
          !selectedReview.isVisible
        );
      } else if (actionType === "delete") {
        await deleteReview(selectedReview._id);
      }
      await fetchReviews();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionDialogOpen(false);
    }
  };

  return {
    loading,
    error,
    filteredReviews,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    actionDialogOpen,
    actionType,
    selectedReview,
    handleAction,
    confirmAction,
    setActionDialogOpen,
  };
};
