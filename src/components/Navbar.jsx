import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutAndClear } from '../stores/common/commonActions';
import { toggleCartDrawer } from '../stores/common/commonSlice';
import { selectCartSummary } from '../features/cart/cartSlice';
import { selectAuthUser, selectIsAuthenticated } from '../features/auth';
import { selectWishlistCount } from '../features/wishlist';
import { ROUTES } from '../routes/routePaths';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalItems } = useSelector(selectCartSummary);
  const wishlistCount = useSelector(selectWishlistCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);

  const handleLogout = () => {
    dispatch(logoutAndClear());
    toast.success('Logged out successfully.');
    navigate(ROUTES.HOME);
  };

  return (
    <header className="navbar">
      <Link className="navbar__brand" to={ROUTES.HOME}>
        ShopEasy
      </Link>
      <div className="navbar__search" aria-hidden="true">
        Search placeholder
      </div>
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
