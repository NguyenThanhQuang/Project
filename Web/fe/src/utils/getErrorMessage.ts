type ErrorLike = {
  response?: {
    data?: {
      message?: unknown;
    };
  };
  message?: unknown;
};

/**
 * Trích xuất một chuỗi thông báo lỗi có thể đọc được từ một lỗi không xác định.
 * Ưu tiên message từ response.data.message của Axios.
 * @param error Lỗi không xác định (unknown).
 * @param fallback Tin nhắn mặc định nếu không tìm thấy lỗi cụ thể.
 * @returns Một chuỗi thông báo lỗi.
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object") {
    const e = error as ErrorLike;
    const messageFromServer = e.response?.data?.message;

    if (Array.isArray(messageFromServer)) {
      return messageFromServer.join(", ");
    }
    if (typeof messageFromServer === "string") {
      return messageFromServer;
    }
    if (typeof e.message === "string") {
      return e.message;
    }
  }
  return fallback;
};
