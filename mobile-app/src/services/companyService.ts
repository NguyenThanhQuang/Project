import apiService from './common/apiService';
import { Company, CompanyRegistrationRequest, CompanyRegistrationResponse } from '../types/company';


// Helper function to handle API errors
const handleApiError = (error: any, defaultMessage: string): Error => {
  console.error('API Error:', error);
  
  // Provide specific error messages based on error type
  if (error.message === 'Network Error') {
    return new Error('Lỗi kết nối mạng - vui lòng kiểm tra internet');
  } else if (error.code === 'ECONNABORTED') {
    return new Error('Yêu cầu quá thời gian chờ - vui lòng thử lại');
  } else if (error.response?.status === 404) {
    return new Error('Không tìm thấy dữ liệu yêu cầu');
  } else if (error.response?.status === 401) {
    return new Error('Phiên đăng nhập hết hạn - vui lòng đăng nhập lại');
  } else if (error.response?.status === 403) {
    return new Error('Không có quyền truy cập');
  } else if (error.response?.status >= 500) {
    return new Error('Lỗi máy chủ - vui lòng thử lại sau');
  }
  
  // Return server error message if available, otherwise use default
  return new Error(error.response?.data?.message || defaultMessage);
};

export const registerCompany = async (data: CompanyRegistrationRequest): Promise<CompanyRegistrationResponse> => {
  try {
    const response = await apiService.post<CompanyRegistrationResponse>('/companies/register', data);
    return response.data as CompanyRegistrationResponse;
  } catch (error: any) {
    console.error('Error registering company:', error);
    throw new Error('Không thể đăng ký nhà xe');
  }
};

export const getCompanies = async (): Promise<{ companies: Company[] }> => {
  try {
    const response = await apiService.get<Company[]>('/companies');
    return { companies: response.data as Company[] };
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    // Return empty array instead of throwing error for better UX
    return { companies: [] };
  }
};

export const getCompanyById = async (id: string): Promise<Company> => {
  try {
    const response = await apiService.get<Company>(`/companies/${id}`);
    return response.data as Company;
  } catch (error: any) {
    console.error('Error fetching company:', error);
    throw new Error('Không thể tải thông tin nhà xe');
  }
};

export const updateCompany = async (id: string, data: Partial<Company>): Promise<Company> => {
  try {
    const response = await apiService.patch<Company>(`/companies/${id}`, data);
    return response.data as Company;
  } catch (error: any) {
    console.error('Error updating company:', error);
    throw new Error('Không thể cập nhật thông tin nhà xe');
  }
};

export const getCompanyStatus = async (id: string): Promise<{ status: string }> => {
  try {
    const response = await apiService.get(`/companies/${id}/status`);
    return response.data as { status: string };
  } catch (error: any) {
    console.error('Error fetching company status:', error);
    throw new Error('Không thể tải trạng thái nhà xe');
  }
};

export const createCompany = async (data: Partial<Company>): Promise<Company> => {
  try {
    const response = await apiService.post<Company>('/companies', data);
    return response.data as Company;
  } catch (error: any) {
    console.error('Error creating company:', error);
    throw new Error('Không thể tạo nhà xe');
  }
};

export const getCompanyVehicles = async (companyId: string): Promise<{ vehicles: any[] }> => {
  try {
    const response = await apiService.get(`/companies/${companyId}/vehicles`);
    return response.data as { vehicles: any[] };
  } catch (error: any) {
    console.error('Error fetching company vehicles:', error);
    throw new Error('Không thể tải danh sách xe của nhà xe');
  }
};
