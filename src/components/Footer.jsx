import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/routePaths';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-mark" aria-hidden="true">S</span>
            <span>ShopEasy</span>
          </div>
          <p>
            Premium everyday shopping across electronics, fashion, home and
            lifestyle essentials.
          </p>
          <div className="footer__socials" aria-label="Social links">
            <a href="/" aria-label="Instagram">Ig</a>
            <a href="/" aria-label="Facebook">Fb</a>
            <a href="/" aria-label="X">X</a>
          </div>
        </div>

        <div className="footer__column">
          <h3>About</h3>
          <a href="#about">Our Story</a>
          <a href="#careers">Careers</a>
          <a href="#press">Press</a>
          <a href="#sustainability">Sustainability</a>
        </div>

        <div className="footer__column">
          <h3>Customer Service</h3>
          <a href="#help">Help Center</a>
          <a href="#shipping">Shipping</a>
          <a href="#returns">Returns</a>
          <a href="#tracking">Track Order</a>
        </div>

        <div className="footer__column">
          <h3>Quick Links</h3>
          <Link to={ROUTES.PRODUCTS}>Products</Link>
          <Link to={ROUTES.WISHLIST}>Wishlist</Link>
          <Link to={ROUTES.CART}>Cart</Link>
          <Link to={ROUTES.ORDER_HISTORY}>Orders</Link>
        </div>

        <div className="footer__column">
          <h3>Contact Information</h3>
          <p>support@shopeasy.com</p>
          <p>+91 98765 43210</p>
          <p>Mumbai, India</p>
        </div>
      </div>
      <div className="footer__bottom">
        <p>Copyright {new Date().getFullYear()} ShopEasy. All rights reserved.</p>
        <p>Privacy Policy | Terms of Service</p>
      </div>
    </footer>
  );
}

export default Footer;
