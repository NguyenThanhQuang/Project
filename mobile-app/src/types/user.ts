export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  roles?: string[];
  role?: 'user' | 'admin' | 'company';
  isEmailVerified?: boolean;
  accountStatus?: 'active' | 'temporary_ban' | 'permanent_ban';
  bannedUntil?: string | null;
  banReason?: string | null;
  createdAt: string;
  updatedAt: string;
}


