import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetProductByIdQuery } from './productsApi';
import { addToCart } from '../cart/cartSlice';
import {
  addToWishlist,
  selectIsProductWishlisted,
} from '../wishlist/wishlistSlice';
import {
  formatUsdAsInr,
  convertUsdToInr,
} from '../../utils/currency';


function formatCategoryName(categoryName) {
  return categoryName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function LoadingState() {
  return (
    <section className="product-detail product-detail--loading" aria-label="Loading product">
      <div className="product-detail__gallery-skeleton loading-card" aria-hidden="true" />
      <div className="product-detail__content-skeleton">
        <div className="loading-card loading-card--detail" aria-hidden="true" />
        <div className="loading-card loading-card--detail" aria-hidden="true" />
        <div className="loading-card loading-card--detail" aria-hidden="true" />
      </div>
    </section>
  );
}

function ErrorState({ onRetry }) {
  return (
    <section className="error-state" role="alert">
      <p>We couldn't load this product right now.</p>
      <button type="button" className="primary-button" onClick={onRetry}>
        Try Again
      </button>
    </section>
  );
}

function ProductDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { data: product, isLoading, isError, refetch } = useGetProductByIdQuery(id);
  const isWishlisted = useSelector(selectIsProductWishlisted(id));

  const images = useMemo(() => {
    if (!product) {
      return [];
    }

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }

    return product.thumbnail ? [product.thumbnail] : [];
  }, [product]);

  const selectedImage = images[selectedImageIndex] || product?.thumbnail;

  const handleDecrease = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const handleIncrease = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: convertUsdToInr(product.price),
        thumbnail: product.thumbnail,
        discountPercentage: product.discountPercentage,
        category: product.category,
        brand: product.brand,
        stock: product.stock,
        quantity,
      })
    );
    toast.success(`${quantity} ${product.title} added to cart.`);
  };

  const handleAddToWishlist = () => {
    if (!product) {
      return;
    }

    if (isWishlisted) {
      toast.info(`${product.title} is already in your wishlist.`);
      return;
    }

    dispatch(
      addToWishlist({
        id: product.id,
        title: product.title,
        price: convertUsdToInr(product.price),
        thumbnail: product.thumbnail,
        discountPercentage: product.discountPercentage,
        category: product.category,
        brand: product.brand,
        stock: product.stock,
        rating: product.rating,
      })
    );
    toast.success(`${product.title} added to wishlist.`);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !product) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <section className="product-detail">
      <div className="product-detail__gallery">
        <div className="product-detail__main-image-wrap">
          <img
            className="product-detail__main-image"
            src={selectedImage}
            alt={product.title}
          />
          <span className="product-card__badge product-detail__discount-badge">
            {Math.round(product.discountPercentage)}% OFF
          </span>
        </div>

        {images.length > 1 ? (
          <div className="product-detail__thumbnails">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                className={
                  index === selectedImageIndex
                    ? 'product-detail__thumbnail product-detail__thumbnail--active'
                    : 'product-detail__thumbnail'
                }
                onClick={() => setSelectedImageIndex(index)}
              >
                <img src={image} alt={`${product.title} view ${index + 1}`} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="product-detail__content">
        <div className="product-detail__header">
          <span className="product-card__category">
            {formatCategoryName(product.category)}
          </span>
          <h1 className="product-detail__title">{product.title}</h1>
          <p className="product-detail__description">{product.description}</p>
        </div>

        <div className="product-detail__highlights">
          <div className="product-detail__price-block">
            <span className="product-detail__price-label">Price</span>
            <strong className="product-detail__price">
              {formatUsdAsInr(product.price)}
            </strong>
          </div>
          <div className="product-detail__rating-block">
            <span className="product-detail__rating">Rating {product.rating}</span>
            <span className="product-detail__stock">
              {product.stock} in stock
            </span>
          </div>
        </div>

        <dl className="product-detail__meta">
          <div className="product-detail__meta-item">
            <dt>Brand</dt>
            <dd>{product.brand || 'N/A'}</dd>
          </div>
          <div className="product-detail__meta-item">
            <dt>Category</dt>
            <dd>{formatCategoryName(product.category)}</dd>
          </div>
          <div className="product-detail__meta-item">
            <dt>Discount</dt>
            <dd>{Math.round(product.discountPercentage)}%</dd>
          </div>
          <div className="product-detail__meta-item">
            <dt>Stock</dt>
            <dd>{product.stock}</dd>
          </div>
        </dl>

        <div className="product-detail__actions">
          <div className="quantity-selector" aria-label="Quantity selector">
            <span className="quantity-selector__label">Quantity</span>
            <div className="quantity-selector__controls">
              <button
                type="button"
                className="quantity-selector__button"
                onClick={handleDecrease}
              >
                -
              </button>
              <span className="quantity-selector__value">{quantity}</span>
              <button
                type="button"
                className="quantity-selector__button"
                onClick={handleIncrease}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-detail__button-group">
            <button type="button" className="primary-button" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={handleAddToWishlist}
            >
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;
