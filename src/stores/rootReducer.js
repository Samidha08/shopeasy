import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';
import commonReducer from './common/commonSlice';

const createPlaceholderReducer = () => (state = {}) => state;

const rootReducer = combineReducers({
  common: commonReducer,
  api: baseApi.reducer,
  auth: createPlaceholderReducer(),
  cart: createPlaceholderReducer(),
  wishlist: createPlaceholderReducer(),
  orders: createPlaceholderReducer(),
});

export default rootReducer;
