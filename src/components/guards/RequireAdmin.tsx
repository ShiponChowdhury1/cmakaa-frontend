import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store';

/**
 * Guard that only allows ADMIN users to access the wrapped routes.
 * Non-admin users are redirected to the user dashboard.
 * Unauthenticated users are redirected to login.
 */
export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Backend role enum: ADMIN, BANKER
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
