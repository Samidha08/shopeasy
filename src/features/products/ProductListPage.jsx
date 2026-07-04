import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useGetProductsQuery } from './productsApi';

function formatCategoryName(categoryName) {
  return categoryName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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

function EmptyState() {
  return (
    <div className="empty-state" role="status">
      <h2 className="empty-state__title">No products available</h2>
      <p className="empty-state__description">
        We couldn&apos;t find products to show right now. Please check back soon.
      </p>
    </div>
  );
}

function ProductListPage() {
  const location = useLocation();
  const activeCategory = new URLSearchParams(location.search).get('category');
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery(activeCategory || undefined);

  return (
    <section className="products-page">
      <div className="products-page__header">
        <div className="products-page__intro">
          <span className="landing-section__eyebrow">Products</span>
          <h1 className="products-page__title">Explore our full collection</h1>
          <p className="products-page__description">
            Browse products from across the ShopEasy catalog, all in one place.
          </p>
        </div>
        {activeCategory ? (
          <p className="products-page__category-pill">
            Category: {formatCategoryName(activeCategory)}
          </p>
        ) : null}
      </div>

      {isLoading ? (
        <LoadingCards count={12} className="product-grid product-grid--listing" />
      ) : null}

      {isError ? (
        <ErrorState
          message="We couldn't load products right now."
          onRetry={refetch}
        />
      ) : null}

      {!isLoading && !isError && products.length === 0 ? <EmptyState /> : null}

      {!isLoading && !isError && products.length > 0 ? (
        <div className="product-grid product-grid--listing">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default ProductListPage;
