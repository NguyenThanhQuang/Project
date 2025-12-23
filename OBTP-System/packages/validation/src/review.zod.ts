import { z } from "zod";
import { zEmail, zISOString, zObjectId, zPhone } from "./shared.zod";

const baseReviewObject = z.object({
  tripId: zObjectId,
  bookingId: zObjectId,
  rating: z.coerce
    .number()
    .int()
    .min(1, "Vui lòng chọn ít nhất 1 sao")
    .max(5, "Đánh giá tối đa là 5 sao"),
  comment: z
    .string()
    .trim()
    .max(2000, "Bình luận không được vượt quá 2000 ký tự")
    .optional(),
  isAnonymous: z.boolean().default(false),
});

/**
 * 1. TẠO ĐÁNH GIÁ - NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP
 */
export const createReviewSchema = baseReviewObject;
export type CreateReviewPayload = z.infer<typeof createReviewSchema>;

/**
 * 2. TẠO ĐÁNH GIÁ - KHÁCH VÃNG LAI
 * (Yêu cầu phone để map với thông tin trong booking.passengers)
 */
export const createGuestReviewSchema = baseReviewObject.extend({
  contactPhone: zPhone,
});
export type CreateGuestReviewPayload = z.infer<typeof createGuestReviewSchema>;

/**
 * 3. NGƯỜI DÙNG CẬP NHẬT ĐÁNH GIÁ
 * Chỉ cho phép cập nhật Sao và Nội dung
 */
export const updateReviewSchema = baseReviewObject
  .pick({
    rating: true,
    comment: true,
  })
  .partial();
export type UpdateReviewPayload = z.infer<typeof updateReviewSchema>;

/**
 * 4. QUẢN TRỊ VIÊN KIỂM DUYỆT (TOGGLE VISIBILITY)
 */
export const toggleReviewVisibilitySchema = z.object({
  isVisible: z.boolean(),
});
export type ToggleReviewVisibilityPayload = z.infer<
  typeof toggleReviewVisibilitySchema
>;

/**
 * 5. TRUY VẤN DANH SÁCH (QUERY FILTER)
 */
export const reviewQuerySchema = z.object({
  companyId: zObjectId.optional(),
  tripId: zObjectId.optional(),
  userId: zObjectId.optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});
export type ReviewQuery = z.infer<typeof reviewQuerySchema>;

/**
 * 🚀 DTO AN TOÀN - REVIEW RESPONSE
 */
export const reviewResponseSchema = z.object({
  id: zObjectId,
  userId: zObjectId.optional().nullable(),
  displayName: z.string(),
  tripId: zObjectId,
  companyId: zObjectId,
  bookingId: zObjectId,
  rating: z.number().int(),
  comment: z.string().optional().nullable(),
  isAnonymous: z.boolean(),
  isVisible: z.boolean(),
  editCount: z.number().int(),
  lastEditedAt: zISOString.optional().nullable(),
  createdAt: zISOString,
});

export type ReviewResponse = z.infer<typeof reviewResponseSchema>;

/**
 * DTO dành cho Quản trị viên (Xem sâu)
 */
export const adminReviewResponseSchema = reviewResponseSchema.extend({
  userEmail: zEmail.optional().nullable(),
  companyName: z.string(),
});
export type AdminReviewResponse = z.infer<typeof adminReviewResponseSchema>;
