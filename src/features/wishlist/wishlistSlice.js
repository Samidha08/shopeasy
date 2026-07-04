import { createSlice } from '@reduxjs/toolkit';
import { resetApp } from '../../stores/common/commonActions';

const initialState = {
  items: [],
};

const findWishlistItemIndex = (items = [], productId) =>
  items.findIndex((item) => item.id === productId);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      if (!state.items) {
        state.items = [];
      }

      const existingItemIndex = findWishlistItemIndex(
        state.items,
        action.payload.id
      );

      if (existingItemIndex >= 0) {
        return;
      }

      state.items.push(action.payload);
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetApp, () => initialState);
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist?.items ?? [];

export const selectWishlistCount = (state) => selectWishlistItems(state).length;

export const selectIsProductWishlisted = (productId) => (state) =>
  selectWishlistItems(state).some((item) => String(item.id) === String(productId));

export default wishlistSlice.reducer;
