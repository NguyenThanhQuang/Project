import { z } from "zod";
import { zGeoLocationSchema, zObjectId } from "./shared.zod";

/**
 * ⚛️ ENUMS (Phụ thuộc vào Luật Một nguồn sự thật)
 * Đồng bộ chính xác với LocationType trong enums.ts
 */
const LocationTypeEnum = z.enum([
  "bus_station",
  "company_office",
  "pickup_point",
  "rest_stop",
  "city",
  "other",
]);

/**
 * 1. TẠO ĐỊA ĐIỂM (CREATE LOCATION) - Dành cho Quản trị viên
 * Chặn lỗi định dạng địa lý ngay từ cửa ngõ API
 */
export const createLocationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên địa điểm phải có ít nhất 2 ký tự")
    .max(200, "Tên địa điểm quá dài"),
  province: z.string().trim().min(1, "Vui lòng chọn Tỉnh/Thành phố"),
  district: z.string().trim().optional(),
  fullAddress: z.string().trim().min(5, "Địa chỉ chi tiết không được để trống"),
  location: zGeoLocationSchema, // [Longitude, Latitude]
  type: LocationTypeEnum,
  images: z
    .array(z.url({ message: "Mỗi ảnh phải là một URL hợp lệ" }))
    .optional()
    .default([]),
  isActive: z.boolean().default(true),
});

export type CreateLocationPayload = z.infer<typeof createLocationSchema>;

/**
 * 2. CẬP NHẬT ĐỊA ĐIỂM (UPDATE LOCATION)
 */
export const updateLocationSchema = createLocationSchema.partial();

export type UpdateLocationPayload = z.infer<typeof updateLocationSchema>;

/**
 * 3. TRUY VẤN TÌM KIẾM ĐỊA ĐIỂM (SEARCH QUERY)
 * Dùng cho Autocomplete trên Frontend (Dropdown gợi ý điểm đi/đến)
 */
export const searchLocationQuerySchema = z.object({
  q: z.string().trim().min(1, "Vui lòng nhập từ khóa tìm kiếm").max(100),
  limit: z.coerce.number().int().min(1).max(50).default(15),
  type: LocationTypeEnum.optional(),
});

export type SearchLocationQuery = z.infer<typeof searchLocationQuerySchema>;

/**
 * 🚀 DTO AN TOÀN - DỮ LIỆU TRẢ VỀ (RESPONSE)
 * Luật "Thủ kho vô tri": Trả về tọa độ thô và định danh thô
 */
export const locationResponseSchema = z.object({
  id: zObjectId,
  name: z.string(),
  slug: z.string(),
  province: z.string(),
  district: z.string().optional().nullable(),
  fullAddress: z.string(),
  location: zGeoLocationSchema,
  type: LocationTypeEnum,
  images: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
});

export type LocationResponse = z.infer<typeof locationResponseSchema>;

/**
 * Schema dành cho trang chủ: Danh sách các địa điểm phổ biến
 */
export const popularLocationsResponseSchema = z.array(
  locationResponseSchema.pick({
    id: true,
    name: true,
    province: true,
    type: true,
    images: true,
  })
);

export type PopularLocationsResponse = z.infer<
  typeof popularLocationsResponseSchema
>;
