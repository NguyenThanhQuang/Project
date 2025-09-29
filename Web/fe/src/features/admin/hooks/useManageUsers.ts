import { useCallback, useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import {
  getManagedUsers,
  updateUserStatus,
} from "../services/userAdminService";
import type { ManagedUser } from "../types/user";

type UserFilterTab = "all" | "customer" | "company_admin" | "banned";

export const useManageUsers = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<UserFilterTab>("all");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"ban" | "unban" | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getManagedUsers();
      setUsers(data);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải danh sách người dùng."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(
    () => ({
      total: users.length,
      customers: users.filter(
        (u) => u.roles.length === 1 && u.roles[0] === "user"
      ).length,
      companyAdmins: users.filter((u) => u.roles.includes("company_admin"))
        .length,
      banned: users.filter((u) => u.status === "banned").length,
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    let filtered = users;

    switch (activeTab) {
      case "customer":
        filtered = filtered.filter(
          (user) =>
            user.roles && user.roles.length === 1 && user.roles[0] === "user"
        );
        break;
      case "company_admin":
        filtered = filtered.filter(
          (user) => user.roles && user.roles.includes("company_admin")
        );
        break;
      case "banned":
        filtered = filtered.filter((user) => user.status === "banned");
        break;
      case "all":
      default:
        break;
    }

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(lowercasedFilter) ||
          user.email.toLowerCase().includes(lowercasedFilter) ||
          user.phone.includes(lowercasedFilter)
      );
    }
    return filtered;
  }, [users, activeTab, searchTerm]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    user: ManagedUser
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (type: "ban" | "unban") => {
    setActionType(type);
    setActionDialogOpen(true);
    handleMenuClose();
  };

  const confirmAction = async () => {
    if (!selectedUser || !actionType) return;

    const isBanned = actionType === "ban";
    try {
      await updateUserStatus(selectedUser._id, { isBanned });
      fetchData();
    } catch (err) {
      setError(getErrorMessage(err, "Cập nhật trạng thái thất bại."));
    } finally {
      setActionDialogOpen(false);
    }
  };

  return {
    loading,
    error,
    stats,
    filteredUsers,
    page,
    rowsPerPage,
    searchTerm,
    activeTab,
    anchorEl,
    selectedUser,
    actionDialogOpen,
    actionType,
    setSearchTerm,
    setActiveTab,
    handleChangePage,
    handleChangeRowsPerPage,
    handleMenuOpen,
    handleMenuClose,
    handleAction,
    confirmAction,
    setActionDialogOpen,
  };
};
