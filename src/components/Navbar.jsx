import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutAndClear } from '../stores/common/commonActions';
import { toggleCartDrawer } from '../stores/common/commonSlice';
import { selectCartSummary } from '../features/cart/cartSlice';
import { selectAuthUser, selectIsAuthenticated } from '../features/auth';
import { selectWishlistCount } from '../features/wishlist';
import { ROUTES } from '../routes/routePaths';
import useDebounce from '../hooks/useDebounce';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useSelector(selectCartSummary);
  const wishlistCount = useSelector(selectWishlistCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const handleLogout = () => {
    dispatch(logoutAndClear());
    toast.success('Logged out successfully.');
    navigate(ROUTES.HOME);
  };

  const currentSearch = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  }, [location.search]);

  useEffect(() => {
    if (location.pathname !== ROUTES.PRODUCTS) {
      if (debouncedSearch.trim()) {
        navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(debouncedSearch.trim())}&page=1`);
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
    }
  }, [debouncedSearch, location.pathname, location.search, navigate]);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  return (
    <header className="navbar">
      <Link className="navbar__brand" to={ROUTES.HOME}>
        ShopEasy
      </Link>
      <input
        className="navbar__search"
        type="search"
        aria-label="Search products"
        placeholder="Search products"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <nav className="navbar__actions" aria-label="Primary">
        <Link className="navbar__action" to={ROUTES.WISHLIST}>
          Wishlist
          {wishlistCount > 0 ? (
            <span className="navbar__badge">{wishlistCount}</span>
          ) : null}
        </Link>
        <button
          type="button"
          className="navbar__action navbar__action--button"
          onClick={() => dispatch(toggleCartDrawer())}
        >
          Cart
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
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
