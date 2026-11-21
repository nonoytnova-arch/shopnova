import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import QuantityStepper from '../components/QuantityStepper';
import StateMessage from '../components/StateMessage';
import ProductGrid from '../components/ProductGrid';
import { formatPrice } from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addMessage, setAddMessage] = useState('');
  const [related, setRelated] = useState([]);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setAddMessage('');
    setQuantity(1);
    setRelated([]);
    api
      .getProduct(id)
      .then((data) => {
        if (!active) return;
        setProduct(data);
        if (data.category) {
          // Related products: real data from the same category, current item excluded.
          // Never padded or duplicated — if fewer than 4 exist, fewer are shown.
          api
            .getProducts({ category: data.category })
            .then((list) => active && setRelated(list.filter((p) => p.id !== data.id).slice(0, 4)))
            .catch(() => active && setRelated([]));
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  async function handleAddToCart() {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addItem(product.id, quantity);
      setAddMessage('Added to cart.');
    } catch (err) {
      setAddMessage(err.message);
    }
  }

  if (loading) {
    return <StateMessage type="loading" title="Loading product..." />;
  }
  if (error || !product) {
    return (
      <StateMessage
        type="error"
        title="Product not found"
        description={error || 'This product may have been removed.'}
        action={<Link to="/products" className="btn btn-outline btn-sm mt-8">Back to Shop</Link>}
      />
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="container pd-layout">
      <div className="pd-media">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <span className="pd-monogram">{product.name.charAt(0).toUpperCase()}</span>
        )}
      </div>

      <div>
        <div className="pd-breadcrumb">
          <Link to="/products">Shop</Link> / {product.category || 'Product'}
        </div>
        {product.category && <div className="pd-category">{product.category}</div>}
        <h1>{product.name}</h1>
        <div className="pd-price">{formatPrice(product.price)}</div>

        {outOfStock ? (
          <span className="badge badge-outofstock mb-16" style={{ display: 'inline-block' }}>Out of stock</span>
        ) : product.stock <= 5 ? (
          <span className="badge badge-lowstock mb-16" style={{ display: 'inline-block' }}>
            Only {product.stock} left in stock
          </span>
        ) : (
          <span className="badge badge-delivered mb-16" style={{ display: 'inline-block' }}>In stock</span>
        )}

        {product.description && <p className="pd-desc">{product.description}</p>}

        <div className="pd-actions">
          {!outOfStock && <QuantityStepper value={quantity} onChange={setQuantity} max={product.stock} />}
          <button className="btn btn-primary" onClick={handleAddToCart} disabled={outOfStock}>
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
        {addMessage && <p className="mt-16 text-sm" style={{ color: 'var(--color-success)' }}>{addMessage}</p>}
      </div>

      {related.length > 0 && (
        <div className="related-section" style={{ gridColumn: '1 / -1' }}>
          <h2 className="mb-16">You might also like</h2>
          <ProductGrid products={related} loading={false} error="" />
        </div>
      )}
    </div>
  );
}
