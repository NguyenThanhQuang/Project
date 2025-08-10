export type CompanyStatus = "active" | "pending" | "suspended";

export interface CompanyWithStats {
  _id: string;
  name: string;
  logoUrl?: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  status: CompanyStatus;
  totalTrips: number;
  totalRevenue: number;
  averageRating: number | null;
  code: string;
}

export interface CreateCompanyPayload {
  name: string;
  code: string;
  email: string;
  phone: string;
  address?: string;
  status: CompanyStatus;
}

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>;
