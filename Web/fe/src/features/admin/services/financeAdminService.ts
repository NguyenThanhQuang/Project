import api from "../../../services/api";
import type { FinanceReport, ReportPeriod } from "../types/finance";

/**
 * @param period Khoảng thời gian báo cáo (7d, 30d, etc.)
 * @param companyId (Tùy chọn) Lọc báo cáo cho một nhà xe cụ thể.
 * @returns Promise chứa dữ liệu báo cáo tài chính.
 */
export const getFinancialReport = async (
  period: ReportPeriod,
  companyId: string | null
): Promise<FinanceReport> => {
  const params: { period: ReportPeriod; companyId?: string } = {
    period,
  };

  if (companyId) {
    params.companyId = companyId;
  }

  const response = await api.get<FinanceReport>("/dashboard/finance-report", {
    params,
  });
  return response.data;
};
