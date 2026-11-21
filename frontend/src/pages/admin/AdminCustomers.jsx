import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import StateMessage from '../../components/StateMessage';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getAdminCustomers()
      .then(setCustomers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="mb-16">Customers</h2>

      {loading ? (
        <StateMessage type="loading" title="Loading customers..." />
      ) : error ? (
        <StateMessage type="error" title="Couldn't load customers" description={error} />
      ) : customers.length === 0 ? (
        <StateMessage type="empty" title="No customers yet" />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
