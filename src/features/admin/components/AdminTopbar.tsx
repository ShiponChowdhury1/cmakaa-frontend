export default function AdminTopbar() {
  return (
    <header
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100"
      id="admin-topbar"
    >
      <div className="flex items-center px-6 py-3">
        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-3 flex-shrink-0">
          {/* Date Filter */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#FF9C65] text-sm text-[var(--color-dark)] font-medium hover:bg-[#FFF4EC] transition-colors bg-white cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Last 30 Days
          </button>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[linear-gradient(90deg,#E57432_0%,#FF9C65_100%)] hover:opacity-95 transition-colors cursor-pointer border-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Export Data
          </button>

          {/* Profile Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:shadow-lg hover:shadow-purple-500/20 transition-all">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
