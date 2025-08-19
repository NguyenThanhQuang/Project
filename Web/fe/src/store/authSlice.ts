import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import api from "../services/api";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  successMessage: string | null;
}

const token = localStorage.getItem("accessToken");

const initialState: AuthState = {
  user: null,
  token: token,
  status: "idle",
  error: null,
  successMessage: null,
};

interface KnownError {
  message: string | string[];
}
/**
 * Đăng ký người dùng mới.
 * Backend sẽ gửi email xác thực và trả về một message.
 */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    userData: Omit<
      User,
      | "_id"
      | "roles"
      | "companyId"
      | "isEmailVerified"
      | "createdAt"
      | "updatedAt"
    > & {
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<{ message: string }>(
        "/auth/register",
        userData
      );
      return response.data.message;
    } catch (error: unknown) {
      if (axios.isAxiosError<KnownError>(error) && error.response) {
        const message = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(", ")
          : error.response.data.message;
        return rejectWithValue(message);
      }
      return rejectWithValue("Đã có lỗi không xác định xảy ra khi đăng ký.");
    }
  }
);

/**
 * Đăng nhập người dùng.
 * Backend trả về accessToken và thông tin user.
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    loginData: {
      credentials: { identifier: string; password: string };
      source?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {} as Record<string, string>,
      };

      if (loginData.source === "admin-portal") {
        config.headers["X-Request-Source"] = "admin-portal";
      }

      const response = await api.post(
        "/auth/login",
        loginData.credentials,
        config
      );

      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError<KnownError>(error) && error.response) {
        const message = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(", ")
          : error.response.data.message;
        return rejectWithValue(message);
      }
      return rejectWithValue(
        "Email, số điện thoại hoặc mật khẩu không chính xác."
      );
    }
  }
);

/**
 * Lấy thông tin người dùng đang đăng nhập (dựa trên token).
 * Dùng để xác thực lại phiên làm việc khi tải lại trang.
 */
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<User>("/users/me");
      return response.data;
    } catch (error: unknown) {
      localStorage.removeItem("accessToken");
      if (axios.isAxiosError(error)) {
        return rejectWithValue("Phiên đăng nhập đã hết hạn hoặc không hợp lệ.");
      }
      return rejectWithValue(
        "Lỗi không xác định khi tải thông tin người dùng."
      );
    }
  }
);

/**
 * Gửi yêu cầu quên mật khẩu.
 * Backend gửi mail và trả về message.
 */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post<{ message: string }>(
        "/auth/forgot-password",
        { email }
      );
      return response.data.message;
    } catch (error: unknown) {
      if (axios.isAxiosError<KnownError>(error) && error.response) {
        const message = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(", ")
          : error.response.data.message;
        return rejectWithValue(message);
      }
      return rejectWithValue("Yêu cầu đặt lại mật khẩu không thành công.");
    }
  }
);

/**
 * Đặt lại mật khẩu mới bằng token.
 */
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    data: { token: string; newPassword: string; confirmNewPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<{ message: string }>(
        "/auth/reset-password",
        data
      );
      return response.data.message;
    } catch (error: unknown) {
      if (axios.isAxiosError<KnownError>(error) && error.response) {
        const message = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(", ")
          : error.response.data.message;
        return rejectWithValue(message);
      }
      return rejectWithValue(
        "Đặt lại mật khẩu không thành công. Token có thể không hợp lệ hoặc đã hết hạn."
      );
    }
  }
);

/**
 * Thay đổi mật khẩu cho người dùng đã đăng nhập.
 * Yêu cầu mật khẩu hiện tại và mật khẩu mới.
 * CHỨC NĂNG MỚI
 */
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    data: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      //PATCH /api/users/me/change-password
      const response = await api.patch<{ message: string }>(
        "/users/me/change-password",
        data
      );
      return response.data.message;
    } catch (error: unknown) {
      if (axios.isAxiosError<KnownError>(error) && error.response) {
        const message = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(", ")
          : error.response.data.message;
        return rejectWithValue(message);
      }
      return rejectWithValue(
        "Đổi mật khẩu không thành công. Vui lòng kiểm tra lại mật khẩu hiện tại."
      );
    }
  }
);

// --- SLICE ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
      localStorage.removeItem("accessToken");
    },
    clearAuthStatus: (state) => {
      state.error = null;
      state.successMessage = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.successMessage = action.payload;
        }
      )
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ accessToken: string; user: User }>) => {
          state.status = "succeeded";
          state.token = action.payload.accessToken;
          state.user = action.payload.user;
        }
      )
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.status = "failed";
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(
        forgotPassword.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.successMessage = action.payload;
        }
      )
      .addCase(
        resetPassword.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.successMessage = action.payload;
        }
      )
      .addCase(
        changePassword.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.successMessage = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
          state.successMessage = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: PayloadAction<string>) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export const { logout, clearAuthStatus } = authSlice.actions;

export default authSlice.reducer;
