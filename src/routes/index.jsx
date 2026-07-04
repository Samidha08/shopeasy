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
import { ROUTES, productDetail } from './routePaths';
import { LoginPage, RegisterPage } from '../features/auth';
import { CartPage } from '../features/cart';
import { CheckoutPage } from '../features/checkout';
import { OrderConfirmationPage, OrderHistoryPage } from '../features/orders';
import { WishlistPage } from '../features/wishlist';

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

const benefitHighlights = [
  {
    title: 'Free Delivery',
    description: 'On orders above ₹999',
    icon: 'FD',
  },
  {
    title: 'Secure Payments',
    description: '100% secure checkout',
    icon: 'SP',
  },
  {
    title: 'Easy Returns',
    description: '7-day return policy',
    icon: 'ER',
  },
  {
    title: '24/7 Support',
    description: 'Dedicated support team',
    icon: '24',
  },
];

const testimonials = [
  {
    name: 'Aarohi Mehta',
    avatar: 'AM',
    rating: '5.0',
    review: 'The checkout was quick, the product quality felt premium, and delivery arrived earlier than expected.',
  },
  {
    name: 'Rohan Kapoor',
    avatar: 'RK',
    rating: '4.9',
    review: 'ShopEasy makes browsing simple. I found great deals without jumping through filters all afternoon.',
  },
  {
    name: 'Nisha Iyer',
    avatar: 'NI',
    rating: '5.0',
    review: 'The wishlist and cart flow are smooth. It feels polished and trustworthy for everyday shopping.',
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
  const heroProducts = featuredProducts.slice(0, 4);
  const categoryCards = categories.slice(0, 8);

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-section__content">
          <span className="hero-section__eyebrow">#1 Online Shopping Destination</span>
          <h1 className="hero-section__title">
            Shop Smarter. <span>Live Better.</span>
          </h1>
          <p className="hero-section__subtitle">
            Discover millions of products across electronics, fashion, home,
            beauty and more, curated for modern Indian shoppers.
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

        <div className="hero-section__visual" aria-label="Featured product collage">
          <div className="hero-collage">
            {heroProducts.map((product, index) => (
              <Link
                key={product.id}
                className={`hero-collage__item hero-collage__item--${index + 1}`}
                to={productDetail(product.id)}
              >
                <img src={product.thumbnail} alt={product.title} />
              </Link>
            ))}
          </div>
          <div className="hero-floating-card hero-floating-card--customers">
            <span className="hero-floating-card__avatars" aria-hidden="true">
              <span>AM</span>
              <span>RK</span>
              <span>NI</span>
            </span>
            <strong>20k+</strong>
            <span>Happy Customers</span>
          </div>
          <div className="hero-floating-card hero-floating-card--rating">
            <strong>4.8/5</strong>
            <span>Average Rating</span>
          </div>
        </div>
      </section>

      <section className="benefits-strip" aria-label="Shopping benefits">
        {benefitHighlights.map((benefit) => (
          <article key={benefit.title} className="benefit-card">
            <span className="benefit-card__icon" aria-hidden="true">
              {benefit.icon}
            </span>
            <div>
              <h3 className="benefit-card__title">{benefit.title}</h3>
              <p className="benefit-card__description">{benefit.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="landing-section">
        <SectionHeader
          eyebrow="Shop By Categories"
          title="Explore every kind of find"
          description="Start with a category and jump into products that fit your day."
        />

        {activeCategory ? (
          <p className="landing-page__active-category">
            Browsing category: {formatCategoryName(activeCategory)}
          </p>
        ) : null}

        {isCategoriesLoading ? (
          <LoadingCards count={8} className="category-grid" />
        ) : null}

        {isCategoriesError ? (
          <ErrorState
            message="We couldn't load categories right now."
            onRetry={refetchCategories}
          />
        ) : null}

        {!isCategoriesLoading && !isCategoriesError ? (
          <div className="category-grid">
            {categoryCards.map((category, index) => {
              const categoryImage =
                featuredProducts[index % Math.max(featuredProducts.length, 1)]?.thumbnail;

              return (
              <Link
                key={category.slug}
                className="category-card"
                to={`${ROUTES.PRODUCTS}?category=${encodeURIComponent(category.slug)}`}
              >
                {categoryImage ? (
                  <img
                    className="category-card__image"
                    src={categoryImage}
                    alt=""
                    aria-hidden="true"
                  />
                ) : null}
                <span className="category-card__label">
                  {formatCategoryName(category.name)}
                </span>
                <span className="category-card__action">Shop now</span>
              </Link>
              );
            })}
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

      <section className="promo-banner">
        <div>
          <span className="promo-banner__eyebrow">Limited time offer</span>
          <h2 className="promo-banner__title">Summer Sale - Up to 50% OFF</h2>
          <p className="promo-banner__description">
            Refresh your cart with seasonal deals across top categories.
          </p>
        </div>
        <Link className="primary-button promo-banner__button" to={ROUTES.PRODUCTS}>
          Shop Deals
        </Link>
      </section>

      <section className="landing-section">
        <SectionHeader
          eyebrow="Testimonials"
          title="Loved by everyday shoppers"
          description="A smoother shopping experience, from browsing to delivery."
        />

        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="testimonial-card">
              <div className="testimonial-card__header">
                <span className="testimonial-card__avatar" aria-hidden="true">
                  {testimonial.avatar}
                </span>
                <div>
                  <h3 className="testimonial-card__name">{testimonial.name}</h3>
                  <span className="testimonial-card__rating">
                    {testimonial.rating} rating
                  </span>
                </div>
              </div>
              <p className="testimonial-card__review">{testimonial.review}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter-section">
        <div>
          <span className="landing-section__eyebrow">Newsletter</span>
          <h2 className="newsletter-section__title">Get first access to fresh deals</h2>
          <p className="newsletter-section__description">
            Join the ShopEasy list for new arrivals, limited drops and weekly
            savings.
          </p>
        </div>
        <form
          className="newsletter-section__form"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="email"
            aria-label="Email address"
            placeholder="Enter your email"
          />
          <button type="submit" className="primary-button">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
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
