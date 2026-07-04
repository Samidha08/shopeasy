import { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import {
  ProductCard,
  ProductDetailPage,
  ProductListPage,
  useGetCategoriesQuery,
  useGetFeaturedProductsQuery,
} from '../features/products';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from './routePaths';
import { CartPage } from '../features/cart';

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

const featureHighlights = [
  {
    title: 'Fast Delivery',
    description: 'Get your orders delivered quickly with dependable shipping.',
  },
  {
    title: 'Secure Payments',
    description: 'Checkout confidently with safe and trusted payment handling.',
  },
  {
    title: 'Easy Returns',
    description: 'Enjoy a simple return process designed around convenience.',
  },
  {
    title: 'Quality Products',
    description: 'Browse curated items chosen for value, style, and reliability.',
  },
];

function formatCategoryName(categoryName) {
  return categoryName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="landing-section__header">
      <span className="landing-section__eyebrow">{eyebrow}</span>
      <h2 className="landing-section__title">{title}</h2>
      <p className="landing-section__description">{description}</p>
    </div>
  );
}

function LoadingCards({ count, className }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="loading-card" aria-hidden="true" />
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <p>{message}</p>
      <button type="button" className="primary-button" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}

function HomePage() {
  const location = useLocation();
  const activeCategory = new URLSearchParams(location.search).get('category');
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useGetCategoriesQuery();
  const {
    data: featuredProducts = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useGetFeaturedProductsQuery(8);

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-section__content">
          <span className="hero-section__eyebrow">Shop smarter every day</span>
          <h1 className="hero-section__title">Discover Products You&apos;ll Love</h1>
          <p className="hero-section__subtitle">
            Explore thousands of products across multiple categories at great prices.
          </p>
          <div className="hero-section__actions">
            <Link className="primary-button" to={ROUTES.PRODUCTS}>
              Shop Now
            </Link>
            <Link className="secondary-button" to={ROUTES.PRODUCTS}>
              Browse Categories
            </Link>
          </div>
        </div>
        <div className="hero-section__panel">
          <div className="hero-section__metric">
            <span className="hero-section__metric-label">Categories</span>
            <strong className="hero-section__metric-value">50+</strong>
          </div>
          <div className="hero-section__metric">
            <span className="hero-section__metric-label">Trusted Deals</span>
            <strong className="hero-section__metric-value">Daily Savings</strong>
          </div>
          <div className="hero-section__metric">
            <span className="hero-section__metric-label">Shopping Experience</span>
            <strong className="hero-section__metric-value">Simple and Secure</strong>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <SectionHeader
          eyebrow="Featured Categories"
          title="Popular ways to shop"
          description="Start with a category and jump straight into the products you care about."
        />

        {activeCategory ? (
          <p className="landing-page__active-category">
            Browsing category: {formatCategoryName(activeCategory)}
          </p>
        ) : null}

        {isCategoriesLoading ? (
          <LoadingCards count={6} className="category-grid" />
        ) : null}

        {isCategoriesError ? (
          <ErrorState
            message="We couldn't load categories right now."
            onRetry={refetchCategories}
          />
        ) : null}

        {!isCategoriesLoading && !isCategoriesError ? (
          <div className="category-grid">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.slug}
                className="category-card"
                to={`${ROUTES.PRODUCTS}?category=${encodeURIComponent(category.slug)}`}
              >
                <span className="category-card__label">
                  {formatCategoryName(category.name)}
                </span>
                <span className="category-card__action">Explore category</span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section className="landing-section">
        <SectionHeader
          eyebrow="Featured Products"
          title="Trending products right now"
          description="A curated selection of standout items to help you start shopping fast."
        />

        {isProductsLoading ? (
          <LoadingCards count={8} className="product-grid" />
        ) : null}

        {isProductsError ? (
          <ErrorState
            message="We couldn't load featured products right now."
            onRetry={refetchProducts}
          />
        ) : null}

        {!isProductsLoading && !isProductsError ? (
          <div className="product-grid">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="landing-section">
        <SectionHeader
          eyebrow="Why ShopEasy"
          title="Built for modern online shopping"
          description="Everything about the experience is designed to feel simple, reliable, and fast."
        />

        <div className="feature-grid">
          {featureHighlights.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__description">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
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
            <Route path={ROUTES.HOME} element={<HomePage />} />
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
