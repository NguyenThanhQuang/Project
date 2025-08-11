export type UserRole = "user" | "company_admin" | "admin";

export interface SanitizedUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  roles: UserRole[];
  isEmailVerified: boolean;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}
