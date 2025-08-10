import api from "../../../services/api";
import type { AdminStats } from "../types/dashboard";

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await api.get<AdminStats>("/dashboard/stats");
  return response.data;
};
