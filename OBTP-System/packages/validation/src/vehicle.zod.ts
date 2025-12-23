import { z } from "zod";
import { zISOString, zObjectId, zVehiclePlate } from "./shared.zod";

export const VehicleStatusEnum = z.enum(["active", "maintenance", "inactive"]);

export const seatMapSchema = z.object({
  rows: z.number().int().min(1),
  cols: z.number().int().min(1),
  layout: z.array(z.array(z.string().nullable())),
});

/**
 * 1. TẠO XE MỚI (CREATE VEHICLE)
 */
export const createVehicleSchema = z
  .object({
    companyId: zObjectId,
    vehicleNumber: zVehiclePlate.transform((val) => val.toUpperCase().trim()),
    type: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập loại xe (vd: Limousine, Giường nằm)")
      .max(100),
    description: z.string().trim().max(1000).optional(),
    status: VehicleStatusEnum.default("active"),

    floors: z.coerce
      .number()
      .int()
      .min(1, "Ít nhất phải có 1 tầng")
      .max(2, "Tối đa 2 tầng"),
    seatColumns: z.coerce
      .number()
      .int()
      .min(1, "Số cột tối thiểu là 1")
      .max(10, "Số cột tối đa là 10"),
    seatRows: z.coerce
      .number()
      .int()
      .min(1, "Số hàng tối thiểu là 1")
      .max(20, "Số hàng tối đa là 20"),
    aislePositions: z
      .array(z.number().int().min(1))
      .max(5, "Số lối đi không vượt quá 5")
      .default([2]),
  })
  .refine(
    (data) => data.aislePositions.every((pos) => pos <= data.seatColumns),
    {
      message: "Vị trí lối đi không thể lớn hơn tổng số cột ghế",
      path: ["aislePositions"],
    }
  );

export type CreateVehiclePayload = z.infer<typeof createVehicleSchema>;

/**
 * 2. CẬP NHẬT XE (UPDATE VEHICLE)
 */
export const updateVehicleSchema = createVehicleSchema
  .omit({ companyId: true })
  .partial();

export type UpdateVehiclePayload = z.infer<typeof updateVehicleSchema>;

/**
 * 🚀 DTO AN TOÀN - VEHICLE RESPONSE
 */
export const vehicleResponseSchema = z.object({
  id: zObjectId,
  companyId: zObjectId,
  vehicleNumber: z.string(),
  type: z.string(),
  description: z.string().optional().nullable(),
  status: VehicleStatusEnum,
  floors: z.number().int(),
  seatColumns: z.number().int(),
  seatRows: z.number().int(),
  aislePositions: z.array(z.number()),
  totalSeats: z.number().int(),
  seatMap: seatMapSchema.optional().nullable(),
  seatMapFloor2: seatMapSchema.optional().nullable(),
  createdAt: zISOString,
});

export type VehicleResponse = z.infer<typeof vehicleResponseSchema>;

/**
 * Query tìm kiếm/lọc xe
 */
export const vehicleQuerySchema = z.object({
  companyId: zObjectId.optional(),
  status: VehicleStatusEnum.optional(),
  q: z.string().trim().optional(),
});

export type VehicleQuery = z.infer<typeof vehicleQuerySchema>;
