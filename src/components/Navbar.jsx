import { useEffect, useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState(
    () => new URLSearchParams(location.search).get('search') || ''
  );
  const [isScrolled, setIsScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 8
  );
  const debouncedSearch = useDebounce(searchTerm, 500);

  const handleLogout = () => {
    dispatch(logoutAndClear());
    toast.success('Logged out successfully.');
    navigate(ROUTES.HOME);
  };

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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

        <div className="navbar__search-wrap">
          <input
            className="navbar__search"
            type="search"
            aria-label="Search products"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <span className="navbar__search-icon" aria-hidden="true" />
        </div>

        <nav className="navbar__links" aria-label="Store">
          <Link className="navbar__link" to={ROUTES.PRODUCTS}>
            Categories
          </Link>
          <Link className="navbar__link" to={`${ROUTES.PRODUCTS}?sort=discount`}>
            Deals
          </Link>
          <Link className="navbar__link" to={`${ROUTES.PRODUCTS}?sort=new`}>
            New Arrivals
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
