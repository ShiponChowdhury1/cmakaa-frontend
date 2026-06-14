import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';
import { cn } from '@/utils/cn';
import { LayoutDashboard, Layers, Users, ShieldCheck, History } from 'lucide-react';

const adminTabs = [
  { label: 'Overview',     path: '/admin',             icon: LayoutDashboard },
  { label: 'All Pardnas',  path: '/admin/pardnas',     icon: Layers },
  { label: 'Bankers',      path: '/admin/bankers',     icon: Users },
  { label: 'KYC Review',   path: '/admin/kyc',         icon: ShieldCheck },
  { label: 'Audit Log',    path: '/admin/audit',       icon: History },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);
  const [daysFilter, setDaysFilter] = useState('30');

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Sidebar Backdrop Overlay on mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      {/* Main Content — shifts with sidebar on desktop, full-width on mobile */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen flex flex-col",
          collapsed ? "md:pl-16" : "md:pl-60"
        )}
      >
        <AdminTopbar
          daysFilter={daysFilter}
          setDaysFilter={setDaysFilter}
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />
        <main className="p-4 sm:p-6 flex-1 pb-20 md:pb-6">
          <Outlet context={{ daysFilter }} />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200/50 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-2 pb-[env(safe-area-inset-bottom)] md:hidden flex items-center justify-around h-16">
        {adminTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center flex-1 py-1 px-1.5 no-underline transition-all duration-200 select-none',
                  isActive ? 'text-[#E57432]' : 'text-gray-400 hover:text-gray-600'
                )
              }
            >
              <Icon size={18} className="mb-0.5" />
              <span className="text-[9px] font-semibold tracking-wide">{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
