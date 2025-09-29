import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { getCompaniesWithStats } from "../services/companyAdminService";
import { getFinancialReport } from "../services/financeAdminService";
import type { CompanyWithStats } from "../types/company";
import type { FinanceReport, ReportPeriod } from "../types/finance";

export const useFinanceReport = () => {
  const [reportData, setReportData] = useState<FinanceReport | null>(null);
  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [period, setPeriod] = useState<ReportPeriod>("30d");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const [allCompanies, setAllCompanies] = useState<CompanyWithStats[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompaniesWithStats();
        setAllCompanies(data);
      } catch (err) {
        console.error("Không thể tải danh sách nhà xe cho bộ lọc:", err);
      }
    };
    fetchCompanies();
  }, []);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFinancialReport(period, selectedCompany);
      setReportData(data);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải báo cáo tài chính."));
    } finally {
      setLoading(false);
    }
  }, [period, selectedCompany]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesData = await getCompaniesWithStats();
        setCompanies(companiesData);
      } catch (err) {
        console.error("Failed to fetch companies for filter:", err);
        setError("Không thể tải danh sách nhà xe để lọc.");
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return {
    reportData,
    loading,
    error,
    companies,
    period,
    setPeriod,
    selectedCompany,
    setSelectedCompany,
    refetch: fetchReport,
    allCompanies,
  };
};
