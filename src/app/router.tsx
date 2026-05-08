import { createBrowserRouter } from 'react-router-dom';

// Splash
import SplashScreen from '@/features/splash/SplashScreen';

// Landing
import LandingPage from '@/features/landing/LandingPage';

// Auth
import AuthLayout from '@/components/layout/AuthLayout';
import LoginPage from '@/features/auth/LoginPage';
import RegisterPage from '@/features/auth/RegisterPage';
import VerifyOtpPage from '@/features/auth/VerifyOtpPage';
import ForgotPasswordPage from '@/features/auth/ForgotPasswordPage';
import CheckInboxPage from '@/features/auth/CheckInboxPage';
import NewPasswordPage from '@/features/auth/NewPasswordPage';

// Admin
import AdminLayout from '@/features/admin/AdminLayout';
import OverviewPage     from '@/features/admin/pages/overview';
import AnalyticsPage    from '@/features/admin/pages/analytics';
import AllPardnasPage   from '@/features/admin/pages/pardnas';
import BankersPage      from '@/features/admin/pages/bankers';
import ParticipantsPage from '@/features/admin/pages/participants';
import KycReviewPage    from '@/features/admin/pages/kyc';
import AuditLogPage     from '@/features/admin/pages/audit';
import SettingsPage     from '@/features/admin/pages/settings';

// User Dashboard
import DashboardLayout    from '@/features/dashboard/DashboardLayout';
import HomePage            from '@/features/dashboard/pages/home';
import DiaryPage           from '@/features/dashboard/pages/diary';
import PaymentsPage        from '@/features/dashboard/pages/payments';
import PayoutsPage         from '@/features/dashboard/pages/payouts';
import NotificationsPage   from '@/features/dashboard/pages/notifications';
import ProfilePage         from '@/features/dashboard/pages/profile';
import GuidePage           from '@/features/dashboard/pages/guide';
import NewPardnaPage       from '@/features/dashboard/pages/new-pardna';
import DashboardAuditPage  from '@/features/dashboard/pages/audit';
import PardnaDetailPage    from '@/features/dashboard/pages/pardna-detail';


export const router = createBrowserRouter([
  // Splash Screen (entry point)
  {
    path: '/',
    element: <SplashScreen />,
  },

  // Landing Page
  {
    path: '/home',
    element: <LandingPage />,
  },

  // Authentication
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'verify-otp',
        element: <VerifyOtpPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'check-inbox',
        element: <CheckInboxPage />,
      },
      {
        path: 'new-password',
        element: <NewPasswordPage />,
      },
    ],
  },

  // Admin Dashboard
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'pardnas',
        element: <AllPardnasPage />,
      },
      {
        path: 'bankers',
        element: <BankersPage />,
      },
      {
        path: 'participants',
        element: <ParticipantsPage />,
      },
      {
        path: 'kyc',
        element: <KycReviewPage />,
      },
      {
        path: 'audit',
        element: <AuditLogPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },

  // User Dashboard
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'diary',
        element: <DiaryPage />,
      },
      {
        path: 'payments',
        element: <PaymentsPage />,
      },
      {
        path: 'payouts',
        element: <PayoutsPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'guide',
        element: <GuidePage />,
      },
      {
        path: 'audit',
        element: <DashboardAuditPage />,
      },
      {
        path: 'pardnas/new',
        element: <NewPardnaPage />,
      },
      {
        path: 'pardnas/:id',
        element: <PardnaDetailPage />,
      },
    ],
  },
]);
