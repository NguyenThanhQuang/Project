import { z } from "zod";
import { zEmail, zPassword, zPhone } from "./shared.zod";

/**
 * ĐĂNG KÝ (REGISTER)
 */
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được vượt quá 100 ký tự"),
  email: zEmail,
  password: zPassword,
  phone: zPhone,
});

export type RegisterPayload = z.infer<typeof registerSchema>;

/**
 * ĐĂNG NHẬP (LOGIN)
 */
export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email hoặc số điện thoại"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

export type LoginPayload = z.infer<typeof loginSchema>;

/**
 * QUÊN MẬT KHẨU (FORGOT PASSWORD)
 */
export const forgotPasswordSchema = z.object({
  email: zEmail,
});

export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

/**
 * ĐẶT LẠI MẬT KHẨU & KÍCH HOẠT TÀI KHOẢN (SHARED LOGIC)
 */
const setPasswordWithTokenSchema = z
  .object({
    token: z.string().min(1, "Token không hợp lệ hoặc đã hết hạn"),
    newPassword: zPassword,
    confirmNewPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmNewPassword"],
  });

export const resetPasswordSchema = setPasswordWithTokenSchema;
export const activateAccountSchema = setPasswordWithTokenSchema;

export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
export type ActivateAccountPayload = z.infer<typeof activateAccountSchema>;

/**
 * GỬI LẠI XÁC THỰC EMAIL / VERIFY EMAIL
 */
export const resendVerificationSchema = z.object({
  email: zEmail,
});

export const verifyEmailQuerySchema = z.object({
  token: z.string().min(1, "Token không được để trống"),
});

export type ResendVerificationPayload = z.infer<
  typeof resendVerificationSchema
>;
export type VerifyEmailQuery = z.infer<typeof verifyEmailQuerySchema>;

/**
 * 🚀 DTO AN TOÀN - DỮ LIỆU TRẢ VỀ (RESPONSES)
 * Loại bỏ passwordHash ngay từ Hợp đồng dữ liệu
 */
export const authUserResponseSchema = z.object({
  id: z.string(),
  email: zEmail,
  name: z.string(),
  roles: z.array(z.string()),
  companyId: z.string().optional(),
});

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: authUserResponseSchema,
});

export type AuthUserResponse = z.infer<typeof authUserResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

