import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ROUTES } from '../../routes/routePaths';
import WishlistItem from './WishlistItem';
import {
  clearWishlist,
  selectWishlistCount,
  selectWishlistItems,
} from './wishlistSlice';

function EmptyWishlistState() {
  return (
    <section className="empty-state">
      <h1 className="empty-state__title">Your wishlist is empty</h1>
      <p className="empty-state__description">
        Save products you like and come back when you&apos;re ready to buy.
      </p>
      <Link className="primary-button" to={ROUTES.PRODUCTS}>
        Explore Products
      </Link>
    </section>
  );
}

function WishlistPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);
  const totalItems = useSelector(selectWishlistCount);

  if (items.length === 0) {
    return <EmptyWishlistState />;
  }

  return (
    <section className="wishlist-page">
      <div className="wishlist-page__header">
        <div>
          <span className="landing-section__eyebrow">Wishlist</span>
          <h1 className="wishlist-page__title">Saved for later</h1>
          <p className="wishlist-page__description">
            Keep track of products you love and move them to your cart when
            you&apos;re ready.
          </p>
        </div>

        <div className="wishlist-page__header-actions">
          <span className="wishlist-page__count">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              dispatch(clearWishlist());
              toast.info('Wishlist cleared.');
            }}
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      <div className="wishlist-page__items">
        {items.map((item) => (
          <WishlistItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default WishlistPage;
