import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import StateMessage from '../../components/StateMessage';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatPrice } from '../../components/ProductCard';

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  function load() {
    setLoading(true);
    api
      .getAdminOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleStatusChange(orderId, status) {
    setUpdatingId(orderId);
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h2 className="mb-16">Orders</h2>

      {loading ? (
        <StateMessage type="loading" title="Loading orders..." />
      ) : error ? (
        <StateMessage type="error" title="Couldn't load orders" description={error} />
      ) : orders.length === 0 ? (
        <StateMessage type="empty" title="No orders yet" />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>
                    {o.customer_name}
                    <div className="text-muted text-sm">{o.customer_email}</div>
                  </td>
                  <td>{formatPrice(o.total)}</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex items-center gap-8">
                      <OrderStatusBadge status={o.status} />
                      <select
                        className="status-select"
                        value={o.status}
                        disabled={updatingId === o.id}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
