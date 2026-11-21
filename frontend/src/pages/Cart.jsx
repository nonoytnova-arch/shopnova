import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import QuantityStepper from '../components/QuantityStepper';
import StateMessage from '../components/StateMessage';
import { formatPrice } from '../components/ProductCard';
import { api } from '../services/api';

export default function Cart() {
  const { items, refreshCart, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Quantity changes go through the same add endpoint (it's additive server-side),
  // so we remove then re-add the delta to land on an exact target quantity.
  async function handleQuantityChange(item, newQuantity) {
    const delta = newQuantity - item.quantity;
    if (delta === 0) return;
    if (delta > 0) {
      await api.addToCart(item.product_id ?? item.id, delta);
    } else {
      await removeItem(item.cart_item_id);
      if (newQuantity > 0) {
        await api.addToCart(item.product_id ?? item.id, newQuantity);
      }
    }
    await refreshCart();
  }

  if (!user) return null;

  if (items.length === 0) {
    return (
      <StateMessage
        type="empty"
        title="Your cart is empty"
        description="Browse the shop and add something you like."
        action={<Link to="/products" className="btn btn-primary mt-8">Shop Products</Link>}
      />
    );
  }

  return (
    <div className="container cart-layout">
      <div className="card card-pad">
        <h2 className="mb-16">Your Cart</h2>
        {items.map((item) => (
          <div key={item.cart_item_id} className="cart-line">
            <div className="cart-thumb">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} />
              ) : (
                item.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div className="text-muted text-sm">{formatPrice(item.price)} each</div>
            </div>
            <QuantityStepper
              value={item.quantity}
              max={item.stock}
              onChange={(newQty) => handleQuantityChange(item, newQty)}
            />
            <span className="cart-line-price">{formatPrice(item.price * item.quantity)}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => removeItem(item.cart_item_id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="card card-pad summary-card">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <button className="btn btn-primary btn-block mt-16" onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
