import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import navbarLogo from '@/assets/logos/navbarLogo.svg';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/features/auth/authSlice';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/auth/login', { replace: true });
  };

  const displayName = user
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : 'User';
  const displayEmail = user?.email || '';
  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-[#FFEEE4]/95 backdrop-blur-lg"
      style={{
        borderBottom: '1px solid',
        borderImageSource: 'linear-gradient(90deg, #E57432 0%, #FF9C65 100%)',
        borderImageSlice: 1,
      }}
      id="navbar"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center no-underline">
            <img src={navbarLogo} alt="PardnaBook logo" className="h-9 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/home#features"
              className="group relative text-sm font-medium text-[var(--color-gray-500)] hover:text-[var(--color-primary)] transition-colors no-underline py-1"
            >
              Features
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
            </a>
            <a
              href="/home#features"
              className="group relative text-sm font-medium text-[var(--color-gray-500)] hover:text-[var(--color-primary)] transition-colors no-underline py-1"
            >
              Banker Needs
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
            </a>
            <a
              href="/home#testimonials"
              className="group relative text-sm font-medium text-[var(--color-gray-500)] hover:text-[var(--color-primary)] transition-colors no-underline py-1"
            >
              Trust
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
            </a>
          </div>

          {/* Desktop CTA / Profile */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              /* ── Logged-in: Profile dropdown ── */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-1 rounded-xl hover:bg-white/50 transition-colors"
                >
                  {/* Avatar */}
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={displayName}
                      className="w-9 h-9 rounded-full object-cover border-2 border-[var(--color-primary)]/30"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white text-sm font-bold">
                      {initials}
                    </div>
                  )}
                  {/* Name */}
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-[var(--color-dark)] leading-tight m-0">
                      {displayName}
                    </p>
                    <p className="text-xs text-[var(--color-gray-400)] leading-tight m-0">
                      {displayEmail}
                    </p>
                  </div>
                  {/* Chevron */}
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`text-[var(--color-gray-400)] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in-down z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-semibold text-[var(--color-dark)] m-0">{displayName}</p>
                      <p className="text-xs text-[var(--color-gray-400)] m-0 mt-0.5">{displayEmail}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-gray-500)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-dark)] transition-colors no-underline"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={16} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full border-none bg-transparent cursor-pointer text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Logged-out: Login + Get Started ── */
              <>
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-[var(--color-gray-500)] hover:text-[var(--color-primary)] transition-colors no-underline"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all no-underline"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-fade-in-down">
            <div className="flex flex-col gap-3">
              <a href="/home#features" className="text-sm font-medium text-[var(--color-gray-500)] hover:text-[var(--color-primary)] px-2 py-2 no-underline" onClick={() => setMobileOpen(false)}>Features</a>
              <a href="/home#how-it-works" className="text-sm font-medium text-[var(--color-gray-500)] hover:text-[var(--color-primary)] px-2 py-2 no-underline" onClick={() => setMobileOpen(false)}>How it Works</a>
              <a href="/home#testimonials" className="text-sm font-medium text-[var(--color-gray-500)] hover:text-[var(--color-primary)] px-2 py-2 no-underline" onClick={() => setMobileOpen(false)}>Trust</a>

              {isAuthenticated && user ? (
                /* ── Mobile: Logged-in ── */
                <>
                  <div className="flex items-center gap-3 px-2 py-3 border-t border-gray-100 mt-1">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={displayName} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-primary)]/30" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-dark)] m-0">{displayName}</p>
                      <p className="text-xs text-[var(--color-gray-400)] m-0">{displayEmail}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-red-500 border border-red-200 px-5 py-2.5 rounded-lg bg-transparent cursor-pointer hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                /* ── Mobile: Logged-out ── */
                <>
                  <Link
                    to="/auth/login"
                    className="text-sm font-medium text-[var(--color-primary)] border border-[var(--color-primary)]/30 px-5 py-2.5 rounded-lg text-center no-underline hover:bg-[var(--color-primary)]/5 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] px-5 py-2.5 rounded-lg text-center no-underline"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
