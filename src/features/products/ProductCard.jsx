import { Link } from 'react-router-dom';
import { productDetail } from '../../routes/routePaths';

function ProductCard({ product }) {
  return (
    <Link className="product-card" to={productDetail(product.id)}>
      <div className="product-card__image-wrap">
        <img
          className="product-card__image"
          src={product.thumbnail}
          alt={product.title}
        />
        <span className="product-card__badge">
          {Math.round(product.discountPercentage)}% OFF
        </span>
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{product.title}</h3>
        <div className="product-card__meta">
          <span className="product-card__price">${product.price}</span>
          <span className="product-card__rating">Rating {product.rating}</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
