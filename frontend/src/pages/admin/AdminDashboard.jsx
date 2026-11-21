import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import StateMessage from '../../components/StateMessage';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatPrice } from '../../components/ProductCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getAdminStats(), api.getAdminOrders()])
      .then(([statsData, ordersData]) => {
        setStats(statsData);
        setRecentOrders(ordersData.slice(0, 5));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <StateMessage type="loading" title="Loading dashboard..." />;
  if (error) return <StateMessage type="error" title="Couldn't load dashboard" description={error} />;

  return (
    <div>
      <h2 className="mb-16">Dashboard Overview</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total Products</div>
          <div className="value">{stats.totalProducts}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Customers</div>
          <div className="value">{stats.totalCustomers}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Orders</div>
          <div className="value">{stats.totalOrders}</div>
        </div>
        <div className="stat-card">
          <div className="label">Revenue</div>
          <div className="value">{formatPrice(stats.revenue)}</div>
        </div>
      </div>
      <p className="text-muted text-sm mb-16">Revenue totals all orders that are not cancelled.</p>

      <div className="admin-toolbar">
        <h3 style={{ margin: 0 }}>Recent Orders</h3>
        <Link to="/admin/orders" className="btn btn-outline btn-sm">View All Orders</Link>
      </div>

      {recentOrders.length === 0 ? (
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
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customer_name}</td>
                  <td>{formatPrice(o.total)}</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td><OrderStatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
