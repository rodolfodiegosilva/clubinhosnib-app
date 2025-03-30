import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import apiAxios from '../../../config/axiosConfig';

export enum RoleUser {
  ADMIN = "admin",
  USER = "user",
}

interface User {
  id: string;
  email: string;
  name: string;
  role: RoleUser;
}

export interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  loadingUser: boolean;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: null,
  loadingUser: false,
};

// AsyncThunk para GET /me
export const fetchCurrentUser = createAsyncThunk<User>(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.accessToken;

    if (!token) {
      return rejectWithValue('No access token found');
    }

    try {
      const response = await apiAxios.get<User>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao buscar usuário');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      console.log('[Redux][Auth] Tokens armazenados no Redux e localStorage');
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      console.log('[Redux][Auth] Tokens removidos');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loadingUser = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loadingUser = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loadingUser = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
