import {
    ActivateAccountPayload, // Sử dụng cái này nếu backend trả về User sau register
    ForgotPasswordPayload,
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    ResendVerificationPayload,
    ResetPasswordPayload
} from "@obtp/validation";
import { HttpClient } from "../core/http-client";

export class AuthApi {
  constructor(private client: HttpClient) {}

  // Đăng ký
  async register(data: RegisterPayload): Promise<{ message: string }> {
    return this.client.post("/v1/auth/register", data);
  }

  // Đăng nhập
  async login(data: LoginPayload): Promise<LoginResponse> {
    return this.client.post("/v1/auth/login", data);
  }

  // Gửi lại email xác thực
  async resendVerification(data: ResendVerificationPayload): Promise<{ message: string }> {
    return this.client.post("/v1/auth/resend-verification-email", data);
  }

  // Quên mật khẩu
  async forgotPassword(data: ForgotPasswordPayload): Promise<{ message: string }> {
    return this.client.post("/v1/auth/forgot-password", data);
  }

  // Đặt lại mật khẩu (Token nằm trong body)
  async resetPassword(data: ResetPasswordPayload): Promise<{ message: string }> {
    return this.client.post("/v1/auth/reset-password", data);
  }

  // Kích hoạt tài khoản công ty (cho Company Admin lần đầu)
  async activateAccount(data: ActivateAccountPayload): Promise<LoginResponse> {
    return this.client.post("/v1/auth/activate-account", data);
  }
  
  // Validate Token (Reset password) - Dùng GET vì chỉ kiểm tra query param
  async validateResetToken(token: string): Promise<{ isValid: boolean, message?: string }> {
    return this.client.get(`/v1/auth/validate-reset-token?token=${token}`);
  }
}