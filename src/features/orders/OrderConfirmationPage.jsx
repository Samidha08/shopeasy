import { Link, Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../routes/routePaths';
import { formatCurrency } from '../../utils/currency';
import { selectOrderById } from './ordersSlice';

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function OrderConfirmationPage() {
  const { id } = useParams();
  const order = useSelector(selectOrderById(id));

  if (!order) {
    return <Navigate to={ROUTES.ORDER_HISTORY} replace />;
  }

  return (
    <section className="order-page">
      <div className="order-page__header">
        <span className="landing-section__eyebrow">Order Confirmed</span>
        <h1 className="order-page__title">Thank you for your order</h1>
        <p className="order-page__description">
          Your payment is complete and your order has been saved.
        </p>
      </div>

      <div className="order-layout">
        <section className="order-panel">
          <h2 className="order-panel__title">Order details</h2>
          <div className="order-detail-list">
            <div className="order-detail-list__row">
              <span>Order ID</span>
              <strong>{order.id}</strong>
            </div>
            <div className="order-detail-list__row">
              <span>Payment ID</span>
              <strong>{order.paymentId}</strong>
            </div>
            <div className="order-detail-list__row">
              <span>Order Date</span>
              <strong>{formatDate(order.createdAt)}</strong>
            </div>
            <div className="order-detail-list__row">
              <span>Status</span>
              <strong>{order.status}</strong>
            </div>
            <div className="order-detail-list__row order-detail-list__row--final">
              <span>Final Amount</span>
              <strong>{formatCurrency(order.amount)}</strong>
            </div>
          </div>
        </section>

        <section className="order-panel">
          <h2 className="order-panel__title">Delivery address</h2>
          <address className="checkout-address">
            <strong>{order.address.fullName}</strong>
            <span>{order.address.mobileNumber}</span>
            <span>{order.address.addressLine1}</span>
            {order.address.addressLine2 ? (
              <span>{order.address.addressLine2}</span>
            ) : null}
            <span>
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </span>
          </address>
        </section>
      </div>

      <section className="order-panel">
        <h2 className="order-panel__title">Ordered items</h2>
        <div className="checkout-items">
          {order.items.map((item) => (
            <article key={item.id} className="checkout-item">
              <img
                className="checkout-item__image"
                src={item.thumbnail}
                alt={item.title}
              />
              <div className="checkout-item__content">
                <h3 className="checkout-item__title">{item.title}</h3>
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

      <Link className="primary-button order-page__button" to={ROUTES.PRODUCTS}>
        Continue Shopping
      </Link>
    </section>
  );
}

export default OrderConfirmationPage;
