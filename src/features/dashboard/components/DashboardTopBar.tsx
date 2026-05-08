import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';

const tabs = [
  { label: 'Home',          path: '/dashboard' },
  { label: 'Diary',         path: '/dashboard/diary' },
  { label: 'Payments',      path: '/dashboard/payments' },
  { label: 'Payouts',       path: '/dashboard/payouts' },
  { label: 'Notifications', path: '/dashboard/notifications' },
  { label: 'Profile',       path: '/dashboard/profile' },
];

export default function DashboardTopBar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <header className="sticky top-16 z-40 py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="w-full overflow-hidden rounded-2xl border border-[#F0B28B] bg-white shadow-[0_10px_26px_rgba(10,20,40,0.10)]">

      
          {/* Row 2: Profile Card */}
          <div className="flex items-center justify-between px-5 py-4 sm:px-6">
            <Link to="/home" className="flex items-center gap-3 no-underline group" title="Go to Home page">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0 ring-2 ring-transparent transition-all group-hover:ring-[var(--color-primary)]/30">
                <img
                  src="https://i.pravatar.cc/48?img=68"
                  alt="John Doe"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--color-dark)] leading-tight group-hover:text-[var(--color-primary)] transition-colors">John Doe</p>
                <p className="text-xs text-[var(--color-gray-400)]">ahsanulr323@gmail.com</p>
              </div>
            </Link>
            <button
              onClick={() => navigate('/dashboard/profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer border-none transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#1B2A4A' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
          </div>

          {/* Row 3: Tabs */}
          <nav className="flex items-center gap-0 overflow-x-auto px-3 sm:px-5 scrollbar-hide">
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.path === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 no-underline whitespace-nowrap border-b-2',
                    isActive
                      ? 'text-[#E57432] border-[#E57432]'
                      : 'text-gray-500 border-transparent hover:text-[var(--color-dark)] hover:border-gray-200'
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          </div>
        </div>
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-5"
            style={{ maxWidth: 380, width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-[var(--color-dark)] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                Logout
              </h2>
              <p className="text-sm text-[var(--color-gray-500)]">Are you sure you want to logout?</p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-dark)] bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLogoutModal(false); navigate('/'); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all cursor-pointer border-none"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}