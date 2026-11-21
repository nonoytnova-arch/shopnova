import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StateMessage from '../components/StateMessage';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { formatPrice } from '../components/ProductCard';

export default function Account() {
  const { user } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container account-layout">
      <aside className="account-sidebar">
        <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div className="name">{user.name}</div>
        <div className="email">{user.email}</div>
        {user.role === 'admin' && (
          <Link to="/admin" className="btn btn-outline btn-sm btn-block mt-16">Admin Dashboard</Link>
        )}
      </aside>

      <div>
        <div className="page-header" style={{ padding: 0, marginBottom: 20 }}>
          <h2>Order History</h2>
          <p>Track and review your past orders.</p>
        </div>

        {location.state?.justPlacedOrderId && (
          <div className="card card-pad mb-16" style={{ borderColor: 'var(--color-success)' }}>
            Your order #{location.state.justPlacedOrderId} was placed successfully!
          </div>
        )}

        {loading ? (
          <StateMessage type="loading" title="Loading your orders..." />
        ) : error ? (
          <StateMessage type="error" title="Couldn't load orders" description={error} />
        ) : orders.length === 0 ? (
          <StateMessage
            type="empty"
            title="No orders yet"
            description="Your past orders will show up here."
            action={<Link to="/products" className="btn btn-primary mt-8">Start Shopping</Link>}
          />
        ) : (
          orders.map((order) => (
            <Link key={order.id} to={`/account/orders/${order.id}`} className="order-row">
              <div>
                <div style={{ fontWeight: 700 }}>Order #{order.id}</div>
                <div className="meta">{new Date(order.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{ fontWeight: 700 }}>{formatPrice(order.total)}</div>
              <OrderStatusBadge status={order.status} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
