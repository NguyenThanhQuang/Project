export interface Company {
  _id: string;
  name: string;
  contactPerson?: string;
  phone: string;
  email: string;
  address?: string;
  businessLicense?: string;
  taxId?: string;
  website?: string;
  description?: string;
  operatingRoutes?: string[];
  vehicleCount?: number;
  services?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'rejected';
  rating?: number;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyRegistrationRequest {
  companyName: string;
  businessLicense: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  website?: string;
  description?: string;
  operatingRoutes: string[];
  vehicleCount: number;
  services: string[];
}

export interface CompanyRegistrationResponse {
  company: Company;
  message: string;
}


