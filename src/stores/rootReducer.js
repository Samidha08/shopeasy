import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';
import commonReducer from './common/commonSlice';
import cartReducer from '../features/cart/cartSlice';

const createPlaceholderReducer = () => (state = {}) => state;

const rootReducer = combineReducers({
  common: commonReducer,
  api: baseApi.reducer,
  auth: createPlaceholderReducer(),
  cart: cartReducer,
  wishlist: createPlaceholderReducer(),
  orders: createPlaceholderReducer(),
});

export default rootReducer;
