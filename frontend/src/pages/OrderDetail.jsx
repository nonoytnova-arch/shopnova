import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import StateMessage from '../components/StateMessage';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { formatPrice } from '../components/ProductCard';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getMyOrder(id)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <StateMessage type="loading" title="Loading order..." />;
  if (error || !order) {
    return (
      <StateMessage
        type="error"
        title="Order not found"
        description={error}
        action={<Link to="/account" className="btn btn-outline btn-sm mt-8">Back to Orders</Link>}
      />
    );
  }

  return (
    <div className="container" style={{ maxWidth: 760, padding: '28px 20px 56px' }}>
      <Link to="/account" className="text-sm text-muted">← Back to Orders</Link>

      <div className="flex justify-between items-center mt-16 mb-16" style={{ flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0 }}>Order #{order.id}</h2>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="card card-pad mb-16">
        <h3>Items</h3>
        {order.items.map((item) => (
          <div key={item.product_id} className="order-review-line">
            <span>{item.name} × {item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="card card-pad">
        <h3>Shipping Address</h3>
        <p style={{ margin: 0 }}>
          {order.shipping_name}<br />
          {order.shipping_address}, {order.shipping_city} {order.shipping_zip}<br />
          Phone: {order.shipping_phone}
        </p>
      </div>

      <p className="text-muted text-sm mt-16">
        Placed on {new Date(order.created_at).toLocaleString()}
      </p>
    </div>
  );
}
