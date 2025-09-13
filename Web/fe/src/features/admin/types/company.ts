export type CompanyStatus = "active" | "pending" | "suspended";

export interface Company {
  _id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  logoUrl?: string;
  status: CompanyStatus;
}

export interface CompanyWithStats {
  _id: string;
  name: string;
  logoUrl?: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  status: CompanyStatus;
  code: string;
  totalTrips: number;
  totalRevenue: number;
  averageRating: number | null;
}

export interface CreateCompanyPayload {
  name: string;
  code: string;
  email: string;
  phone: string;
  address?: string;
  status: CompanyStatus;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
}

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>;
