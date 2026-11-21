import { Link } from 'react-router-dom';

export default function CategoryList({ categories }) {
  if (!categories || categories.length === 0) return null;
  return (
    <div className="category-grid">
      {categories.map((cat) => (
        <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="category-card">
          <span className="category-card-label">{cat}</span>
        </Link>
      ))}
    </div>
  );
}
