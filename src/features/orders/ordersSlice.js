import { createSlice } from '@reduxjs/toolkit';
import { resetApp } from '../../stores/common/commonActions';

const initialState = {
  items: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      if (!state.items) {
        state.items = [];
      }

      state.items.unshift(action.payload);
    },
    clearOrders: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetApp, () => initialState);
  },
});

export const { addOrder, clearOrders } = ordersSlice.actions;

export const selectOrders = (state) => state.orders?.items ?? [];

export const selectOrderById = (orderId) => (state) =>
  selectOrders(state).find((order) => String(order.id) === String(orderId));

export default ordersSlice.reducer;
