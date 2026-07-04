import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage: storage.default || storage,
  whitelist: ['auth', 'cart', 'wishlist'],
};

export default persistConfig;