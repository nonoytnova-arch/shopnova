import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StateMessage from '../components/StateMessage';
import { formatPrice } from '../components/ProductCard';

const emptyForm = {
  shippingName: '',
  shippingPhone: '',
  shippingAddress: '',
  shippingCity: '',
  shippingZip: ''
};

export default function Checkout() {
  const { items, refreshCart, placeOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...emptyForm, shippingName: user?.name || '' });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const result = await placeOrder(form);
      navigate('/account', { state: { justPlacedOrderId: result.orderId } });
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  if (!user) return null;

  if (items.length === 0) {
    return (
      <StateMessage
        type="empty"
        title="Your cart is empty"
        description="Add something to your cart before checking out."
        action={<Link to="/products" className="btn btn-primary mt-8">Shop Products</Link>}
      />
    );
  }

  return (
    <div className="container checkout-layout">
      <div className="card card-pad">
        <div className="checkout-step-title">
          <span className="num">1</span>
          <h2 style={{ margin: 0 }}>Shipping Details</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              name="shippingName"
              value={form.shippingName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                className="form-input"
                name="shippingPhone"
                value={form.shippingPhone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">ZIP / Postal Code</label>
              <input
                className="form-input"
                name="shippingZip"
                value={form.shippingZip}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input
              className="form-input"
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              className="form-input"
              name="shippingCity"
              value={form.shippingCity}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="form-error mb-16">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={placing}>
            {placing ? 'Placing Order...' : `Place Order — ${formatPrice(total)}`}
          </button>
        </form>
      </div>

      <div className="card card-pad">
        <div className="checkout-step-title">
          <span className="num">2</span>
          <h2 style={{ margin: 0 }}>Review Order</h2>
        </div>
        {items.map((item) => (
          <div key={item.cart_item_id} className="order-review-line">
            <span>{item.name} × {item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
