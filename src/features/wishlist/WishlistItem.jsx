import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../cart/cartSlice';
import { productDetail } from '../../routes/routePaths';
import { removeFromWishlist } from './wishlistSlice';

function formatCategoryName(categoryName = '') {
  return categoryName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function WishlistItem({ item }) {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromWishlist(item.id));
    toast.info(`${item.title} removed from wishlist.`);
  };

  const handleMoveToCart = () => {
    dispatch(
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
        discountPercentage: item.discountPercentage,
        category: item.category,
        brand: item.brand,
        stock: item.stock,
        quantity: 1,
      })
    );
    dispatch(removeFromWishlist(item.id));
    toast.success(`${item.title} moved to cart.`);
  };

  return (
    <article className="wishlist-item">
      <Link className="wishlist-item__image-wrap" to={productDetail(item.id)}>
        <img className="wishlist-item__image" src={item.thumbnail} alt={item.title} />
      </Link>

      <div className="wishlist-item__content">
        <div className="wishlist-item__details">
          <span className="product-card__category">
            {formatCategoryName(item.category)}
          </span>
          <Link className="wishlist-item__title" to={productDetail(item.id)}>
            {item.title}
          </Link>
          <div className="wishlist-item__meta">
            <span className="wishlist-item__price">${item.price}</span>
            {item.rating ? (
              <span className="wishlist-item__rating">Rating {item.rating}</span>
            ) : null}
          </div>
        </div>

        <div className="wishlist-item__actions">
          <button type="button" className="primary-button" onClick={handleMoveToCart}>
            Move to Cart
          </button>
          <button type="button" className="secondary-button" onClick={handleRemove}>
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}

export default WishlistItem;
