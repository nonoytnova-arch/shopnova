import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Prevent background scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  function handleLogout() {
    logout();
    close();
    navigate('/');
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link to="/" className="brand" onClick={close}>
            Shop<span>Nova</span>
          </Link>

          <SearchBar className="nav-search" />

          {/* Compact icons shown only below 900px */}
          <button className="nav-icon-btn" onClick={() => navigate('/cart')} aria-label="Cart">
            🛒{itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
          </button>
          <button
            className="nav-icon-btn"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            ☰
          </button>

          {/* Desktop nav only — the mobile drawer below is a sibling, not nested
              here, so it isn't trapped by this header's backdrop-filter (see note
              in nav-links CSS for why that matters). */}
          <nav className="nav-links">
            <Link to="/products" className="nav-link" onClick={close}>Shop</Link>
            <Link to="/cart" className="nav-link" onClick={close}>
              Cart{itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
            </Link>
            {user ? (
              <>
                <Link to="/account" className="nav-link" onClick={close}>My Account</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="nav-link" onClick={close}>Admin</Link>
                )}
                <span className="nav-user-name">Hi, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={close}>Login</Link>
                <Link to="/register" className="nav-link" onClick={close}>Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile drawer + overlay rendered as a sibling of <header>, specifically
          OUTSIDE of it. .site-header has backdrop-filter for the glass effect,
          and per the CSS spec, backdrop-filter/filter/transform on an ancestor
          becomes the containing block for position:fixed descendants — so a
          fixed drawer nested inside it gets trapped to the header's own small
          height instead of the real viewport. Keeping it as a sibling avoids
          that entirely. */}
      <div className={`nav-drawer-overlay ${open ? 'open' : ''}`} onClick={close} />
      <nav className={`nav-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="nav-drawer-header">
          <span className="brand" style={{ fontSize: 17 }}>Shop<span>Nova</span></span>
          <button className="nav-icon-btn" style={{ display: 'inline-flex' }} onClick={close} aria-label="Close menu">
            ✕
          </button>
        </div>

        <div className="nav-drawer-search">
          <SearchBar className="nav-search-mobile" onSubmitted={close} />
        </div>

        <div className="nav-drawer-section">
          <span className="nav-drawer-section-label">Shop</span>
          <Link to="/products" className="nav-drawer-link" onClick={close}>🛍️ All Products</Link>
          <Link to="/cart" className="nav-drawer-link" onClick={close}>
            🛒 Cart{itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
          </Link>
        </div>

        <div className="nav-drawer-section">
          <span className="nav-drawer-section-label">Account</span>
          {user ? (
            <>
              <Link to="/account" className="nav-drawer-link" onClick={close}>👤 My Account</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-drawer-link" onClick={close}>🛠️ Admin Dashboard</Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="nav-drawer-link" onClick={close}>🔑 Login</Link>
              <Link to="/register" className="nav-drawer-link" onClick={close}>📝 Register</Link>
            </>
          )}
        </div>

        {user && (
          <div className="nav-drawer-footer">
            <span className="nav-user-name">Signed in as {user.name}</span>
            <button onClick={handleLogout} className="btn btn-outline btn-block btn-sm mt-8">
              Logout
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
