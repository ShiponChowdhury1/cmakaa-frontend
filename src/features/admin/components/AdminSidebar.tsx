import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import navbarLogo from '@/assets/logos/navbarLogo.svg';

const navItems = [
  {
    label: 'Overview',
    path: '/admin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    path: '/admin/analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    label: 'All Pardnas',
    path: '/admin/pardnas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M8 7v10M12 7v10M16 7v10" />
      </svg>
    ),
  },
  {
    label: 'Bankers',
    path: '/admin/bankers',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: 'Participants',
    path: '/admin/participants',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: 'KYC Review',
    path: '/admin/kyc',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 2a10 10 0 110 20 10 10 0 010-20z" />
      </svg>
    ),
  },
  {
    label: 'Audit Log',
    path: '/admin/audit',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    path: '/admin/settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
    <aside
      id="admin-sidebar"
      className="fixed left-0 top-0 bottom-0 flex flex-col bg-[var(--sidebar-bg)] text-white z-40 transition-all duration-300 ease-in-out"
      style={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
    >
      {/* Logo Header */}
      <div
        className="flex items-center border-b border-white/5"
        style={{ padding: '12px 16px', minHeight: 64, gap: 12 }}
      >
        <img
          src={navbarLogo}
          alt="PardnaBook logo"
          className="object-contain transition-all duration-300"
          style={{ height: 32, width: collapsed ? 32 : 148 }}
        />
      </div>

      {/* ── Floating circular collapse toggle on right edge ── */}
      <button
        onClick={onToggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute top-[50px] -right-4 z-50 flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-primary-light)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border-none outline-none"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-1 list-none p-0 m-0">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/admin'}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center rounded-xl text-sm font-medium transition-all duration-300 no-underline overflow-hidden',
                    collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3',
                    isActive
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-accent)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )
                }
              >
                <span className={cn(
                  "shrink-0 transition-transform duration-300",
                  "group-hover:scale-110"
                )}>
                  {item.icon}
                </span>

                {/* Label Container */}
                <div
                  className="relative transition-all duration-300 overflow-hidden"
                  style={{
                    maxWidth: collapsed ? 0 : 160,
                    opacity: collapsed ? 0 : 1,
                  }}
                >
                  <span className="whitespace-nowrap relative inline-block pb-0.5">
                    {item.label}
                    {/* Underline Indicator */}
                    <span className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-[var(--color-accent)] transition-all duration-400 ease-out rounded-full",
                      "w-0 group-hover:w-full",
                      // Keep it full if active
                      "[[aria-current='page']_&]:w-full"
                    )} />
                  </span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="px-2 py-4 border-t border-white/5">
        <button
          onClick={() => setShowLogoutModal(true)}
          title={collapsed ? 'Logout' : undefined}
          className={cn(
            'flex items-center w-full rounded-[10px] text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer bg-transparent border-none overflow-hidden',
            collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'
          )}
        >
          <span className="shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </span>
          <span
            className="whitespace-nowrap transition-all duration-300 overflow-hidden"
            style={{
              maxWidth: collapsed ? 0 : 160,
              opacity: collapsed ? 0 : 1,
            }}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>

    {/* ── Logout Confirmation Modal ── */}
    {showLogoutModal && (
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={() => setShowLogoutModal(false)}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-5 animate-scale-in"
          style={{ maxWidth: 380, width: '90%' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </div>
          {/* Text */}
          <div className="text-center">
            <h2
              className="text-lg font-bold text-[var(--color-dark)] mb-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Logout
            </h2>
            <p className="text-sm text-[var(--color-gray-500)]">
              Are you sure you want to logout?
            </p>
          </div>
          {/* Actions */}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-dark)] bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer border-none outline-none"
            >
              Cancel
            </button>
            <button
              onClick={() => { setShowLogoutModal(false); navigate('/'); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all cursor-pointer border-none outline-none shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )}
  </>);
}
