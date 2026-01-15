/**
 * Tạo URL callback cho Frontend (Verify Email, Payment return...)
 */
export const constructVerificationRedirectUrl = (
  baseUrl: string,
  path: string,
  success: boolean,
  messageKey: string,
  accessToken?: string
): string => {
  // Đảm bảo baseUrl không có dấu / ở cuối và path bắt đầu bằng /
  const cleanBase = baseUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const url = new URL(`${cleanBase}${cleanPath}`);
  url.searchParams.set("success", String(success));
  url.searchParams.set("message", messageKey);

  if (success && accessToken) {
    url.searchParams.set("accessToken", accessToken);
  }

  return url.toString();
};
