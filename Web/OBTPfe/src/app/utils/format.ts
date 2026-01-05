// Hàm chuyển ngày -> "dd/mm/yyyy"
export const formatDateVN = (dateString: string | Date) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // 'vi-VN' là mã ngôn ngữ Việt Nam, nó tự động format đúng dd/mm/yyyy
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit", // 01, 02...
    month: "2-digit", // 01, 02...
    year: "numeric", // 2025
  });
};

// Hàm chuyển giờ -> "HH:mm" (Ví dụ: 14:30)
export const formatTimeVN = (dateString: string | Date) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Dùng hệ 24h (không hiện AM/PM)
  });
};

// Hàm chuyển số -> Tiền tệ (500.000 ₫)
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
