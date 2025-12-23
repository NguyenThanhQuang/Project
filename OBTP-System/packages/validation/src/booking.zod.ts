import { z } from "zod";
import { zAmount, zEmail, zISOString, zObjectId, zPhone } from "./shared.zod";
import { tripDetailResponseSchema } from "./trip.zod";

/**
 * ⚛️ ENUMS & CONSTANTS
 */
export const BookingStatusEnum = z.enum([
  "pending",
  "held",
  "confirmed",
  "cancelled",
  "expired",
  "completed",
]);

export const PaymentStatusEnum = z.enum([
  "pending",
  "paid",
  "failed",
  "refunded",
]);

/**
 * 1. THÔNG TIN HÀNH KHÁCH (PASSENGER HOLD DTO)
 * Chặn đầu vào khi người dùng điền tên/SĐT cho từng ghế
 */
export const passengerHoldSchema = z.object({
  name: z.string().trim().min(2, "Tên hành khách quá ngắn").max(100),
  phone: zPhone,
  seatNumber: z.string().trim().min(1, "Số ghế không được để trống"),
});

/**
 * 2. YÊU CẦU GIỮ CHỖ (CREATE HOLD PAYLOAD)
 * Quy trình: Client gửi danh sách ghế muốn giữ + Thông tin liên hệ
 */
export const createHoldSchema = z
  .object({
    tripId: zObjectId,
    passengers: z
      .array(passengerHoldSchema)
      .min(1, "Phải chọn ít nhất 1 ghế")
      .max(5, "Tối đa 5 ghế cho mỗi đơn đặt vé"), // Business Limit từ THÁNH KINH
    contactName: z.string().trim().min(2, "Tên liên hệ không hợp lệ"),
    contactPhone: zPhone,
    contactEmail: zEmail.optional(),
  })
  .refine(
    (data) => {
      const seats = data.passengers.map((p) => p.seatNumber);
      return new Set(seats).size === seats.length;
    },
    {
      message: "Không được đặt trùng một ghế trong cùng một yêu cầu",
      path: ["passengers"],
    }
  );

export type CreateHoldPayload = z.infer<typeof createHoldSchema>;

/**
 * 3. TRA CỨU VÉ (LOOKUP BOOKING)
 * Hỗ trợ tra cứu bằng ID hoặc TicketCode (Mã vé)
 */
export const lookupBookingSchema = z.object({
  identifier: z.string().trim().min(1, "Vui lòng nhập mã vé hoặc ID đơn hàng"),
  contactPhone: zPhone,
});

export type LookupBookingParams = z.infer<typeof lookupBookingSchema>;

/**
 * 🚀 DTO AN TOÀN - BOOKING RESPONSE
 * Luật "Thủ kho vô tri": Chỉ trả về dữ liệu thô, không format tiền/ngày
 */
export const bookingResponseSchema = z.object({
  id: zObjectId,
  userId: zObjectId.optional().nullable(),
  tripId: zObjectId,
  companyId: zObjectId,
  bookingTime: zISOString,
  status: BookingStatusEnum,
  paymentStatus: PaymentStatusEnum,
  totalAmount: zAmount,
  passengers: z.array(
    passengerHoldSchema.extend({
      price: zAmount,
    })
  ),
  contactName: z.string(),
  contactPhone: zPhone,
  contactEmail: zEmail.optional().nullable(),
  ticketCode: z.string().optional().nullable(),
  heldUntil: zISOString.optional().nullable(),
  paymentOrderCode: z.number().optional().nullable(),
  createdAt: zISOString,
});

export type BookingResponse = z.infer<typeof bookingResponseSchema>;

/**
 * 📊 DTO CHI TIẾT - POPULATED BOOKING (Dùng cho trang kết quả tra cứu/vé của tôi)
 */
export const populatedBookingResponseSchema = bookingResponseSchema.extend({
  trip: tripDetailResponseSchema
    .pick({
      departureTime: true,
      expectedArrivalTime: true,
      price: true,
      route: true,
      vehicle: true,
    })
    .extend({
      companyName: z.string(),
      companyLogo: z.string().optional().nullable(),
    }),
  isReviewed: z.boolean().default(false),
});

export type PopulatedBookingResponse = z.infer<
  typeof populatedBookingResponseSchema
>;
