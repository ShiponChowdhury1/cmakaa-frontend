import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store';

/**
 * Guard that checks the user's KYC status and routes accordingly:
 *   - "APPROVED"  → allow through to children (dashboard)
 *   - "PENDING"   → redirect to /kyc/pending
 *   - Everything else (null, undefined, "REJECTED", etc.) → redirect to /kyc
 *
 * Admins bypass KYC entirely.
 * This guard should wrap dashboard routes (not auth or admin).
 */
export default function RequireKyc({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Admins skip KYC check entirely
  if (user?.role === 'ADMIN') {
    return <>{children}</>;
  }

  const kycStatus = user?.kycStatus;

  // Only APPROVED users can access the dashboard
  if (kycStatus === 'APPROVED') {
    return <>{children}</>;
  }

  // PENDING → show waiting screen
  if (kycStatus === 'PENDING') {
    return <Navigate to="/kyc/pending" replace />;
  }

  // Everything else (null, undefined, REJECTED, etc.) → KYC submit form
  return <Navigate to="/kyc" replace />;
}
