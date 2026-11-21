import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function formatPrice(value) {
  return `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;

  async function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    await addItem(product.id, 1);
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} style={{ display: 'contents' }}>
        <div className="product-card-media">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <span className="product-card-monogram">{product.name.charAt(0).toUpperCase()}</span>
          )}
          {outOfStock && <span className="product-card-stock-flag badge badge-outofstock">Out of stock</span>}
          {lowStock && <span className="product-card-stock-flag badge badge-lowstock">Only {product.stock} left</span>}
        </div>
        <div className="product-card-body">
          {product.category && <span className="product-card-category">{product.category}</span>}
          <span className="product-card-name">{product.name}</span>
          <div className="product-card-footer">
            <span className="product-card-price">{formatPrice(product.price)}</span>
            <button onClick={handleAdd} disabled={outOfStock} className="btn btn-primary btn-sm">
              {outOfStock ? 'Unavailable' : 'Add'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

export { formatPrice };
