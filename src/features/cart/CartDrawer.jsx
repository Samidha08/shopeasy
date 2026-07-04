import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from './CartItem';
import { CartSummaryPanel } from './CartPage';
import { selectCartItems } from './cartSlice';
import { closeCartDrawer } from '../../stores/common/commonSlice';
import { ROUTES } from '../../routes/routePaths';

function CartDrawer() {
  const dispatch = useDispatch();
  const location = useLocation();
  const items = useSelector(selectCartItems);
  const isCartDrawerOpen = useSelector((state) => state.common.isCartDrawerOpen);

  useEffect(() => {
    dispatch(closeCartDrawer());
  }, [dispatch, location.pathname, location.search]);

  if (!isCartDrawerOpen) {
    return null;
  }

  return (
    <div className="cart-drawer" aria-modal="true" role="dialog" aria-label="Shopping cart">
      <button
        type="button"
        className="cart-drawer__backdrop"
        aria-label="Close cart drawer"
        onClick={() => dispatch(closeCartDrawer())}
      />

      <aside className="cart-drawer__panel">
        <div className="cart-drawer__header">
          <div>
            <span className="landing-section__eyebrow">Cart</span>
            <h2 className="cart-drawer__title">Quick cart view</h2>
          </div>

          <button
            type="button"
            className="cart-drawer__close"
            aria-label="Close cart drawer"
            onClick={() => dispatch(closeCartDrawer())}
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty-state cart-drawer__empty">
            <h3 className="empty-state__title">Your cart is empty</h3>
            <p className="empty-state__description">
              Add products to your cart to see them here.
            </p>
            <Link className="primary-button" to={ROUTES.PRODUCTS} onClick={() => dispatch(closeCartDrawer())}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <CartItem key={item.id} item={item} compact />
              ))}
            </div>

            <div className="cart-drawer__footer">
              <CartSummaryPanel />
              <Link className="secondary-button cart-summary__button" to={ROUTES.CART} onClick={() => dispatch(closeCartDrawer())}>
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
