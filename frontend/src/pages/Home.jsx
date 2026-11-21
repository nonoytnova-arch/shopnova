import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Hero from '../components/Hero';
import CategoryList from '../components/CategoryList';
import ProductGrid from '../components/ProductGrid';

const BENEFITS = [
  { icon: '🚚', title: 'Free Shipping', text: 'No hidden delivery fees on any order.' },
  { icon: '🔒', title: 'Secure Checkout', text: 'Your details are encrypted and never shared.' },
  { icon: '↩️', title: 'Easy Ordering', text: 'Track every order from your account page.' },
  { icon: '💬', title: 'Real Support', text: 'Questions? We are a message away.' }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([api.getProducts({ sort: 'newest' }), api.getCategories()])
      .then(([productsData, categoriesData]) => {
        if (!active) return;
        setProducts(productsData.slice(0, 8));
        setCategories(categoriesData);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <Hero />

      <div className="container">
        <div className="promo-banner mt-16">
          🚚 Free shipping on every order — no minimum, no hidden fees.
        </div>

        {categories.length > 0 && (
          <section className="section" id="categories">
            <div className="section-header">
              <div>
                <h2>Shop by Category</h2>
                <p>Find exactly what you're looking for.</p>
              </div>
            </div>
            <CategoryList categories={categories} />
          </section>
        )}

        <section className="section">
          <div className="section-header">
            <div>
              <h2>Featured Products</h2>
              <p>Our latest additions to the store.</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <ProductGrid products={products} loading={loading} error={error} />
        </section>

        <section className="section">
          <div className="benefits-grid">
            {BENEFITS.map((b) => (
              <div key={b.title} className="benefit-tile">
                <div className="icon">{b.icon}</div>
                <h4>{b.title}</h4>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
