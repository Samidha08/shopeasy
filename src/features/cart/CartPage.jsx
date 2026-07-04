import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CartItem from './CartItem';
import { clearCart, selectCartItems, selectCartSummary } from './cartSlice';
import { ROUTES } from '../../routes/routePaths';

function CartSummary() {
  const summary = useSelector(selectCartSummary);

  return (
    <aside className="cart-summary">
      <h2 className="cart-summary__title">Order Summary</h2>

      <div className="cart-summary__rows">
        <div className="cart-summary__row">
          <span>Total items</span>
          <strong>{summary.totalItems}</strong>
        </div>
        <div className="cart-summary__row">
          <span>Subtotal</span>
          <strong>${summary.subtotal.toFixed(2)}</strong>
        </div>
        <div className="cart-summary__row">
          <span>Total discount</span>
          <strong>-${summary.totalDiscount.toFixed(2)}</strong>
        </div>
        <div className="cart-summary__row cart-summary__row--final">
          <span>Final total</span>
          <strong>${summary.finalTotal.toFixed(2)}</strong>
        </div>
      </div>

      <Link className="primary-button cart-summary__button" to={ROUTES.CHECKOUT}>
        Proceed to Checkout
      </Link>
    </aside>
  );
}

function EmptyCartState() {
  return (
    <section className="empty-state">
      <h1 className="empty-state__title">Your cart is empty</h1>
      <p className="empty-state__description">
        Looks like you haven&apos;t added anything yet. Start exploring products and
        build your perfect cart.
      </p>
      <Link className="primary-button" to={ROUTES.PRODUCTS}>
        Continue Shopping
      </Link>
    </section>
  );
}

function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);

  if (items.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <section className="cart-page">
      <div className="cart-page__content">
        <div className="cart-page__header">
          <div>
            <span className="landing-section__eyebrow">Cart</span>
            <h1 className="cart-page__title">Your shopping cart</h1>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              dispatch(clearCart());
              toast.info('Cart cleared.');
            }}
          >
            Clear Cart
          </button>
        </div>

        <div className="cart-page__items">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <CartSummary />
    </section>
  );
}

export const CartSummaryPanel = CartSummary;

export default CartPage;
