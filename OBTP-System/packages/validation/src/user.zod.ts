import { z } from "zod";
import { zEmail, zObjectId, zPassword, zPhone } from "./shared.zod";

/**
 * 1. CẬP NHẬT HỒ SƠ (UPDATE PROFILE)
 * Chỉ dành cho người dùng tự sửa thông tin cá nhân.
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được vượt quá 100 ký tự")
    .optional(),
  phone: zPhone.optional(),
});

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;

/**
 * 2. ĐỔI MẬT KHẨU (CHANGE PASSWORD)
 * Áp dụng khi người dùng đang đăng nhập và muốn thay đổi bảo mật.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: zPassword,
    confirmNewPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Mật khẩu mới không được trùng với mật khẩu cũ",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>;

/**
 * 3. QUẢN TRỊ VIÊN CẬP NHẬT TRẠNG THÁI (ADMIN USER STATUS)
 * Dành cho Dashboard Admin quản lý việc Cấm/Mở cấm.
 */
export const updateUserStatusSchema = z.object({
  isBanned: z.boolean({
    error: "Trạng thái cấm là bắt buộc",
  }),
});

export type UpdateUserStatusPayload = z.infer<typeof updateUserStatusSchema>;

/**
 * 4. QUẢN TRỊ VIÊN CẬP NHẬT VAI TRÒ & NHÀ XE (ADMIN PERMISSIONS)
 */
export const updateUserRolesSchema = z.object({
  roles: z
    .array(z.enum(["user", "company_admin", "admin"]))
    .min(1, "Người dùng phải có ít nhất 1 vai trò"),
  companyId: zObjectId.optional().nullable(),
});

export type UpdateUserRolesPayload = z.infer<typeof updateUserRolesSchema>;

/**
 * 🚀 DTO AN TOÀN - USER PROFILE RESPONSE
 * Dữ liệu hồ sơ trả về cho Client.
 */
export const userResponseSchema = z.object({
  id: zObjectId,
  email: zEmail,
  phone: zPhone,
  name: z.string(),
  roles: z.array(z.string()),
  companyId: z.string().optional().nullable(),
  isEmailVerified: z.boolean(),
  isBanned: z.boolean(),
  status: z.enum(["active", "inactive", "banned"]),
  lastLoginDate: z.iso.datetime().optional().nullable(),
  createdAt: z.iso.datetime(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;

/**
 * Dữ liệu tổng hợp dùng cho bảng danh sách User trên Admin Dashboard
 */
export const adminUserListResponseSchema = userResponseSchema.extend({
  totalBookings: z.number().int().min(0),
  totalSpent: z.number().min(0),
});

export type AdminUserListResponse = z.infer<typeof adminUserListResponseSchema>;
