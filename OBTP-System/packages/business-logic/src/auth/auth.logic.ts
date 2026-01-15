import { User, UserRole } from "@obtp/shared-types";

export const sanitizeUser = (user: Partial<User>): Partial<User> => {
  if (!user) return {};
  const {
    // @ts-ignore - passwordHash không có trong interface User public nhưng có trong DB object
    passwordHash,
    // @ts-ignore
    emailVerificationToken,
    // @ts-ignore
    accountActivationToken,
    ...cleanUser
  } = user;
  return cleanUser;
};

// Logic kiểm tra quyền truy cập Company Admin
export const validateCompanyAdminAccess = (
  userRoles: UserRole[],
  companyId?: string | null,
  companyStatus?: string
): void => {
  if (userRoles.includes(UserRole.COMPANY_ADMIN)) {
    if (!companyId) {
      throw new Error("ERR_COMPANY_NOT_LINKED");
    }
    if (companyStatus !== "active") {
      throw new Error("ERR_COMPANY_SUSPENDED");
    }
  }
};

// Kiểm tra user có được phép login không
export const canUserLogin = (user: User): boolean => {
  if (user.isBanned) return false;
  // Logic mở rộng: ví dụ user chưa verify email có được login không?
  return true;
};
