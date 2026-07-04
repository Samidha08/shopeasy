function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">ShopEasy</div>
      <div className="navbar__search" aria-hidden="true">
        Search placeholder
      </div>
      <nav className="navbar__actions" aria-label="Primary">
        <span className="navbar__action" aria-hidden="true">
          Wishlist
        </span>
        <span className="navbar__action" aria-hidden="true">
          Cart
        </span>
        <span className="navbar__action" aria-hidden="true">
          Login
        </span>
      </nav>
    </header>
  );
}

export default Navbar;
