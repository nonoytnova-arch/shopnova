import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductGrid from '../components/ProductGrid';
import ProductFilters from '../components/ProductFilters';

const PRICE_RANGE_LABELS = {
  '-500': 'Under ₹500',
  '500-1500': '₹500 – ₹1,500',
  '1500-3000': '₹1,500 – ₹3,000',
  '3000-': 'Over ₹3,000'
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest'
  };

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api
      .getProducts(filters)
      .then((data) => active && setProducts(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  function updateFilters(patch) {
    const next = { ...filters, ...patch };
    const params = {};
    Object.entries(next).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    setSearchParams(params);
  }

  function clearAll() {
    setSearchParams({});
    setFiltersOpen(false);
  }

  const priceRangeLabel = PRICE_RANGE_LABELS[`${filters.minPrice}-${filters.maxPrice}`];
  const activePills = [
    filters.search && { key: 'search', label: `Search: "${filters.search}"`, onRemove: () => updateFilters({ search: '' }) },
    filters.category && { key: 'category', label: filters.category, onRemove: () => updateFilters({ category: '' }) },
    priceRangeLabel && { key: 'price', label: priceRangeLabel, onRemove: () => updateFilters({ minPrice: '', maxPrice: '' }) }
  ].filter(Boolean);

  const title = filters.search
    ? `Search results for "${filters.search}"`
    : filters.category || 'All Products';

  return (
    <div className="container products-layout">
      <ProductFilters
        categories={categories}
        filters={filters}
        onChange={updateFilters}
        onClearAll={clearAll}
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <div>
        <div className="toolbar">
          <h2>{title}</h2>
          <div className="flex items-center gap-12">
            {!loading && !error && <span className="text-muted text-sm">{products.length} products</span>}
            <button className="btn btn-outline btn-sm mobile-filters-btn" onClick={() => setFiltersOpen(true)}>
              Filters{activePills.length > 0 ? ` (${activePills.length})` : ''}
            </button>
          </div>
        </div>

        {activePills.length > 0 && (
          <div className="active-filters">
            {activePills.map((pill) => (
              <span key={pill.key} className="active-filter-pill">
                {pill.label}
                <button onClick={pill.onRemove} aria-label={`Remove ${pill.label} filter`}>✕</button>
              </span>
            ))}
            <button className="clear-filters-link" onClick={clearAll}>Clear all</button>
          </div>
        )}

        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          emptyMessage="Try a different search term, category, or price range."
        />
      </div>
    </div>
  );
}
