import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { removeFromCart, updateQuantity } from './cartSlice';
import { formatCurrency } from '../../utils/currency';

function CartItem({ item, compact = false }) {
  const dispatch = useDispatch();

  const handleDecrease = () => {
    dispatch(
      updateQuantity({
        productId: item.id,
        quantity: Math.max(1, item.quantity - 1),
      })
    );
  };

  const handleIncrease = () => {
    dispatch(
      updateQuantity({
        productId: item.id,
        quantity: item.quantity + 1,
      })
    );
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
    toast.info(`${item.title} removed from cart.`);
  };

  return (
    <article className={compact ? 'cart-item cart-item--compact' : 'cart-item'}>
      <img className="cart-item__image" src={item.thumbnail} alt={item.title} />

      <div className="cart-item__content">
        <div className="cart-item__details">
          <h3 className="cart-item__title">{item.title}</h3>
          <p className="cart-item__price">{formatCurrency(item.price)}</p>
        </div>

        <div className="cart-item__footer">
          <div className="quantity-selector__controls">
            <button
              type="button"
              className="quantity-selector__button"
              onClick={handleDecrease}
            >
              -
            </button>
            <span className="quantity-selector__value">{item.quantity}</span>
            <button
              type="button"
              className="quantity-selector__button"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>

          <span className="cart-item__subtotal">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="cart-item__remove"
        onClick={handleRemove}
      >
        Remove
      </button>
    </article>
  );
}

export default CartItem;
