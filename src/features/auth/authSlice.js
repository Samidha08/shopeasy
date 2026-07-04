import { createSlice } from '@reduxjs/toolkit';
import { logoutAndClear, resetApp } from '../../stores/common/commonActions';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = Boolean(action.payload.token);
    },
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetApp, () => initialState)
      .addCase(logoutAndClear, () => initialState);
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectAuthUser = (state) => state.auth?.user ?? null;
export const selectAuthToken = (state) => state.auth?.token ?? null;
export const selectIsAuthenticated = (state) =>
  Boolean(state.auth?.isAuthenticated);

export default authSlice.reducer;
