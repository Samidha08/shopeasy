import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES, orderConfirmation } from '../../routes/routePaths';
import { formatCurrency } from '../../utils/currency';
import { selectOrders } from './ordersSlice';

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function EmptyOrdersState() {
  return (
    <section className="empty-state">
      <h1 className="empty-state__title">No orders yet</h1>
      <p className="empty-state__description">
        Your completed ShopEasy orders will appear here after checkout.
      </p>
      <Link className="primary-button" to={ROUTES.PRODUCTS}>
        Continue Shopping
      </Link>
    </section>
  );
}

function OrderHistoryPage() {
  const orders = useSelector(selectOrders);

  if (orders.length === 0) {
    return <EmptyOrdersState />;
  }

  return (
    <section className="order-page">
      <div className="order-page__header">
        <span className="landing-section__eyebrow">Orders</span>
        <h1 className="order-page__title">Order history</h1>
        <p className="order-page__description">
          Review your previous ShopEasy orders, newest first.
        </p>
      </div>

      <div className="order-history">
        {orders.map((order) => (
          <article key={order.id} className="order-history-card">
            <div className="order-history-card__header">
              <div>
                <h2 className="order-history-card__title">{order.id}</h2>
                <p className="order-history-card__meta">
                  {formatDate(order.createdAt)} · {order.status}
                </p>
              </div>
              <strong className="order-history-card__amount">
                {formatCurrency(order.amount)}
              </strong>
            </div>

            <div className="order-history-card__items">
              {order.items.slice(0, 3).map((item) => (
                <img
                  key={item.id}
                  className="order-history-card__image"
                  src={item.thumbnail}
                  alt={item.title}
                />
              ))}
              {order.items.length > 3 ? (
                <span className="order-history-card__more">
                  +{order.items.length - 3}
                </span>
              ) : null}
            </div>

            <Link
              className="secondary-button order-history-card__button"
              to={orderConfirmation(order.id)}
            >
              View Details
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default OrderHistoryPage;
