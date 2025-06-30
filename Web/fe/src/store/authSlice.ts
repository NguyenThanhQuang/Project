import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  companyId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("accessToken") || null,
  status: "idle",
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    userData: Omit<User, "_id" | "role" | "companyId"> & { password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Đăng ký không thành công."
        );
      }
      return rejectWithValue("Đã có lỗi không xác định xảy ra.");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { identifier: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/login", credentials);
      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Đăng nhập không thành công."
        );
      }
      return rejectWithValue("Đã có lỗi không xác định xảy ra.");
    }
  }
);

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/me");
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Phiên đăng nhập đã hết hạn hoặc không hợp lệ.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("accessToken");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ accessToken: string; user: User }>) => {
          state.status = "succeeded";
          state.token = action.payload.accessToken;
          state.user = action.payload.user;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(loadUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        state.token = null;
        localStorage.removeItem("accessToken");
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
