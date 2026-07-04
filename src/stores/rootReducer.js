import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';
import commonReducer from './common/commonSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';

const createPlaceholderReducer = () => (state = {}) => state;

const rootReducer = combineReducers({
  common: commonReducer,
  api: baseApi.reducer,
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  orders: createPlaceholderReducer(),
});

export default rootReducer;
