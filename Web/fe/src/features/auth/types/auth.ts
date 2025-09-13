export interface ValidateActivationTokenResponse {
  isValid: boolean;
  userName: string;
  companyName: string;
}

export interface ActivateAccountPayload {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}
