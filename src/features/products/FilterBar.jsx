function formatCategoryName(categoryName) {
  return categoryName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function FilterBar({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="filter-bar">
      <span className="filter-bar__label">Categories</span>
      <div className="filter-bar__chips" role="listbox" aria-label="Product categories">
        <button
          type="button"
          className={`filter-chip${!activeCategory ? ' filter-chip--active' : ''}`}
          onClick={() => onSelectCategory('')}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            className={`filter-chip${activeCategory === category.slug ? ' filter-chip--active' : ''}`}
            onClick={() => onSelectCategory(category.slug)}
          >
            {formatCategoryName(category.name)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;
