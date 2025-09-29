export type UserStatus = "active" | "inactive" | "banned";

export interface ManagedUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  roles: Array<"user" | "company_admin" | "admin">;
  createdAt: string;
  lastLoginDate?: string;
  status: UserStatus;
  totalBookings: number;
  totalSpent: number;
}

export interface UserStatusUpdatePayload {
  isBanned: boolean;
}
