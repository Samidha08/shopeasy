import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import FilterBar from './FilterBar';
import Pagination from './Pagination';
import SortDropdown from './SortDropdown';
import { useGetCategoriesQuery, useGetProductsQuery } from './productsApi';
import { ROUTES } from '../../routes/routePaths';

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
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const activeCategory = params.get('category') || '';
  const searchTerm = params.get('search') || '';
  const sortValue = params.get('sort') || '';
  const pageValue = Number(params.get('page') || '1');
  const currentPage = Number.isNaN(pageValue) || pageValue < 1 ? 1 : pageValue;
  const [localPage, setLocalPage] = useState(currentPage);
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery(activeCategory || undefined);
  const {
    data: categories = [],
  } = useGetCategoriesQuery();

  useEffect(() => {
    setLocalPage(currentPage);
  }, [currentPage]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const nextProducts = products.filter((product) => {
      const matchesSearch = !normalizedSearch || product.title.toLowerCase().includes(normalizedSearch);
      return matchesSearch;
    });

    switch (sortValue) {
      case 'price-asc':
        return [...nextProducts].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...nextProducts].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...nextProducts].sort((a, b) => b.rating - a.rating);
      case 'name-asc':
        return [...nextProducts].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return nextProducts;
    }
  }, [products, searchTerm, sortValue]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / 12));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * 12;
    return filteredProducts.slice(startIndex, startIndex + 12);
  }, [currentPage, filteredProducts]);

  useEffect(() => {
    if (currentPage > totalPages) {
      const nextParams = new URLSearchParams(location.search);
      nextParams.set('page', String(totalPages));
      navigate(`${ROUTES.PRODUCTS}${nextParams.toString() ? `?${nextParams.toString()}` : ''}`);
    }
  }, [currentPage, totalPages, location.search, navigate]);

  const updateQueryParams = (updates) => {
    const nextParams = new URLSearchParams(location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    if (updates.page === undefined) {
      nextParams.delete('page');
    }

    const nextSearch = nextParams.toString();
    navigate(`${ROUTES.PRODUCTS}${nextSearch ? `?${nextSearch}` : ''}`);
  };

  const handleCategoryChange = (nextCategory) => {
    setLocalPage(1);
    updateQueryParams({ category: nextCategory, page: 1 });
  };

  const handleSortChange = (nextSort) => {
    setLocalPage(1);
    updateQueryParams({ sort: nextSort, page: 1 });
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setLocalPage(nextPage);
    updateQueryParams({ page: nextPage });
  };

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
        <div className="products-page__meta">
          {activeCategory ? (
            <p className="products-page__category-pill">
              Category: {formatCategoryName(activeCategory)}
            </p>
          ) : null}
          {searchTerm ? (
            <p className="products-page__category-pill">
              Search: {searchTerm}
            </p>
          ) : null}
        </div>
      </div>

      <div className="products-toolbar">
        <FilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleCategoryChange}
        />
        <SortDropdown value={sortValue} onChange={handleSortChange} />
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

      {!isLoading && !isError && filteredProducts.length === 0 ? <EmptyState /> : null}

      {!isLoading && !isError && filteredProducts.length > 0 ? (
        <>
          <div className="products-page__results">
            Showing {paginatedProducts.length} of {filteredProducts.length} products
          </div>
          <div className="product-grid product-grid--listing">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            page={localPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : null}
    </section>
  );
}

export default ProductListPage;
