import { z } from "zod";
import { locationResponseSchema } from "./location.zod";
import { zAmount, zISOString, zObjectId } from "./shared.zod";
import { seatMapSchema } from "./vehicle.zod";

export const TripStatusEnum = z.enum([
  "scheduled",
  "departed",
  "arrived",
  "cancelled",
]);

export const SeatStatusEnum = z.enum(["available", "held", "booked"]);
export const TripStopStatusEnum = z.enum(["pending", "arrived", "departed"]);

/**
 * Các thành phần con trong chuyến đi
 */
const TripSeatSchema = z.object({
  seatNumber: z.string().min(1),
  status: SeatStatusEnum.default("available"),
  bookingId: zObjectId.optional().nullable(),
});

const TripStopSchema = z.object({
  locationId: zObjectId,
  expectedArrivalTime: zISOString,
  expectedDepartureTime: zISOString.optional().nullable(),
  status: TripStopStatusEnum.default("pending"),
});

/**
 * 1. TẠO CHUYẾN ĐI MỚI (CREATE TRIP)
 * Hợp đồng nặng ký: Kiểm tra logic địa lý và thời gian
 */
export const createTripSchema = z
  .object({
    companyId: zObjectId,
    vehicleId: zObjectId,
    route: z.object({
      fromLocationId: zObjectId,
      toLocationId: zObjectId,
      stops: z.array(TripStopSchema).default([]),
    }),
    departureTime: zISOString,
    expectedArrivalTime: zISOString,
    price: zAmount.min(10000, "Giá vé tối thiểu 10,000 VNĐ"),
    status: TripStatusEnum.default("scheduled"),
    isRecurrenceTemplate: z.boolean().default(false),
    isRecurrenceActive: z.boolean().default(true),
  })
  .refine((data) => data.route.fromLocationId !== data.route.toLocationId, {
    message: "Điểm đi và điểm đến không được trùng nhau",
    path: ["route.toLocationId"],
  })
  .refine(
    (data) => {
      const start = new Date(data.departureTime).getTime();
      const end = new Date(data.expectedArrivalTime).getTime();
      // Luật: Không có xe khách nào bay được nhanh hơn 30 phút cho một hành trình liên tỉnh
      return end > start + 30 * 60 * 1000;
    },
    {
      message: "Hành trình dự kiến phải kéo dài ít nhất 30 phút",
      path: ["expectedArrivalTime"],
    }
  );

export type CreateTripPayload = z.infer<typeof createTripSchema>;

/**
 * 2. CẬP NHẬT CHUYẾN ĐI (UPDATE TRIP)
 */
export const updateTripSchema = createTripSchema.partial();
export type UpdateTripPayload = z.infer<typeof updateTripSchema>;

/**
 * 3. TRUY VẤN TÌM CHUYẾN (SEARCH QUERY)
 */
export const searchTripsQuerySchema = z.object({
  from: z.string().trim().min(1, "Vui lòng nhập điểm khởi hành"),
  to: z.string().trim().min(1, "Vui lòng nhập điểm đến"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày phải là YYYY-MM-DD"),
  passengers: z.coerce.number().int().min(1).max(5).default(1),
});

export type SearchTripsQuery = z.infer<typeof searchTripsQuerySchema>;

/**
 * 🚀 DTO AN TOÀN - DỮ LIỆU TÓM TẮT TRONG LIST SEARCH
 */
export const tripSearchResultSchema = z.object({
  id: zObjectId,
  company: z.object({
    id: zObjectId,
    name: z.string(),
    logoUrl: z.string().url().optional().nullable(),
    avgRating: z.number().min(0).max(5).default(0),
    reviewCount: z.number().int().default(0),
  }),
  vehicleType: z.string(),
  route: z.object({
    fromProvince: z.string(),
    toProvince: z.string(),
  }),
  departureTime: zISOString,
  expectedArrivalTime: zISOString,
  price: zAmount,
  availableSeatsCount: z.number().int(),
  status: TripStatusEnum,
});

export type TripSearchResult = z.infer<typeof tripSearchResultSchema>;

/**
 * 🚀 DTO CHI TIẾT - TRANG CHỌN GHẾ
 */
export const tripDetailResponseSchema = z.object({
  id: zObjectId,
  companyId: zObjectId,
  vehicle: z.object({
    id: zObjectId,
    type: z.string(),
    totalSeats: z.number().int(),
    seatMap: seatMapSchema,
    seatMapFloor2: seatMapSchema.optional().nullable(),
  }),
  departureTime: zISOString,
  expectedArrivalTime: zISOString,
  price: zAmount,
  seats: z.array(TripSeatSchema),
  route: z.object({
    fromLocation: locationResponseSchema,
    toLocation: locationResponseSchema,
    stops: z.array(
      z.object({
        location: locationResponseSchema,
        expectedArrivalTime: zISOString,
        expectedDepartureTime: zISOString.optional().nullable(),
        status: TripStopStatusEnum,
      })
    ),
    polyline: z.string().optional(),
    distance: z.number().optional(),
    duration: z.number().optional(),
  }),
  isRecurrenceTemplate: z.boolean(),
  recurrenceParentId: zObjectId.optional().nullable(),
});

export type TripDetailResponse = z.infer<typeof tripDetailResponseSchema>;
