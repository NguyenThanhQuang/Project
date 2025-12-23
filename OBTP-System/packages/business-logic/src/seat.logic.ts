import { SeatMap, SeatMapLayout } from "@obtp/shared-types";

/**
 * Interface cấu hình đầu vào để tạo sơ đồ
 */
export interface SeatMapConfig {
  rows: number;
  columns: number;
  aisles: number[];
  seatPrefix: string;
}

/**
 * Tạo sơ đồ ghế thô dựa trên cấu hình vật lý của xe
 * Luật "Họa sĩ": Chỉ tạo dữ liệu, việc vẽ lên màn hình (CSS/3D) là việc của web/mobile.
 */
export function generateSeatMapLayout(config: SeatMapConfig): {
  seatCount: number;
  seatMap: SeatMap;
} {
  const { rows, columns, aisles, seatPrefix } = config;

  if (rows <= 0 || columns <= 0) {
    throw new Error("SỐ_HÀNG_VÀ_SỐ_CỘT_PHẢI_LỚN_HƠN_0");
  }

  let seatCount = 0;
  const layout: SeatMapLayout = [];

  for (let r = 1; r <= rows; r++) {
    const newRow: (string | null)[] = [];
    for (let c = 1; c <= columns; c++) {
      if (aisles.includes(c)) {
        // Đây là lối đi (aisle)
        newRow.push(null);
      } else {
        // Đây là ghế thực tế
        seatCount++;
        const seatNumber = `${seatPrefix}${seatCount.toString().padStart(2, "0")}`;
        newRow.push(seatNumber);
      }
    }
    layout.push(newRow);
  }

  return {
    seatCount,
    seatMap: {
      rows,
      cols: columns,
      layout: layout,
    },
  };
}
