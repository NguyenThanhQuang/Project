import { z } from "zod";
import { zAmount, zISOString, zObjectId } from "./shared.zod";

export const PayOSStatusEnum = z.enum([
  "PAID",
  "PENDING",
  "PROCESSING",
  "CANCELLED",
  "DELETED",
]);

/**
 * 1. YÊU CẦU TẠO LINK THANH TOÁN (CREATE PAYMENT LINK)
 */
export const createPaymentLinkSchema = z.object({
  bookingId: zObjectId,
});

export type CreatePaymentLinkPayload = z.infer<typeof createPaymentLinkSchema>;

/**
 * 2. KẾT QUẢ TRẢ VỀ KHI TẠO LINK (PAYMENT LINK RESPONSE)
 * Frontend nhận cái này để redirect khách sang cổng PayOS
 */
export const paymentLinkResponseSchema = z.object({
  bin: z.string(),
  accountNumber: z.string(),
  accountName: z.string(),
  amount: zAmount,
  description: z.string(),
  orderCode: z.number().int(),
  qrCode: z.string(),
  checkoutUrl: z.url(),
  paymentLinkId: z.string(),
});

export type PaymentLinkResponse = z.infer<typeof paymentLinkResponseSchema>;

/**
 * 3. DỮ LIỆU CHI TIẾT TRONG WEBHOOK (PAYOS WEBHOOK DATA)
 */
const payOSWebhookDataSchema = z.object({
  orderCode: z.number().int(),
  amount: zAmount,
  description: z.string(),
  accountNumber: z.string().optional().nullable(),
  reference: z.string().optional().nullable(),
  transactionDateTime: z.string(), // Định dạng PayOS: "YYYY-MM-DD HH:mm:ss"
  currency: z.string().default("VND"),
  paymentLinkId: z.string(),
  code: z.string(), // "00" là thành công
  desc: z.string(),
  counterAccountBankId: z.string().optional().nullable(),
  counterAccountBankName: z.string().optional().nullable(),
  counterAccountName: z.string().optional().nullable(),
  counterAccountNumber: z.string().optional().nullable(),
  virtualAccountName: z.string().optional().nullable(),
  virtualAccountNumber: z.string().optional().nullable(),
});

/**
 * 4. TOÀN BỘ PAYLOAD WEBHOOK (FULL WEBHOOK SCHEMA)
 * Dùng để validate request body nhận từ PayOS POST sang
 */
export const payOSWebhookSchema = z.object({
  code: z.string(),
  desc: z.string(),
  success: z.boolean(),
  data: payOSWebhookDataSchema,
  signature: z.string().min(1, "Signature is required for security"),
});

export type PayOSWebhookPayload = z.infer<typeof payOSWebhookSchema>;
export type PayOSWebhookData = z.infer<typeof payOSWebhookDataSchema>;

/**
 * 5. TRUY VẤN TRẠNG THÁI (RETURN URL QUERY PARAMS)
 * Khi khách thanh toán xong, PayOS redirect về: ?status=PAID&orderCode=123...
 */
export const paymentStatusQuerySchema = z.object({
  bookingId: zObjectId, // Gắn thêm vào returnUrl lúc create-link để Next.js dễ query
  status: PayOSStatusEnum,
  orderCode: z.coerce.number().int(),
});

export type PaymentStatusQuery = z.infer<typeof paymentStatusQuerySchema>;

/**
 * 🚀 DTO NỘI BỘ - LỊCH SỬ THANH TOÁN (PAYMENT RECORD)
 * Lưu trữ trong DB để đối soát
 */
export const paymentResponseSchema = z.object({
  id: zObjectId,
  bookingId: zObjectId,
  orderCode: z.number().int(),
  amount: zAmount,
  status: PayOSStatusEnum,
  method: z.string().default("PAYOS"),
  transactionId: z.string().optional().nullable(),
  paidAt: zISOString.optional().nullable(),
  createdAt: zISOString,
});

export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
