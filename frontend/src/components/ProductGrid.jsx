import ProductCard from './ProductCard';
import StateMessage from './StateMessage';

export default function ProductGrid({ products, loading, error, emptyMessage }) {
  if (loading) {
    return <StateMessage type="loading" title="Loading products..." />;
  }
  if (error) {
    return <StateMessage type="error" title="Something went wrong" description={error} />;
  }
  if (!products || products.length === 0) {
    return (
      <StateMessage
        type="empty"
        title="No products found"
        description={emptyMessage || 'Try adjusting your search or filters.'}
      />
    );
  }
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
