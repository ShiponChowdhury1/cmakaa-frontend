import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';
import { cn } from '@/utils/cn';

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
        <main className="p-4 sm:p-6 flex-1">
          <Outlet context={{ daysFilter }} />
        </main>
      </div>
    </div>
  );
}
