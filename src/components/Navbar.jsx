import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleCartDrawer } from '../stores/common/commonSlice';
import { selectCartSummary } from '../features/cart/cartSlice';
import { ROUTES } from '../routes/routePaths';

function Navbar() {
  const dispatch = useDispatch();
  const { totalItems } = useSelector(selectCartSummary);

  return (
    <header className="navbar">
      <Link className="navbar__brand" to={ROUTES.HOME}>
        ShopEasy
      </Link>
      <div className="navbar__search" aria-hidden="true">
        Search placeholder
      </div>
      <nav className="navbar__actions" aria-label="Primary">
        <span className="navbar__action" aria-hidden="true">
          Wishlist
        </span>
        <button
          type="button"
          className="navbar__action navbar__action--button"
          onClick={() => dispatch(toggleCartDrawer())}
        >
          Cart
          {totalItems > 0 ? <span className="navbar__badge">{totalItems}</span> : null}
        </button>
        <span className="navbar__action" aria-hidden="true">
          Login
        </span>
      </nav>
    </header>
  );
}

export default Navbar;
