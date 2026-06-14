import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CreditCard, Coins, Package, AlertTriangle, FileText, ArrowLeft } from 'lucide-react';
import { useGetAdminAuditLogsQuery } from '@/store/features/adminDashboard/adminDashboardApi';

type LogType = 'payment' | 'payout' | 'collection' | 'status' | 'lifecycle';

interface AuditLog {
  id: string | number;
  time: string;
  action: string;
  pardna: string;
  participant?: string;
  type: LogType;
  amount?: number;
}

const LOGS: AuditLog[] = [
  { id: 1, time: '2026-05-05 16:00', action: 'Recorded payment', pardna: 'Family Monthly', participant: 'Ama O.', amount: 200, type: 'payment' },
  { id: 2, time: '2026-05-05 16:00', action: 'Recorded payment', pardna: 'Work Friends Savings', participant: 'Lisa A.', amount: 100, type: 'payment' },
  { id: 3, time: '2026-05-05 16:00', action: 'Recorded payment', pardna: 'Church Building Fund', participant: 'Nadia F.', amount: 250, type: 'payment' },
  { id: 4, time: '2026-05-05 16:00', action: 'Recorded payment', pardna: 'Sisters Circle', participant: 'Abena M.', amount: 150, type: 'payment' },
  { id: 5, time: '2026-05-05 16:00', action: 'Recorded payment', pardna: 'Market Traders', participant: 'Patrick L.', amount: 300, type: 'payment' },
  { id: 6, time: '2026-05-05 16:00', action: 'Recorded payment', pardna: 'Back to School', participant: 'Lisa A.', amount: 100, type: 'payment' },
  { id: 7, time: '2026-05-04 14:30', action: 'Recorded payout', pardna: 'Family Monthly', participant: 'David K.', amount: 1600, type: 'payout' },
  { id: 8, time: '2026-05-03 11:00', action: 'Collection day', pardna: 'Family Monthly', amount: 1600, type: 'collection' },
  { id: 9, time: '2026-05-02 09:45', action: 'Marked payment overdue', pardna: 'Work Friends Savings', participant: 'Kwame B.', type: 'status' },
  { id: 10, time: '2026-05-01 17:20', action: 'Cycle completed', pardna: 'Church Building Fund', type: 'lifecycle' },
];

const typeMeta: Record<LogType, { label: string; cls: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  payment: { label: 'Payment', cls: 'bg-amber-50 border-amber-200 text-amber-700', icon: CreditCard },
  payout: { label: 'Payout', cls: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: Coins },
  collection: { label: 'Collection', cls: 'bg-orange-50 border-orange-200 text-orange-700', icon: Package },
  status: { label: 'Status', cls: 'bg-red-50 border-red-200 text-red-700', icon: AlertTriangle },
  lifecycle: { label: 'Lifecycle', cls: 'bg-sky-50 border-sky-200 text-sky-700', icon: FileText },
};

const PAGE_SIZE = 10;

const mapToDashboardLog = (apiLog: any): AuditLog => {
  const metadata = (apiLog.metadata as Record<string, unknown>) || {};
  
  let type: LogType = 'lifecycle';
  const actionLower = (apiLog.action || '').toLowerCase();
  
  if (actionLower.includes('payment')) {
    type = 'payment';
  } else if (actionLower.includes('payout')) {
    type = 'payout';
  } else if (actionLower.includes('collection')) {
    type = 'collection';
  } else if (actionLower.includes('status') || actionLower.includes('overdue')) {
    type = 'status';
  }

  const actionText = apiLog.action
    ? apiLog.action.split('_').join(' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())
    : 'Unknown Action';

  const date = new Date(apiLog.createdAt);
  const formattedTime = date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const pardnaName = (metadata.pardnaName || metadata.name || apiLog.entityType || 'System').toString();
  const participantName = (metadata.participantName || metadata.fullName || undefined)?.toString();

  return {
    id: apiLog.id,
    time: formattedTime,
    action: actionText,
    pardna: pardnaName,
    participant: participantName,
    type,
    amount: metadata.amount ? Number(metadata.amount) : undefined,
  };
};

export default function AuditLogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Fetch real audit logs from Backend
  const { data: response, isLoading, error } = useGetAdminAuditLogsQuery({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
  });

  const rawLogs = response?.data || [];
  const backendLogs = rawLogs.map(mapToDashboardLog);

  // Fallback to local mock data if the API fails (e.g. 403 Forbidden on non-admin user)
  const isFallbackMode = !!error;
  const filteredMock = LOGS.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.pardna.toLowerCase().includes(search.toLowerCase()) ||
      l.participant?.toLowerCase().includes(search.toLowerCase())
  );

  const displayLogs = isFallbackMode ? filteredMock : backendLogs;
  
  const totalItems = isFallbackMode
    ? filteredMock.length
    : (response?.meta?.pagination?.total || 0);

  const totalPages = Math.max(1, isFallbackMode
    ? Math.ceil(filteredMock.length / PAGE_SIZE)
    : (response?.meta?.pagination?.totalPages || 1));

  const safeCurrentPage = Math.min(page, totalPages);

  const paginatedLogs = isFallbackMode
    ? displayLogs.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE)
    : displayLogs; // Backend already paginates

  const getPageNumbers = () => {
    const windowSize = 3;
    const chunkStart = Math.floor((safeCurrentPage - 1) / windowSize) * windowSize + 1;
    const chunkEnd = Math.min(chunkStart + windowSize - 1, totalPages);
    const pages: number[] = [];
    for (let i = chunkStart; i <= chunkEnd; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-5 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Audit Log
        </h1>
      </div>

      {/* Info text */}
      <p className="text-xs text-[var(--color-gray-400)] font-semibold">
        {totalItems} entr{totalItems !== 1 ? 'ies' : 'y'} {isFallbackMode && '(Local Mode)'}
      </p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search activity..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[var(--color-dark)] placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
        />
      </div>

      {/* Loading state */}
      {isLoading && !isFallbackMode && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-orange-200 border-t-[#E57432] animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading activity trail...</p>
        </div>
      )}

      {/* Log entries */}
      {(!isLoading || isFallbackMode) && (
        <div className="space-y-3">
          {paginatedLogs.map((log) => {
            const Icon = typeMeta[log.type]?.icon || FileText;
            const metaClass = typeMeta[log.type]?.cls || 'bg-gray-50 border-gray-200 text-gray-700';
            const metaLabel = typeMeta[log.type]?.label || 'System';

            return (
              <div key={log.id} className={`rounded-xl border px-4 py-3 transition-colors ${metaClass}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="flex items-center shrink-0">
                        <Icon size={16} />
                      </span>
                      <p className="font-bold text-sm truncate">{log.action}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/50 capitalize whitespace-nowrap">
                        {metaLabel}
                      </span>
                    </div>
                    <p className="text-xs font-semibold opacity-90 truncate">
                      <span>{log.pardna}</span>
                      {log.participant && <span> — {log.participant}</span>}
                      {log.amount !== undefined && <span> · £{log.amount.toLocaleString()}</span>}
                    </p>
                  </div>
                  <span className="text-[11px] text-current opacity-60 shrink-0 whitespace-nowrap font-medium mt-0.5">{log.time}</span>
                </div>
              </div>
            );
          })}

          {paginatedLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-4 border border-orange-100/50">
                <Search className="w-5 h-5 text-[#E57432]" />
              </div>
              <p className="text-sm font-bold text-[var(--color-dark)]">No entries found</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Try adjusting your search query to find matching activities.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1.5">
                {getPageNumbers().map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-7 sm:w-8 h-7 sm:h-8 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                      safeCurrentPage === n
                        ? 'bg-[#E57432] text-white shadow-md shadow-orange-500/20'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
