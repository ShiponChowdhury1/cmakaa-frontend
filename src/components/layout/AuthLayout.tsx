import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F3]">
      {/* Navbar */}
      <Navbar />

      {/* Main Content — centered card */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 pt-24 pb-12">
        <div className="w-full max-w-[520px] animate-fade-in-up">
          {/* Logo + Brand */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF9C65] to-[#E57432] flex items-center justify-center shadow-md mb-3">
              <span className="text-white text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>P</span>
            </div>
            <span
              className="text-xl font-bold text-[var(--color-dark)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              PardnaBook
            </span>
          </div>

          {/* Page content via Outlet */}
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
