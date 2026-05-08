import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

type LogType = 'payment' | 'payout' | 'collection' | 'status' | 'lifecycle';

interface AuditLog {
  id: number;
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

const typeMeta: Record<LogType, { label: string; cls: string; icon: string }> = {
  payment: { label: 'Payment', cls: 'bg-amber-50 border-amber-200 text-amber-700', icon: '💳' },
  payout: { label: 'Payout', cls: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: '💰' },
  collection: { label: 'Collection', cls: 'bg-orange-50 border-orange-200 text-orange-700', icon: '📦' },
  status: { label: 'Status', cls: 'bg-red-50 border-red-200 text-red-700', icon: '⚠️' },
  lifecycle: { label: 'Lifecycle', cls: 'bg-sky-50 border-sky-200 text-sky-700', icon: '📝' },
};

const PAGE_SIZE = 10;

export default function AuditLogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = LOGS.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.pardna.toLowerCase().includes(search.toLowerCase()) ||
      l.participant?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Audit Log
        </h1>
      </div>

      {/* Info text */}
      <p className="text-xs text-[var(--color-gray-400)]">{filtered.length} entries</p>

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

      {/* Log entries */}
      <div className="space-y-3">
        {paginated.map((log) => (
          <div key={log.id} className={`rounded-xl border px-4 py-3 ${typeMeta[log.type].cls}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{typeMeta[log.type].icon}</span>
                  <p className="font-semibold text-sm">{log.action}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/50">
                    {typeMeta[log.type].label}
                  </span>
                </div>
                <p className="text-xs">
                  <span className="font-medium">{log.pardna}</span>
                  {log.participant && <span> — {log.participant}</span>}
                  {log.amount && <span> · £{log.amount}</span>}
                </p>
              </div>
              <span className="text-xs text-current opacity-60 shrink-0 whitespace-nowrap">{log.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
