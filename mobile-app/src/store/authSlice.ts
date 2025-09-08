import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/common/apiService';

export interface User {
  _id: string;
  email: string;
  name: string;
  phone: string;
  roles: string[];
  isEmailVerified: boolean;
  accountStatus?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  successMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  status: 'idle',
  successMessage: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { identifier: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('Attempting login with:', credentials);
      const response = await apiService.post('/auth/login', credentials);
      console.log('Login response:', response.data);
          const { user, accessToken } = response.data as { user: User; accessToken: string };
      
      // Store token and user data
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      return { user, token: accessToken };
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; name: string; phone: string }, { rejectWithValue }) => {
    try {
      console.log('Attempting registration with:', userData);
      const response = await apiService.post('/auth/register', userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.status, error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: { currentPassword: string; newPassword: string; confirmNewPassword: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error: any) {
      console.error('Change password error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Thay đổi mật khẩu thất bại');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      console.error('Forgot password error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Gửi email khôi phục mật khẩu thất bại');
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        // This is normal for first-time users, don't log as error
        console.log('ℹ️ No saved authentication token found - user needs to login');
        return rejectWithValue('No token found');
      }

      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        console.log('ℹ️ No saved user data found - clearing token');
        await AsyncStorage.removeItem('accessToken');
        return rejectWithValue('No user data found');
      }

      const user = JSON.parse(userData);
      
      // Verify token with backend (only if we have connectivity)
      try {
        const response = await apiService.get('/auth/me');
        const verifiedUser = response.data as User;
        console.log('✅ User authentication verified');
        return { token, user: verifiedUser };
      } catch (apiError: any) {
        // If API is unreachable, use cached user data
        if (apiError.message === 'Network Error') {
          console.log('⚠️ API unreachable, using cached user data');
          return { token, user };
        }
        throw apiError; // Re-throw other API errors
      }
      
    } catch (error: any) {
      console.error('❌ Load user error:', error.message);
      // Clear invalid data
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
      return rejectWithValue('Failed to load user');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuthStatus: (state) => {
      state.status = 'idle';
      state.successMessage = null;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.status = 'idle';
      state.successMessage = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      // Only update if user data actually changed
      if (JSON.stringify(state.user) !== JSON.stringify(action.payload)) {
        state.user = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.status = 'failed';
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Registration failed';
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.successMessage = 'Mật khẩu đã được thay đổi thành công!';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.successMessage = null;
      });

    // Load user
    builder
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        state.status = 'idle';
        state.successMessage = null;
      });
  },
});

export const { clearError, setUser, clearAuthStatus, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
