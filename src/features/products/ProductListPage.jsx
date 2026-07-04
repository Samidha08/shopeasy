import { Link, useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useGetCategoriesQuery, useGetFeaturedProductsQuery } from './productsApi';
import { ROUTES } from '../../routes/routePaths';

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

function ProductListPage() {
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

export default ProductListPage;
