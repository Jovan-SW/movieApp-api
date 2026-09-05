import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute — guards routes that require authentication.
 * If the user is NOT logged in, they are redirected to /login.
 * The original destination is preserved so they can be sent back after login.
 * After logout, React Router will re-render this component and redirect immediately.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While the auth state is initializing, render nothing (AuthProvider already handles this,
  // but we guard here too for any edge cases with fast navigation).
  if (loading) return null;

  if (!user) {
    // Pass the attempted URL as state so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
