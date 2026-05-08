import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import StatsCard from '../../components/StatsCard';

// ─── Data ─────────────────────────────────────────────────────────────────────

type LogType = 'payment' | 'payout' | 'status' | 'admin' | 'lifecycle' | 'kyc' | 'trust' | 'auth';

interface AuditLog {
  id: number;
  time: string;
  user: string;
  action: string;
  target: string;
  type: LogType;
  isSystem?: boolean;
}

const LOGS: AuditLog[] = [
  { id:  1, time: '2026-04-15 09:12', user: 'Sarah J.',  action: 'Recorded payment',        target: 'Family Monthly — Grace M.',         type: 'payment'   },
  { id:  2, time: '2026-04-15 08:45', user: 'System',    action: 'Marked payment overdue',   target: 'Community Build — Participant #4',  type: 'status',   isSystem: true },
  { id:  3, time: '2026-04-14 17:30', user: 'Admin',     action: 'Suspended user',           target: 'James King',                        type: 'admin'     },
  { id:  4, time: '2026-04-14 16:00', user: 'Mike T.',   action: 'Completed cycle',          target: 'Summer Holiday Fund',               type: 'lifecycle' },
  { id:  5, time: '2026-04-14 14:20', user: 'Donna R.',  action: 'Created pardna',           target: 'Community Build',                   type: 'lifecycle' },
  { id:  6, time: '2026-04-14 10:00', user: 'Sarah J.',  action: 'Recorded payout',          target: 'Work Friends Savings — David K.',   type: 'payout'    },
  { id:  7, time: '2026-04-13 12:15', user: 'System',    action: 'Trust score updated',      target: 'Grace M. → 45',                    type: 'trust',    isSystem: true },
  { id:  8, time: '2026-04-13 11:00', user: 'Admin',     action: 'KYC Approved',             target: 'Michael Harris',                    type: 'kyc'       },
  { id:  9, time: '2026-04-13 09:30', user: 'Hassan T.', action: 'Recorded payment',         target: 'Work Friends Savings — Tomi B.',    type: 'payment'   },
  { id: 10, time: '2026-04-12 17:00', user: 'System',    action: 'Pardna closed',            target: 'Youth Club Savings',                type: 'lifecycle', isSystem: true },
  { id: 11, time: '2026-04-12 14:40', user: 'Admin',     action: 'KYC Rejected',             target: 'Kevin Stewart',                     type: 'kyc'       },
  { id: 12, time: '2026-04-12 11:20', user: 'Nathan H.', action: 'Recorded payment',         target: 'Summer Holiday Fund — Marcus B.',   type: 'payment'   },
  { id: 13, time: '2026-04-11 16:55', user: 'System',    action: 'Marked payment overdue',   target: 'Business Starter — Kevin S.',       type: 'status',   isSystem: true },
  { id: 14, time: '2026-04-11 14:00', user: 'Admin',     action: 'New banker registered',    target: 'Paul M.',                           type: 'admin'     },
  { id: 15, time: '2026-04-11 10:30', user: 'Ngozi E.',  action: 'Recorded payout',          target: 'Community Build — Maya W.',         type: 'payout'    },
  { id: 16, time: '2026-04-10 15:45', user: 'System',    action: 'Trust score updated',      target: 'James K. → 72',                    type: 'trust',    isSystem: true },
  { id: 17, time: '2026-04-10 13:10', user: 'Admin',     action: 'Settings updated',         target: 'Notification Preferences',          type: 'admin'     },
  { id: 18, time: '2026-04-10 09:00', user: 'Andrea C.', action: 'Created pardna',           target: 'Wedding Savings',                   type: 'lifecycle' },
  { id: 19, time: '2026-04-09 16:30', user: 'Paul M.',   action: 'Recorded payment',         target: 'Business Starter — Kevin S.',       type: 'payment'   },
  { id: 20, time: '2026-04-09 11:00', user: 'Admin',     action: 'User unsuspended',         target: 'James King',                        type: 'admin'     },
];

// ─── Badge styles ──────────────────────────────────────────────────────────────

const typeMeta: Record<LogType, { label: string; cls: string }> = {
  payment:   { label: 'payment',   cls: 'text-amber-700  bg-amber-50  border-amber-200'   },
  payout:    { label: 'payout',    cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  status:    { label: 'status',    cls: 'text-orange-600 bg-orange-50 border-orange-200'  },
  admin:     { label: 'admin',     cls: 'text-red-600    bg-red-50    border-red-200'     },
  lifecycle: { label: 'lifecycle', cls: 'text-sky-600    bg-sky-50    border-sky-200'     },
  kyc:       { label: 'kyc',       cls: 'text-violet-600 bg-violet-50 border-violet-200'  },
  trust:     { label: 'trust',     cls: 'text-gray-500   bg-gray-100  border-gray-300'    },
  auth:      { label: 'auth',      cls: 'text-blue-600   bg-blue-50   border-blue-200'    },
};

// ─── Stats ─────────────────────────────────────────────────────────────────────

const paymentCount   = LOGS.filter(l => l.type === 'payment' || l.type === 'payout').length;
const adminCount     = LOGS.filter(l => l.type === 'admin').length;
const kycCount       = LOGS.filter(l => l.type === 'kyc').length;

const stats = [
  {
    label: 'Total Events', value: String(LOGS.length), iconBg: 'bg-purple-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  },
  {
    label: 'Payments & Payouts', value: String(paymentCount), iconBg: 'bg-emerald-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  },
  {
    label: 'Admin Actions', value: String(adminCount), iconBg: 'bg-red-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  },
  {
    label: 'KYC Events', value: String(kycCount), iconBg: 'bg-blue-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M9 12l2 2 4-4"/><path d="M12 2a10 10 0 110 20 10 10 0 010-20z"/></svg>,
  },
];

const PAGE_SIZE = 10;

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [page,   setPage]   = useState(1);

  const filtered   = LOGS.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.user.toLowerCase().includes(search.toLowerCase())   ||
    l.target.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Audit Log
        </h1>
        <p className="text-sm text-[var(--color-gray-400)] mt-0.5">{LOGS.length} total events recorded</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map(s => <StatsCard key={s.label} {...s} />)}
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]" />
        <input
          type="text"
          placeholder="Search audit..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-[var(--color-gray-400)] uppercase tracking-wider px-5 py-3 w-40">Time</th>
                <th className="text-left text-xs font-semibold text-[var(--color-gray-400)] uppercase tracking-wider px-5 py-3">User</th>
                <th className="text-left text-xs font-semibold text-[var(--color-gray-400)] uppercase tracking-wider px-5 py-3">Action</th>
                <th className="text-left text-xs font-semibold text-[var(--color-primary)]  uppercase tracking-wider px-5 py-3">Target</th>
                <th className="text-left text-xs font-semibold text-[var(--color-gray-400)] uppercase tracking-wider px-5 py-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(log => {
                const meta = typeMeta[log.type];
                return (
                  <tr key={log.id} className="border-b border-gray-50 last:border-0 hover:bg-orange-50/20 transition-colors">
                    {/* Time */}
                    <td className="px-5 py-3.5 text-xs text-[var(--color-gray-400)] font-mono whitespace-nowrap">{log.time}</td>

                    {/* User */}
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-semibold ${
                        log.isSystem
                          ? 'text-[var(--color-dark)]'
                          : log.user === 'Admin'
                          ? 'text-[var(--color-primary)]'
                          : 'text-[var(--color-primary)]'
                      }`}>{log.user}</span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-sm font-semibold text-[var(--color-dark)]">{log.action}</td>

                    {/* Target */}
                    <td className="px-5 py-3.5">
                      <span className={`text-sm ${
                        log.target.includes('—') || log.target.includes('→')
                          ? 'text-[var(--color-primary)]'
                          : 'text-[var(--color-gray-500)]'
                      }`}>{log.target}</span>
                    </td>

                    {/* Type badge */}
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.cls}`}>
                        {meta.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-[var(--color-gray-400)]">
            Showing{' '}
            <span className="font-semibold text-[var(--color-dark)]">
              {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-[var(--color-dark)]">{filtered.length}</span>{' '}
            events
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p-1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 hover:text-[var(--color-dark)] transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
                  n === page ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-gray-500)] hover:bg-gray-100'
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p+1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 hover:text-[var(--color-dark)] transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
