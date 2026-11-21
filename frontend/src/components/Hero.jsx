import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-eyebrow">✨ New Season Arrivals</div>
        <h1>Everyday essentials, thoughtfully made.</h1>
        <p>
          Discover quality apparel, footwear and accessories at honest prices —
          picked for comfort and built to last.
        </p>
        <div className="hero-actions">
          <Link to="/products" className="btn btn-primary">Shop All Products</Link>
          <a href="#categories" className="btn btn-outline">Browse Categories</a>
        </div>
      </div>
    </section>
  );
}
