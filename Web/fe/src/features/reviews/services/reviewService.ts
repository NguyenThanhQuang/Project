import api from '../../../services/api';
import { getErrorMessage } from '../../../utils/getErrorMessage';

import type { ReviewFormData } from '../types/review';

/**
 * Gửi đánh giá lên server.
 * Tự động chọn đúng endpoint (guest hoặc user) dựa vào việc có `contactPhone` hay không.
 */
export const submitReview = async (reviewData: ReviewFormData): Promise<{ message: string }> => {
  try {
    let response;
    if (reviewData.contactPhone) {
      response = await api.post('/reviews/guest', reviewData);
    } else {
      response = await api.post('/reviews', reviewData);
    }
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Gửi đánh giá không thành công.'));
  }
};