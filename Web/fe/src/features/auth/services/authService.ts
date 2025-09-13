import api from "../../../services/api";
import type { User } from "../../../types";
import type {
  ActivateAccountPayload,
  ValidateActivationTokenResponse,
} from "../types/auth";

export const validateActivationToken = async (
  token: string
): Promise<ValidateActivationTokenResponse> => {
  const response = await api.get<ValidateActivationTokenResponse>(
    "/auth/validate-activation-token",
    {
      params: { token },
    }
  );
  return response.data;
};

export const activateAccount = async (
  payload: ActivateAccountPayload
): Promise<{ accessToken: string; user: User }> => {
  const response = await api.post<{ accessToken: string; user: User }>(
    "/auth/activate-account",
    payload
  );
  return response.data;
};
