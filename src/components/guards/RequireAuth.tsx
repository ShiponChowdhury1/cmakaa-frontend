import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store';

/**
 * Guard that redirects unauthenticated users to the login page.
 * Wrap any route that requires a logged-in user.
 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
