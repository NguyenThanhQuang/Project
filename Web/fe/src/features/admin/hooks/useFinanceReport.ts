import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { getFinancialReport } from "../services/financeAdminService";
import type { FinanceReport, ReportPeriod } from "../types/finance";

export const useFinanceReport = () => {
  const [reportData, setReportData] = useState<FinanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<ReportPeriod>("30d");

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFinancialReport(period);
      setReportData(data);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải báo cáo tài chính."));
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return {
    reportData,
    loading,
    error,
    period,
    setPeriod,
    refetch: fetchReport,
  };
};
