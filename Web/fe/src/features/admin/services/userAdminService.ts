import api from "../../../services/api";
import type { ManagedUser, UserStatusUpdatePayload } from "../types/user";

export const getManagedUsers = async (): Promise<ManagedUser[]> => {
  const response = await api.get<ManagedUser[]>("/users/admin/all");
  return response.data;
};

export const updateUserStatus = async (
  userId: string,
  payload: UserStatusUpdatePayload
): Promise<ManagedUser> => {
  const response = await api.patch<ManagedUser>(
    `/users/admin/${userId}/status`,
    payload
  );
  return response.data;
};
