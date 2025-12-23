import { z } from "zod";
import { zEmail, zObjectId, zPhone } from "./shared.zod";

export const CompanyStatusEnum = z.enum(["active", "pending", "suspended"]);

/**
 * 1. ĐĂNG KÝ/TẠO MỚI NHÀ XE (CREATE COMPANY)
 * Quy trình Onboarding: Yêu cầu cả thông tin doanh nghiệp và quản trị viên
 */
export const createCompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Tên nhà xe phải có ít nhất 3 ký tự")
    .max(100, "Tên nhà xe quá dài"),
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(2, "Mã nhà xe quá ngắn")
    .max(20, "Mã nhà xe quá dài")
    .regex(/^[A-Z0-9_]+$/, "Mã chỉ bao gồm chữ in hoa, số và dấu gạch dưới"),
  email: zEmail.optional(),
  phone: zPhone.optional(),
  address: z.string().trim().max(255, "Địa chỉ quá dài").optional(),
  description: z
    .string()
    .trim()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional(),
  logoUrl: z.url("Logo phải là đường dẫn URL hợp lệ").optional(),
  status: CompanyStatusEnum.default("pending"),

  adminName: z.string().trim().min(2, "Tên admin phải có ít nhất 2 ký tự"),
  adminEmail: zEmail,
  adminPhone: zPhone,
});

export type CreateCompanyPayload = z.infer<typeof createCompanySchema>;

/**
 * 2. CẬP NHẬT THÔNG TIN (UPDATE COMPANY)
 * Không cho phép cập nhật adminAccount qua luồng này để đảm bảo "Biên giới rõ ràng"
 */
export const updateCompanySchema = createCompanySchema
  .omit({
    adminName: true,
    adminEmail: true,
    adminPhone: true,
    code: true,
  })
  .partial();

export type UpdateCompanyPayload = z.infer<typeof updateCompanySchema>;

/**
 * 3. QUẢN TRỊ VIÊN CẬP NHẬT TRẠNG THÁI (CHANGE STATUS)
 */
export const updateCompanyStatusSchema = z.object({
  status: CompanyStatusEnum,
});

export type UpdateCompanyStatusPayload = z.infer<
  typeof updateCompanyStatusSchema
>;

/**
 * 🚀 DTO AN TOÀN - COMPANY RESPONSE
 */
export const companyResponseSchema = z.object({
  id: zObjectId,
  name: z.string(),
  code: z.string(),
  email: z.email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  status: CompanyStatusEnum,
  createdAt: z.iso.datetime(),
});

export type CompanyResponse = z.infer<typeof companyResponseSchema>;

/**
 * 📊 DTO NÂNG CAO - DÀNH CHO ADMIN DASHBOARD (Có chứa Stats)
 */
export const adminCompanyListResponseSchema = companyResponseSchema.extend({
  totalTrips: z.number().int().min(0).default(0),
  totalRevenue: z.number().min(0).default(0),
  averageRating: z.number().min(0).max(5).nullable(),
});

export type AdminCompanyListResponse = z.infer<
  typeof adminCompanyListResponseSchema
>;
