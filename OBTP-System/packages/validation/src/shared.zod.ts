import { z } from "zod";
/**
 * ID chung cho mọi Resource (MongoDB ObjectId)
 */
export const zObjectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Định dạng ID không hợp lệ");

/**
 * Định dạng Email (Top-level function trong Zod 4)
 * Tránh nợ kỹ thuật: z.string().email() nay đổi thành z.email() để tối ưu Tree-shaking
 */
export const zEmail = z.email({ message: "Email không đúng định dạng" });

/**
 * Số điện thoại Việt Nam (Regex đã kiểm tra đầu số mới nhất)
 */
export const zPhone = z
  .string()
  .regex(
    /^(0|84)(3|5|7|8|9|1[2689])([0-9]{8})$/,
    "Số điện thoại Việt Nam không hợp lệ"
  );

/**
 * Mật khẩu "Thép"
 */
export const zPassword = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/[A-Z]/, "Cần ít nhất 1 chữ hoa")
  .regex(/[a-z]/, "Cần ít nhất 1 chữ thường")
  .regex(/[0-9]/, "Cần ít nhất 1 chữ số")
  .regex(/[^A-Za-z0-9]/, "Cần ít nhất 1 ký tự đặc biệt");

/**
 * "Thủ kho vô tri" - Thời gian ISO chuẩn
 */
export const zISOString = z.iso.datetime({
  message: "Ngày tháng không đúng định dạng ISO 8601",
});

/**
 * Validate số tiền (VNĐ) - Dùng số nguyên, tối thiểu là 0
 */
export const zAmount = z.coerce
  .number()
  .int()
  .min(0, "Giá trị phải lớn hơn hoặc bằng 0");

/**
 * Biển số xe Việt Nam (VD: 51A-123.45 hoặc 51A-12345)
 */
export const zVehiclePlate = z
  .string()
  .regex(
    /^[0-9]{2}[A-Z]-[0-9]{3,5}(\.[0-9]{1,2})?$/,
    "Biển số xe không hợp lệ"
  );

/**
 * Mã vé/Mã giao dịch (In hoa, không khoảng trắng, 6-12 ký tự)
 */
export const zReferenceCode = z
  .string()
  .toUpperCase()
  .regex(/^[A-Z0-9]{6,12}$/, "Mã không hợp lệ");

/**
 * Tọa độ địa lý GeoJSON cho MongoDB
 */
export const zGeoLocationSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([
    z.number().min(-180).max(180), // Longitude
    z.number().min(-90).max(90), // Latitude
  ]),
});

/**
 * Query Phân trang mặc định
 */
export const zPaginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * Error Code Pattern
 */
export const zErrorCode = z.string().startsWith("ERR_");
