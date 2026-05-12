import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import StatsCard from '../../components/StatsCard';
import { useGetAdminAuditLogsQuery } from '@/store/features/adminDashboard/adminDashboardApi';
import type { AdminAuditLog } from '@/store/features/adminDashboard/adminDashboardApi.types';

type LogType = 'payment' | 'payout' | 'status' | 'admin' | 'lifecycle' | 'kyc' | 'trust' | 'auth';

interface AuditLog {
  id: string;
  time: string;
  user: string;
  action: string;
  target: string;
  type: LogType;
  isSystem?: boolean;
}

// Map API actions to log types
const getLogType = (action: string): LogType => {
  if (action.includes('PARTICIPANT')) return 'lifecycle';
  if (action.includes('PARDNA')) return 'lifecycle';
  if (action.includes('PAYMENT')) return 'payment';
  if (action.includes('PAYOUT')) return 'payout';
  if (action.includes('KYC')) return 'kyc';
  if (action.includes('TRUST')) return 'trust';
  if (action.includes('USER')) return 'admin';
  return 'auth';
};

// Map API audit log to display format
const mapToAuditLog = (apiLog: AdminAuditLog): AuditLog => {
  const metadata = apiLog.metadata as Record<string, unknown>;
  const userInitials = `${apiLog.actor.firstName?.charAt(0) || 'A'}${apiLog.actor.lastName?.charAt(0) || 'A'}`;
  const userName = `${apiLog.actor.firstName} ${apiLog.actor.lastName}`.trim();
  
  let target = '';
  if (metadata?.type === 'participant_join') {
    target = `${metadata.fullName} joined`;
  } else if (metadata?.type === 'pardna_creation') {
    target = `${metadata.name}`;
  } else {
    target = apiLog.entityType;
  }

  return {
    id: apiLog.id,
    time: new Date(apiLog.createdAt).toLocaleDateString('en-GB') + ' ' + new Date(apiLog.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    user: userName || userInitials,
    action: apiLog.action.split('_').join(' '),
    target,
    type: getLogType(apiLog.action),
    isSystem: apiLog.actor.firstName === 'System',
  };
};

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

const PAGE_SIZE = 10;

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Fetch audit logs from API
  const { data: response, isLoading, isError } = useGetAdminAuditLogsQuery({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
  });

  const auditLogs = (response?.data ?? []).map(mapToAuditLog);
  const pagination = response?.meta.pagination;
  const totalItems = pagination?.total ?? auditLogs.length;
  const totalPages = pagination?.totalPages ?? 1;

  // Calculate stats from logs
  const paymentCount = auditLogs.filter(l => l.type === 'payment' || l.type === 'payout').length;
  const adminCount = auditLogs.filter(l => l.type === 'admin').length;
  const kycCount = auditLogs.filter(l => l.type === 'kyc').length;

  const stats = [
    {
      label: 'Total Events', value: String(totalItems), iconBg: 'bg-purple-50',
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

  const paginated = auditLogs.slice(0, PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
          Loading audit logs...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Failed to load audit logs.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Audit Log
        </h1>
        <p className="text-sm text-[var(--color-gray-400)] mt-0.5">{totalItems} total events recorded</p>
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
                          : 'text-[var(--color-primary)]'
                      }`}>{log.user}</span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-sm font-semibold text-[var(--color-dark)]">{log.action}</td>

                    {/* Target */}
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-[var(--color-gray-500)]">{log.target}</span>
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
              {Math.min((page-1)*PAGE_SIZE+1, totalItems)}–{Math.min(page*PAGE_SIZE, totalItems)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-[var(--color-dark)]">{totalItems}</span>{' '}
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
