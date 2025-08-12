import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCompany,
  getCompaniesWithStats,
  updateCompany,
} from "../services/companyAdminService";
import type {
  CompanyWithStats,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "../types/company";

type ErrorLike = {
  response?: { data?: { message?: unknown } };
  message?: unknown;
};

const getErrorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const e = err as ErrorLike;
    const m = e.response?.data?.message ?? e.message;
    if (typeof m === "string") return m;
  }
  return fallback;
};

export interface UseManageCompaniesResult {
  companies: CompanyWithStats[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  filteredCompanies: CompanyWithStats[];
  stats: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
  };
  page: number;
  rowsPerPage: number;
  searchTerm: string;
  anchorEl: HTMLElement | null;
  selectedCompany: CompanyWithStats | null;
  companyDialogOpen: boolean;
  actionDialogOpen: boolean;
  actionType: "suspend" | "activate" | null;
  companyToEdit: CompanyWithStats | null;

  // Handlers
  setSearchTerm: (term: string) => void;
  clearMessages: () => void;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    company: CompanyWithStats
  ) => void;
  handleMenuClose: () => void;
  handleAction: (type: "suspend" | "activate") => void;
  confirmAction: () => void;
  handleOpenCreateDialog: () => void;
  handleOpenEditDialog: (company: CompanyWithStats) => void;
  handleSaveCompany: (
    companyData: CreateCompanyPayload | UpdateCompanyPayload,
    companyId?: string
  ) => void;
  handleNavigateToVehicles: () => void;
  setCompanyDialogOpen: (open: boolean) => void;
  setActionDialogOpen: (open: boolean) => void;
}

export const useManageCompanies = (): UseManageCompaniesResult => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCompany, setSelectedCompany] =
    useState<CompanyWithStats | null>(null);
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"suspend" | "activate" | null>(
    null
  );
  const [companyToEdit, setCompanyToEdit] = useState<CompanyWithStats | null>(
    null
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCompaniesWithStats();
      setCompanies(data);
    } catch (err) {
      setError("Không thể tải danh sách nhà xe.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.phone.includes(searchTerm)
    );
  }, [companies, searchTerm]);

  const stats = useMemo(
    () => ({
      total: companies.length,
      active: companies.filter((c) => c.status === "active").length,
      pending: companies.filter((c) => c.status === "pending").length,
      suspended: companies.filter((c) => c.status === "suspended").length,
    }),
    [companies]
  );

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleChangePage = (event: unknown, newPage: number) =>
    setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    company: CompanyWithStats
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompany(company);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateToVehicles = () => {
    if (selectedCompany) {
      navigate(`/admin/companies/${selectedCompany._id}/vehicles`);
    }
    handleMenuClose();
  };

  const handleOpenCreateDialog = () => {
    setCompanyToEdit(null);
    setCompanyDialogOpen(true);
  };

  const handleOpenEditDialog = (company: CompanyWithStats) => {
    setCompanyToEdit(company);
    setCompanyDialogOpen(true);
    handleMenuClose();
  };

  const handleAction = (type: "suspend" | "activate") => {
    setActionType(type);
    setActionDialogOpen(true);
    handleMenuClose();
  };

  const confirmAction = async () => {
    if (!selectedCompany || !actionType) return;

    const newStatus = actionType === "suspend" ? "suspended" : "active";
    clearMessages();
    try {
      setLoading(true);
      await updateCompany(selectedCompany._id, { status: newStatus });
      setSuccessMessage(
        `Đã ${actionType === "suspend" ? "tạm ngưng" : "kích hoạt"} nhà xe "${
          selectedCompany.name
        }" thành công.`
      );
      await fetchData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Hành động thất bại."));
    } finally {
      setLoading(false);
      setActionDialogOpen(false);
    }
  };

  const handleSaveCompany = async (
    companyData: CreateCompanyPayload | UpdateCompanyPayload,
    companyId?: string
  ) => {
    clearMessages();
    try {
      setLoading(true);
      if (companyId) {
        await updateCompany(companyId, companyData);
        setSuccessMessage("Cập nhật thông tin nhà xe thành công!");
      } else {
        await createCompany(companyData as CreateCompanyPayload);
        setSuccessMessage("Thêm nhà xe mới thành công!");
      }
      setCompanyDialogOpen(false);
      await fetchData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Có lỗi xảy ra, vui lòng thử lại."));
    } finally {
      setLoading(false);
    }
  };

  return {
    companies,
    loading,
    error,
    successMessage,
    filteredCompanies,
    stats,
    page,
    rowsPerPage,
    searchTerm,
    anchorEl,
    selectedCompany,
    companyDialogOpen,
    actionDialogOpen,
    actionType,
    companyToEdit,
    setSearchTerm,
    clearMessages,
    handleChangePage,
    handleChangeRowsPerPage,
    handleMenuOpen,
    handleMenuClose,
    handleNavigateToVehicles,
    handleAction,
    confirmAction,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleSaveCompany,
    setCompanyDialogOpen,
    setActionDialogOpen,
  };
};
