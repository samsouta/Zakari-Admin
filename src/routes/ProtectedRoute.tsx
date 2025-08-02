// routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export default function ProtectedRoute({
  children,

}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  // ❌ Not logged in?
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  

  // ✅ Passed all checks
  return children;
}
