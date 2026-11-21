import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="code">404</div>
      <h2>Page not found</h2>
      <p className="text-muted">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary mt-16">Back to Home</Link>
    </div>
  );
}
