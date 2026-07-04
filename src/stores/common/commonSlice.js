import { createSlice } from '@reduxjs/toolkit';
import { resetApp } from './commonActions';

const initialState = {
  isGlobalLoading: false,
  theme: 'light',
  isCartDrawerOpen: false,
  isMobileMenuOpen: false,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      state.isGlobalLoading = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeCartDrawer: (state) => {
      state.isCartDrawerOpen = false;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetApp, () => initialState);
  },
});

export const {
  setGlobalLoading,
  toggleTheme,
  toggleCartDrawer,
  toggleMobileMenu,
  closeCartDrawer,
  closeMobileMenu,
} = commonSlice.actions;

export default commonSlice.reducer;
