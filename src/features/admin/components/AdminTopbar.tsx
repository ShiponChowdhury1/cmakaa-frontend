import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/features/auth/authSlice';
import { useServerLogoutMutation } from '@/store/features/auth/authApi';
import { baseApi } from '@/store/api/baseApi';
import {
  useGetAdminPlatformStatsQuery,
  useGetAdminBankersQuery,
  useGetAdminPardnasQuery,
  useGetAdminAuditLogsQuery,
} from '@/store/features/adminDashboard/adminDashboardApi';
import { PdfReport } from './PdfReport';
import { isDateWithinDays } from '@/utils/dateFilter';

interface AdminTopbarProps {
  daysFilter: string;
  setDaysFilter: (days: string) => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function AdminTopbar({ daysFilter, setDaysFilter, sidebarCollapsed, onToggleSidebar }: AdminTopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [reportType, setReportType] = useState<'stats' | 'bankers' | 'pardnas' | 'audit'>('stats');
  const [modalDaysFilter, setModalDaysFilter] = useState(daysFilter);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [serverLogout] = useServerLogoutMutation();
  const { user } = useAppSelector((s) => s.auth);

  // Fetch all potential data for report exports
  const { data: statsResponse } = useGetAdminPlatformStatsQuery();
  const { data: bankersResponse } = useGetAdminBankersQuery({ limit: 100 });
  const { data: pardnasResponse } = useGetAdminPardnasQuery({ limit: 100 });
  const { data: auditResponse } = useGetAdminAuditLogsQuery({ limit: 100 });

  // Sync modal date filter with topbar date filter
  useEffect(() => {
    setModalDaysFilter(daysFilter);
  }, [daysFilter]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node)) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setShowLogoutModal(false);
    try {
      await serverLogout().unwrap();
    } catch {
      // Even if server logout fails, clear local state
    }
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    navigate('/auth/login', { replace: true });
  };

  const displayName = user
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : 'Admin';
  const displayEmail = user?.email || '';
  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'A';

  const filterOptions = [
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' },
  ];

  const currentFilterLabel = filterOptions.find(o => o.value === daysFilter)?.label || 'Last 30 Days';

  const getExportData = () => {
    switch (reportType) {
      case 'stats': {
        const stats = statsResponse?.data;
        return [
          { label: 'Total Bankers', value: String(stats?.totalBankers || 0) },
          { label: 'Total Participants', value: String(stats?.totalParticipants || 0) },
          { label: 'Total Pardna Groups', value: String(stats?.totalPardnas || 0) },
          { label: 'Active Pardna Groups', value: String(stats?.activePardnas || 0) },
          { label: 'Pending KYC Review', value: String(stats?.pendingKyc || 0) },
          { label: 'Total Confirmed Payouts', value: String(stats?.totalConfirmedPayouts || 0) },
        ];
      }
      case 'bankers': {
        const dataArr = bankersResponse?.data || [];
        return dataArr
          .filter(b => isDateWithinDays(b.createdAt, modalDaysFilter, dataArr.map(x => x.createdAt)))
          .map(b => ({
            name: `${b.firstName || ''} ${b.lastName || ''}`.trim(),
            email: b.email,
            pardnas: String(b._count?.pardnas || 0),
            joined: new Date(b.createdAt).toLocaleDateString(),
          }));
      }
      case 'pardnas': {
        const dataArr = pardnasResponse?.data || [];
        return dataArr
          .filter(p => isDateWithinDays(p.createdAt, modalDaysFilter, dataArr.map(x => x.createdAt)))
          .map(p => ({
            name: p.name,
            banker: `${p.banker?.firstName || ''} ${p.banker?.lastName || ''}`.trim(),
            members: String(p._count?.participants || 0),
            collected: `£${Number(p.contribution).toLocaleString()}`,
            status: p.status,
          }));
      }
      case 'audit': {
        const dataArr = auditResponse?.data || [];
        return dataArr
          .filter(l => isDateWithinDays(l.createdAt, modalDaysFilter, dataArr.map(x => x.createdAt)))
          .map(l => ({
            timestamp: new Date(l.createdAt).toLocaleString(),
            actor: `${l.actor?.firstName || ''} ${l.actor?.lastName || ''} (${l.actor?.email || ''})`.trim(),
            action: l.action,
            entity: `${l.entityType} (ID: ${l.entityId})`,
          }));
      }
      default:
        return [];
    }
  };

  const getReportTitle = () => {
    const names = {
      stats: 'Platform Stats Summary',
      bankers: 'Bankers Registry',
      pardnas: 'Pardna Groups Overview',
      audit: 'Platform Audit Logs',
    };
    return names[reportType];
  };

  const getDateRangeLabel = () => {
    return filterOptions.find(o => o.value === modalDaysFilter)?.label || 'All Time';
  };

  return (
    <>
      <header
        className="sticky top-0 z-35 bg-white/80 backdrop-blur-lg border-b border-gray-100"
        id="admin-topbar"
      >
        <div className="flex items-center px-4 sm:px-6 py-3">
          {/* Mobile Sidebar Hamburger Toggle */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer mr-3"
            title="Toggle Sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarCollapsed ? (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              ) : (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              )}
            </svg>
          </button>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Date Filter Dropdown */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-[#FF9C65] text-xs sm:text-sm text-[var(--color-dark)] font-medium hover:bg-[#FFF4EC] transition-colors bg-white cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {currentFilterLabel}
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`text-[var(--color-gray-400)] transition-transform duration-200 ml-1 ${filterDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {filterDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setDaysFilter(opt.value);
                        setFilterDropdownOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-2 text-sm transition-colors border-none bg-transparent cursor-pointer text-left ${
                        daysFilter === opt.value
                          ? 'text-[var(--color-accent)] font-semibold bg-[var(--color-primary)]/5'
                          : 'text-[var(--color-gray-500)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-dark)]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[linear-gradient(90deg,#E57432_0%,#FF9C65_100%)] hover:opacity-95 transition-colors cursor-pointer border-none shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <span className="hidden sm:inline">Export Data</span>
              <span className="sm:hidden">Export</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-1.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={displayName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-[var(--color-primary)]/30"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                )}
                
                {/* Name */}
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-[var(--color-dark)] leading-tight m-0">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-[var(--color-primary)] font-medium leading-tight m-0 mt-0.5 uppercase tracking-wider">
                    {user?.role || 'Admin'}
                  </p>
                </div>

                {/* Chevron */}
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`text-[var(--color-gray-400)] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Dropdown Menu */}
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Banker Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full border-none bg-transparent cursor-pointer text-left font-medium"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Export Data Modal ── */}
      {showExportModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-5 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-[var(--color-dark)] flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export PDF Report
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
              {/* Report Type Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Report Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'stats', label: 'Platform Stats', desc: 'Overview metrics' },
                    { id: 'bankers', label: 'Bankers Registry', desc: 'Bankers registration info' },
                    { id: 'pardnas', label: 'Pardna Groups', desc: 'Active and completed groups' },
                    { id: 'audit', label: 'Audit Logs', desc: 'Platform activity log' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setReportType(item.id as any)}
                      className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        reportType === item.id
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-semibold text-[var(--color-dark)]">{item.label}</span>
                      <span className="text-xs text-gray-400 mt-1">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Filter Selection inside Modal */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Date Range Filter
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: '7', label: 'Last 7 Days' },
                    { value: '30', label: 'Last 30 Days' },
                    { value: '90', label: 'Last 90 Days' },
                    { value: 'all', label: 'All Time' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setModalDaysFilter(opt.value)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        modalDaysFilter === opt.value
                          ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-orange-50/50'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Summary */}
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Total records to export:</span>
                <span className="font-semibold text-[var(--color-dark)]">{getExportData().length}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Filter active:</span>
                <span className="font-semibold text-[var(--color-accent)]">{getDateRangeLabel()}</span>
              </div>
            </div>

            {/* Actions / Download Button */}
            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all cursor-pointer border-none bg-transparent"
              >
                Close
              </button>
              
              <PDFDownloadLink
                document={
                  <PdfReport
                    title={getReportTitle()}
                    dateRange={getDateRangeLabel()}
                    data={getExportData()}
                    type={reportType}
                  />
                }
                fileName={`PardnaBook_${reportType}_report_${modalDaysFilter}.pdf`}
                className="no-underline"
              >
                {({ loading }) => (
                  <button
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[linear-gradient(90deg,#E57432_0%,#FF9C65_100%)] hover:opacity-95 transition-all cursor-pointer border-none shadow-md disabled:opacity-50"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    {loading ? 'Preparing PDF...' : 'Download PDF'}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      )}

      {/* ── Logout Confirmation Modal ── */}
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
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all cursor-pointer border-none outline-none shadow-md"
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
