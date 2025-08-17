import api from "../../../services/api";
import type {
  Company,
  CompanyWithStats,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "../types/company";

export const getCompaniesWithStats = async (): Promise<CompanyWithStats[]> => {
  const response = await api.get<CompanyWithStats[]>("/companies");
  return response.data;
};

export const createCompany = async (
  companyData: CreateCompanyPayload
): Promise<CompanyWithStats> => {
  const response = await api.post<CompanyWithStats>("/companies", companyData);
  return response.data;
};

export const updateCompany = async (
  companyId: string,
  companyData: UpdateCompanyPayload
): Promise<CompanyWithStats> => {
  const response = await api.patch<CompanyWithStats>(
    `/companies/${companyId}`,
    companyData
  );
  return response.data;
};

export const getCompanyDetails = async (
  companyId: string
): Promise<Company> => {
  const response = await api.get<Company>(`/companies/${companyId}`);
  return response.data;
};
