import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      {/* Main Content — shifts with sidebar */}
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      >
        <AdminTopbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
