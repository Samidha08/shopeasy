function SortDropdown({ value, onChange }) {
  return (
    <label className="sort-dropdown">
      <span className="sort-dropdown__label">Sort by</span>
      <select className="sort-dropdown__select" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Rating</option>
        <option value="name-asc">Name: A-Z</option>
      </select>
    </label>
  );
}

export default SortDropdown;
