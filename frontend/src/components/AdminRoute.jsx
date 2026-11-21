import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap any route element that requires an admin role.
// A logged-out user is sent to /login; a logged-in non-admin is sent home.
// This is a UI convenience only — every admin API route also re-verifies
// the role server-side (see backend/middleware/authMiddleware.js verifyAdmin),
// so this check alone is never the real security boundary.
export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
