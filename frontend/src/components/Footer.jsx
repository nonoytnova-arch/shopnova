import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Footer() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="site-footer">
      <button className="back-to-top" onClick={scrollToTop}>↑ Back to Top</button>

      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>ShopNova</h4>
            <p>
              A modern storefront for everyday essentials — built with React, Node.js,
              Express and MySQL.
            </p>
            <span className="footer-payment-note">💳 Pay on Delivery — no online payment required</span>
          </div>

          <div>
            <h4>Shop by Category</h4>
            <ul className="footer-links">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat}>
                    <Link to={`/products?category=${encodeURIComponent(cat)}`}>{cat}</Link>
                  </li>
                ))
              ) : (
                <li><Link to="/products">All Products</Link></li>
              )}
            </ul>
          </div>

          <div>
            <h4>Customer Service</h4>
            <ul className="footer-links">
              <li><Link to="/products">Browse Products</Link></li>
              <li><Link to="/cart">Your Cart</Link></li>
              {user && <li><Link to="/account">Order History</Link></li>}
            </ul>
          </div>

          <div>
            <h4>My Account</h4>
            <ul className="footer-links">
              {user ? (
                <>
                  <li><Link to="/account">My Account</Link></li>
                  {user.role === 'admin' && <li><Link to="/admin">Admin Dashboard</Link></li>}
                </>
              ) : (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4>Orders &amp; Returns</h4>
            <ul className="footer-links">
              <li><span>Track orders from My Account</span></li>
              <li><span>Order status updates in real time</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ShopNova. All rights reserved.</span>
          <span>Built with React &amp; Express</span>
        </div>
      </div>
    </footer>
  );
}
