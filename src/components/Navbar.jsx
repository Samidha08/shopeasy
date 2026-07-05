import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutAndClear } from '../stores/common/commonActions';
import { toggleCartDrawer } from '../stores/common/commonSlice';
import { selectCartSummary } from '../features/cart/cartSlice';
import { selectAuthUser, selectIsAuthenticated } from '../features/auth';
import { selectWishlistCount } from '../features/wishlist';
import { useSearchProductsQuery } from '../features/products';
import { ROUTES, productDetail } from '../routes/routePaths';
import useDebounce from '../hooks/useDebounce';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useSelector(selectCartSummary);
  const wishlistCount = useSelector(selectWishlistCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);
  const searchWrapRef = useRef(null);
  const suppressSearchNavigationRef = useRef(false);
  const [searchTerm, setSearchTerm] = useState(
    () => new URLSearchParams(location.search).get('search') || ''
  );
  const [isScrolled, setIsScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 8
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const trimmedSearch = searchTerm.trim();
  const debouncedSuggestionSearch = debouncedSearch.trim();
  const shouldFetchSuggestions = debouncedSuggestionSearch.length > 0;
  const {
    data: suggestions = [],
    isFetching: isSuggestionsLoading,
  } = useSearchProductsQuery(debouncedSuggestionSearch, {
    skip: !isSearchOpen || !shouldFetchSuggestions,
  });
  const limitedSuggestions = suggestions.slice(0, 6);
  const canShowDropdown = isSearchOpen && trimmedSearch.length > 0;

  const handleLogout = () => {
    dispatch(logoutAndClear());
    toast.success('Logged out successfully.');
    navigate(ROUTES.HOME);
  };

  const closeSearchDropdown = () => {
    setIsSearchOpen(false);
    setHighlightedIndex(-1);
  };

  const scrollProductsToResults = () => {
    window.setTimeout(() => {
      const resultsElement =
        document.querySelector('.products-page__results') ||
        document.querySelector('.products-page');

      resultsElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 160);
  };

  const navigateToSearchResults = () => {
    const nextSearch = trimmedSearch;

    if (!nextSearch) {
      closeSearchDropdown();
      return;
    }

    navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(nextSearch)}&page=1`);
    closeSearchDropdown();
    scrollProductsToResults();
  };

  const navigateToProduct = (productId) => {
    suppressSearchNavigationRef.current = true;
    setSearchTerm('');
    navigate(productDetail(productId));
    closeSearchDropdown();
  };

  useEffect(() => {
    if (suppressSearchNavigationRef.current && location.pathname !== ROUTES.PRODUCTS) {
      suppressSearchNavigationRef.current = false;
      return;
    }

    if (location.pathname !== ROUTES.PRODUCTS) {
      if (debouncedSearch.trim()) {
        if (!isSearchOpen) {
          return;
        }
        navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(debouncedSearch.trim())}&page=1`);
        scrollProductsToResults();
      }
      return;
    }

    const params = new URLSearchParams(location.search);
    const currentValue = params.get('search') || '';

    if (debouncedSearch.trim() !== currentValue) {
      if (debouncedSearch.trim()) {
        params.set('search', debouncedSearch.trim());
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      const nextSearch = params.toString();
      navigate(`${ROUTES.PRODUCTS}${nextSearch ? `?${nextSearch}` : ''}`);
      if (debouncedSearch.trim()) {
        scrollProductsToResults();
      }
    }
  }, [debouncedSearch, isSearchOpen, location.pathname, location.search, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(event.target)
      ) {
        closeSearchDropdown();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const handleSearchChange = (event) => {
    const nextValue = event.target.value;

    setSearchTerm(nextValue);
    setHighlightedIndex(-1);
    setIsSearchOpen(nextValue.trim().length > 0);

    if (!nextValue.trim()) {
      closeSearchDropdown();
    }
  };

  const handleSearchKeyDown = (event) => {
    const viewAllIndex = limitedSuggestions.length;
    const maxIndex = canShowDropdown ? viewAllIndex : -1;

    if (event.key === 'Escape') {
      closeSearchDropdown();
      return;
    }

    if (event.key === 'ArrowDown' && canShowDropdown) {
      event.preventDefault();
      setHighlightedIndex((currentIndex) =>
        currentIndex >= maxIndex ? 0 : currentIndex + 1
      );
      return;
    }

    if (event.key === 'ArrowUp' && canShowDropdown) {
      event.preventDefault();
      setHighlightedIndex((currentIndex) =>
        currentIndex <= 0 ? maxIndex : currentIndex - 1
      );
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      if (
        canShowDropdown &&
        highlightedIndex >= 0 &&
        highlightedIndex < limitedSuggestions.length
      ) {
        navigateToProduct(limitedSuggestions[highlightedIndex].id);
        return;
      }

      navigateToSearchResults();
    }
  };

  return (
    <header className={isScrolled ? 'navbar-shell navbar-shell--scrolled' : 'navbar-shell'}>
      <div className="navbar-strip">
        Free shipping on orders above &#8377;999 <span aria-hidden="true">|</span> 7-day return policy
      </div>

      <div className="navbar">
        <Link className="navbar__brand" to={ROUTES.HOME}>
          <span className="navbar__brand-icon" aria-hidden="true">S</span>
          <span>ShopEasy</span>
        </Link>

        <div className="navbar__search-wrap" ref={searchWrapRef}>
          <input
            className="navbar__search"
            type="search"
            aria-label="Search products"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchOpen(trimmedSearch.length > 0)}
            onKeyDown={handleSearchKeyDown}
            aria-expanded={canShowDropdown}
            aria-controls="navbar-search-suggestions"
            aria-autocomplete="list"
          />
          <span className="navbar__search-icon" aria-hidden="true" />

          {canShowDropdown ? (
            <div
              className="navbar-search-dropdown"
              id="navbar-search-suggestions"
              role="listbox"
            >
              {isSuggestionsLoading ? (
                <div className="navbar-search-dropdown__state">
                  Searching products...
                </div>
              ) : null}

              {!isSuggestionsLoading && limitedSuggestions.length === 0 ? (
                <div className="navbar-search-dropdown__state">
                  No products found
                </div>
              ) : null}

              {!isSuggestionsLoading && limitedSuggestions.length > 0 ? (
                <div className="navbar-search-dropdown__list">
                  {limitedSuggestions.map((product, index) => (
                    <button
                      key={product.id}
                      type="button"
                      className={
                        highlightedIndex === index
                          ? 'navbar-search-suggestion navbar-search-suggestion--active'
                          : 'navbar-search-suggestion'
                      }
                      onMouseDown={(event) => {
                        event.preventDefault();
                        navigateToProduct(product.id);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      role="option"
                      aria-selected={highlightedIndex === index}
                    >
                      <img
                        className="navbar-search-suggestion__image"
                        src={product.thumbnail}
                        alt=""
                        aria-hidden="true"
                      />
                      <span className="navbar-search-suggestion__content">
                        <span className="navbar-search-suggestion__title">
                          {product.title}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}

              <button
                type="button"
                className={
                  highlightedIndex === limitedSuggestions.length
                    ? 'navbar-search-dropdown__view-all navbar-search-dropdown__view-all--active'
                    : 'navbar-search-dropdown__view-all'
                }
                onMouseDown={(event) => {
                  event.preventDefault();
                  navigateToSearchResults();
                }}
                onMouseEnter={() => setHighlightedIndex(limitedSuggestions.length)}
              >
                View all results for &quot;{trimmedSearch}&quot;
              </button>
            </div>
          ) : null}
        </div>

        <nav className="navbar__links" aria-label="Store">
          <Link className="navbar__link" to={ROUTES.PRODUCTS}>
            Categories
          </Link>
          <Link className="navbar__link" to={`${ROUTES.PRODUCTS}?sort=discount`}>
            Deals
          </Link>
          <Link className="navbar__link" to={`${ROUTES.PRODUCTS}?sort=rating`}>
            Best Sellers
          </Link>
        </nav>

        <nav className="navbar__actions" aria-label="Primary">
          <Link className="navbar__action" to={ROUTES.WISHLIST}>
            <span>Wishlist</span>
            {wishlistCount > 0 ? (
              <span className="navbar__badge">{wishlistCount}</span>
            ) : null}
          </Link>
          <button
            type="button"
            className="navbar__action navbar__action--button"
            onClick={() => dispatch(toggleCartDrawer())}
          >
            <span>Cart</span>
            {totalItems > 0 ? <span className="navbar__badge">{totalItems}</span> : null}
          </button>
          {isAuthenticated ? (
            <>
              <Link className="navbar__action" to={ROUTES.ORDER_HISTORY}>
                Orders
              </Link>
              <span className="navbar__user">{user?.firstName || user?.username}</span>
              <button
                type="button"
                className="navbar__action navbar__action--button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link className="navbar__action" to={ROUTES.LOGIN}>
              <span>Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
