import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import env from '../config/env';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: env.apiBaseUrl }),
  tagTypes: ['Products', 'Cart', 'User', 'Auth'],
  endpoints: () => ({}),
});
