import api from "../../../services/api";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import type { AdminReview } from "../types/review";

export const getAllReviews = async (): Promise<AdminReview[]> => {
  try {
    const response = await api.get("/reviews/admin/all");
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Không thể tải danh sách đánh giá.")
    );
  }
};

export const updateReviewVisibility = async (
  reviewId: string,
  isVisible: boolean
): Promise<AdminReview> => {
  try {
    const response = await api.patch(`/reviews/${reviewId}`, { isVisible });
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Cập nhật trạng thái không thành công.")
    );
  }
};

export const deleteReview = async (
  reviewId: string
): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Xóa đánh giá không thành công."));
  }
};
