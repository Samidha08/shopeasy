import { createSlice } from '@reduxjs/toolkit';
import { resetApp } from '../../stores/common/commonActions';

const initialState = {
  items: [],
};

const findCartItemIndex = (items = [], productId) =>
  items.findIndex((item) => item.id === productId);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      if (!state.items) {
  state.items = [];
}
      const { quantity = 1, ...product } = action.payload;
      const existingItemIndex = findCartItemIndex(state.items, product.id);

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += quantity;
        return;
      }

      state.items.push({
        ...product,
        quantity,
      });
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItemIndex = findCartItemIndex(state.items, productId);

      if (existingItemIndex === -1) {
        return;
      }

      state.items[existingItemIndex].quantity = Math.max(1, quantity);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetApp, () => initialState);
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

// export const selectCartItems = (state) => state.cart.items;

export const selectCartItems = (state) => state.cart?.items ?? [];

export const selectCartSummary = (state) => {
  const items = selectCartItems(state);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalDiscount = items.reduce(
    (total, item) =>
      total + item.price * (item.discountPercentage / 100) * item.quantity,
    0
  );

  return {
    totalItems,
    subtotal,
    totalDiscount,
    finalTotal: subtotal - totalDiscount,
  };
};

export default cartSlice.reducer;
