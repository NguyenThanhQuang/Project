import api from "../../../services/api";
import type { FinanceReport, ReportPeriod } from "../types/finance";

export const getFinancialReport = async (
  period: ReportPeriod
): Promise<FinanceReport> => {
  const response = await api.get<FinanceReport>("/dashboard/finance-report", {
    params: { period },
  });
  return response.data;
};
