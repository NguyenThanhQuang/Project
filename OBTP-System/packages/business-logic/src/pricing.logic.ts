/**
 * Tính toán doanh thu thực tế và tiền hoa hồng hệ thống
 */
export interface PricingResult {
  totalAmount: number;
  commission: number;
  netRevenue: number; // Tiền nhà xe thực nhận sau khi trừ hoa hồng
}

/**
 * @param ticketPrice Giá gốc một vé
 * @param seatCount Số lượng ghế đặt
 * @param commissionRate Tỷ lệ hoa hồng (mặc định 0.15 tức 15%)
 */
export function calculateBookingPrice(
  ticketPrice: number,
  seatCount: number,
  commissionRate: number = 0.15
): PricingResult {
  const totalAmount = ticketPrice * seatCount;
  const commission = Math.round(totalAmount * commissionRate);
  const netRevenue = totalAmount - commission;

  return {
    totalAmount,
    commission,
    netRevenue,
  };
}
