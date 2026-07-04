import { baseApi } from '../../stores/baseApi';

const normalizeCategory = (category) => {
  if (typeof category === 'string') {
    return {
      slug: category,
      name: category,
    };
  }

  return {
    slug: category.slug || category.name || '',
    name: category.name || category.slug || '',
  };
};

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/products/categories',
      transformResponse: (response) => response.map(normalizeCategory),
      providesTags: ['Products'],
    }),
    getFeaturedProducts: builder.query({
      query: (limit = 8) => ({
        url: '/products',
        params: {
          limit,
          skip: 0,
        },
      }),
      transformResponse: (response) => response.products || [],
      providesTags: ['Products'],
    }),
    getProducts: builder.query({
      query: (category) => {
        if (category) {
          return {
            url: `/products/category/${category}`,
            params: {
              limit: 100,
              skip: 0,
            },
          };
        }

        return {
          url: '/products',
          params: {
            limit: 100,
            skip: 0,
          },
        };
      },
      transformResponse: (response) => response.products || [],
      providesTags: ['Products'],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ['Products'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetFeaturedProductsQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
} = productsApi;
