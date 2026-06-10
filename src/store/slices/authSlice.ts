import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthState, AuthUser } from "@/modules/auth/types";

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user: AuthUser }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
    updateAuthUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
});

export const { clearAuth, setCredentials, updateAuthUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
