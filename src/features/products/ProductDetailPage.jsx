import { useParams } from 'react-router-dom';

function ProductDetailPage() {
  const { id } = useParams();

  return (
    <section className="product-detail-placeholder">
      <span className="landing-section__eyebrow">Product Detail</span>
      <h1 className="landing-section__title">Product {id}</h1>
      <p className="landing-section__description">
        Product detail implementation is coming next. You can already navigate here
        from the landing page.
      </p>
    </section>
  );
}

export default ProductDetailPage;
