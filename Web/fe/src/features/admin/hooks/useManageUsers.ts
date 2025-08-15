import { useCallback, useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import {
  getManagedUsers,
  updateUserStatus,
} from "../services/userAdminService";
import type { ManagedUser, UserStatus } from "../types/user";

// NOTE: Cần tạo các service functions cho ban/unban user sau
// import { banUser, unbanUser } from "../services/userAdminService";

export const useManageUsers = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<UserStatus | "all">("all");

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

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (activeTab !== "all") {
      filtered = filtered.filter((user) => user.status === activeTab);
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

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      inactive: users.filter((u) => u.status === "inactive").length,
      banned: users.filter((u) => u.status === "banned").length,
    }),
    [users]
  );

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
    user: ManagedUser
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  const handleMenuClose = () => setAnchorEl(null);

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
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === selectedUser._id
            ? { ...u, status: isBanned ? "banned" : "active" }
            : u
        )
      );
    } catch (err) {
      setError(getErrorMessage(err, "Cập nhật trạng thái thất bại."));
    } finally {
      setActionDialogOpen(false);
    }
  };

  return {
    users,
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
