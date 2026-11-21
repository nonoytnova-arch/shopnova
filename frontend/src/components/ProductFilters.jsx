const PRICE_RANGES = [
  { label: 'Any price', min: '', max: '' },
  { label: 'Under ₹500', min: '', max: '500' },
  { label: '₹500 – ₹1,500', min: '500', max: '1500' },
  { label: '₹1,500 – ₹3,000', min: '1500', max: '3000' },
  { label: 'Over ₹3,000', min: '3000', max: '' }
];

// Same component renders as the sticky desktop sidebar AND the mobile
// bottom-sheet drawer — CSS (.filters-panel) repositions it per breakpoint.
// `isOpen`/`onClose` only matter below the 860px breakpoint.
export default function ProductFilters({ categories, filters, onChange, onClearAll, isOpen, onClose }) {
  function isActivePriceRange(range) {
    return (filters.minPrice || '') === range.min && (filters.maxPrice || '') === range.max;
  }

  return (
    <>
      <div className={`filters-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`filters-panel ${isOpen ? 'open' : ''}`}>
        <div className="filters-panel-header">
          <h3 style={{ margin: 0 }}>Filters</h3>
          <button className="nav-icon-btn" style={{ display: 'inline-flex' }} onClick={onClose} aria-label="Close filters">✕</button>
        </div>

        <div className="filter-group">
          <h4>Category</h4>
          <div className="filter-chip-list">
            <button
              className={`filter-chip ${!filters.category ? 'active' : ''}`}
              onClick={() => onChange({ category: '' })}
            >
              All categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${filters.category === cat ? 'active' : ''}`}
                onClick={() => onChange({ category: cat })}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Price</h4>
          <div className="filter-chip-list">
            {PRICE_RANGES.map((range) => (
              <button
                key={range.label}
                className={`filter-chip ${isActivePriceRange(range) ? 'active' : ''}`}
                onClick={() => onChange({ minPrice: range.min, maxPrice: range.max })}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Sort by</h4>
          <select
            className="form-select"
            value={filters.sort || 'newest'}
            onChange={(e) => onChange({ sort: e.target.value })}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>

        <div className="filters-panel-footer">
          <button className="btn btn-outline btn-block btn-sm" onClick={onClearAll}>Clear All</button>
          <button className="btn btn-primary btn-block btn-sm" onClick={onClose}>Show Results</button>
        </div>
      </aside>
    </>
  );
}
