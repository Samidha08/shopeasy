import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { formatCurrency } from '../../utils/currency';

function PaymentStep({
  address,
  items,
  summary,
  isProcessing,
  onBack,
  onPayNow,
}) {
  return (
    <div className="checkout-review">
      <div className="checkout-section__header">
        <span className="landing-section__eyebrow">Step 2</span>
        <h2 className="checkout-section__title">Review and payment</h2>
      </div>

      <div className="checkout-review__grid">
        <section className="checkout-panel">
          <h3 className="checkout-panel__title">Delivery address</h3>
          <address className="checkout-address">
            <strong>{address.fullName}</strong>
            <span>{address.mobileNumber}</span>
            <span>{address.addressLine1}</span>
            {address.addressLine2 ? <span>{address.addressLine2}</span> : null}
            <span>
              {address.city}, {address.state} - {address.pincode}
            </span>
          </address>
        </section>

        <section className="checkout-panel">
          <h3 className="checkout-panel__title">Order summary</h3>
          <div className="checkout-summary">
            <div className="checkout-summary__row">
              <span>Total items</span>
              <strong>{summary.totalItems}</strong>
            </div>
            <div className="checkout-summary__row">
              <span>Subtotal</span>
              <strong>{formatCurrency(summary.subtotal)}</strong>
            </div>
            <div className="checkout-summary__row">
              <span>Discount</span>
              <strong>-{formatCurrency(summary.totalDiscount)}</strong>
            </div>
            <div className="checkout-summary__row checkout-summary__row--final">
              <span>Final Total</span>
              <strong>{formatCurrency(summary.finalTotal)}</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="checkout-panel">
        <h3 className="checkout-panel__title">Cart items</h3>
        <div className="checkout-items">
          {items.map((item) => (
            <article key={item.id} className="checkout-item">
              <img
                className="checkout-item__image"
                src={item.thumbnail}
                alt={item.title}
              />
              <div className="checkout-item__content">
                <h4 className="checkout-item__title">{item.title}</h4>
                <p className="checkout-item__meta">
                  Qty {item.quantity} x {formatCurrency(item.price)}
                </p>
              </div>
              <strong className="checkout-item__price">
                {formatCurrency(item.price * item.quantity)}
              </strong>
            </article>
          ))}
        </div>
      </section>

      <div className="checkout-review__actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onBack}
          disabled={isProcessing}
        >
          Back to Address
        </button>
        <Link className="secondary-button" to={ROUTES.CART}>
          Edit Cart
        </Link>
        <button
          type="button"
          className="primary-button"
          onClick={onPayNow}
          disabled={isProcessing}
        >
          {isProcessing ? 'Opening Payment...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
}

export default PaymentStep;
