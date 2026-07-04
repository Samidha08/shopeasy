import { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import {
  ProductDetailPage,
  ProductListPage,
} from '../features/products';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from './routePaths';

const MainLayout = lazy(() =>
  import('../layouts/MainLayout').then((module) => ({
    default: module.default || FallbackMainLayout,
  }))
);

function FallbackMainLayout() {
  return <Outlet />;
}

function RoutePlaceholder({ title }) {
  return <div>{title}</div>;
}

function CartPage() {
  return <RoutePlaceholder title="Cart Page" />;
}

function WishlistPage() {
  return <RoutePlaceholder title="Wishlist Page" />;
}

function CheckoutPage() {
  return <RoutePlaceholder title="Checkout Page" />;
}

function OrderConfirmationPage() {
  return <RoutePlaceholder title="Order Confirmation Page" />;
}

function OrderHistoryPage() {
  return <RoutePlaceholder title="Order History Page" />;
}

function LoginPage() {
  return <RoutePlaceholder title="Login Page" />;
}

function RegisterPage() {
  return <RoutePlaceholder title="Register Page" />;
}

function NotFoundPage() {
  return <RoutePlaceholder title="404 - Page Not Found" />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RoutePlaceholder title="Loading..." />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<ProductListPage />} />
            <Route path={ROUTES.PRODUCTS} element={<ProductListPage />} />
            <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
            <Route path={ROUTES.CART} element={<CartPage />} />
            <Route path={ROUTES.WISHLIST} element={<WishlistPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
              <Route path={ROUTES.ORDER_HISTORY} element={<OrderHistoryPage />} />
              <Route
                path={ROUTES.ORDER_CONFIRMATION}
                element={<OrderConfirmationPage />}
              />
            </Route>

            <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
