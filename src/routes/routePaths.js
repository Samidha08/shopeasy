export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  WISHLIST: '/wishlist',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order-confirmation/:id',
  ORDER_HISTORY: '/orders',
  LOGIN: '/login',
  REGISTER: '/register',
  NOT_FOUND: '*',
};

export const productDetail = (id) => `/products/${id}`;

export const orderConfirmation = (orderId) => `/order-confirmation/${orderId}`;
