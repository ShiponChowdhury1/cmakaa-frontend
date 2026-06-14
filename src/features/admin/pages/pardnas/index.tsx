import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Eye, Search, ChevronLeft, ChevronRight, Users, Landmark, RefreshCw, DollarSign, Clock, Mail, User, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import StatsCard from '../../components/StatsCard';
import { useGetAdminPardnasQuery } from '@/store/features/adminDashboard/adminDashboardApi';
import type { AdminPardna } from '@/store/features/adminDashboard/adminDashboardApi.types';
import { isDateWithinDays } from '@/utils/dateFilter';

// ─── Status badge styles ───────────────────────────────────────────────────────

const statusStyle: Record<string, string> = {
  ACTIVE: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  COMPLETED: 'text-blue-600 bg-blue-50 border-blue-200',
  PAUSED: 'text-amber-600 bg-amber-50 border-amber-200',
  CLOSED: 'text-gray-500 bg-gray-100 border-gray-300',
};

const PAGE_SIZE = 10;

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AllPardnasPage() {
  const [search, setSearch] = useState('');
  const [page,   setPage]   = useState(1);
  const [selectedPardna, setSelectedPardna] = useState<AdminPardna | null>(null);
  const { data, isLoading, isError } = useGetAdminPardnasQuery({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
  });

  const { daysFilter } = useOutletContext<{ daysFilter: string }>();

  const rawPardnas = data?.data ?? [];
  const pardnas = rawPardnas.filter(p => isDateWithinDays(p.createdAt, daysFilter, rawPardnas.map(x => x.createdAt)));
  const pagination = data?.meta.pagination;
  const statusMeta = data?.meta.status;
  const totalItems = pagination?.total ?? pardnas.length;
  const totalPages = pagination?.totalPages ?? 1;
  const activeCount = statusMeta?.active ?? pardnas.filter((p) => p.status === 'ACTIVE').length;
  const totalContribution = statusMeta?.totalContribution ?? 0;
  const selectedPardnaDate = selectedPardna
    ? new Date(selectedPardna.createdAt).toLocaleString()
    : '-';

  const stats = [
    {
      label: 'Total Pardnas', value: String(totalItems), iconBg: 'bg-orange-50',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 7v10M12 7v10M16 7v10"/></svg>,
    },
    {
      label: 'Active', value: String(activeCount), iconBg: 'bg-emerald-50',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
    },
    {
      label: 'Total Contribution', value: `£${totalContribution.toLocaleString()}`, iconBg: 'bg-amber-50',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    },
    {
      label: 'Current Page', value: String(pagination?.page ?? page), iconBg: 'bg-red-50',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          All Pardnas
        </h1>
        <p className="text-sm text-[var(--color-gray-400)] mt-0.5">{totalItems} pardnas registered</p>
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
          placeholder="Search pardnas..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all"
        />
      </div>

      {isLoading && (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[var(--color-gray-400)]">
          Loading pardnas...
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Failed to load pardnas data.
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider px-5 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider px-5 py-3">Banker</th>
                <th className="text-left text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider px-5 py-3">Members</th>
                <th className="text-left text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider px-5 py-3">Collected</th>
                <th className="text-left text-xs font-semibold text-[var(--color-gray-400)] uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-[var(--color-gray-400)] uppercase tracking-wider px-5 py-3">Overdue</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {pardnas.map(p => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-orange-50/20 transition-colors">

                  {/* Name */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-[var(--color-primary)] cursor-pointer hover:underline">
                      {p.name}
                    </span>
                  </td>

                  {/* Banker */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-[var(--color-primary)]">{`${p.banker.firstName} ${p.banker.lastName}`.trim()}</span>
                  </td>

                  {/* Members */}
                  <td className="px-5 py-3.5 text-sm text-[var(--color-dark)] font-medium">{p._count.participants}</td>

                  {/* Collected */}
                  <td className="px-5 py-3.5 text-sm font-semibold text-[var(--color-dark)]">£{Number(p.contribution).toLocaleString()}</td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle[p.status] ?? 'text-gray-500 bg-gray-100 border-gray-300'}`}>
                      {p.status.toLowerCase()}
                    </span>
                  </td>

                  {/* Overdue */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-[var(--color-gray-400)]">—</span>
                  </td>

                  {/* View action */}
                  <td className="px-5 py-3.5">
                    <button
                      title="View pardna details"
                      onClick={() => setSelectedPardna(p)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[var(--color-dark)] hover:bg-gray-100 transition-all cursor-pointer border-none bg-transparent"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && pardnas.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-[var(--color-gray-400)]">
                    No pardnas found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-[var(--color-gray-400)] text-center sm:text-left">
            Showing{' '}
            <span className="font-semibold text-[var(--color-dark)]">
              {totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalItems)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-[var(--color-dark)]">{totalItems}</span>{' '}
            pardnas
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p-1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 hover:text-[var(--color-dark)] transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            {(() => {
              const pages: (number | string)[] = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                pages.push(1);
                if (page > 3) {
                  pages.push('...');
                }
                const start = Math.max(2, page - 1);
                const end = Math.min(totalPages - 1, page + 1);
                for (let i = start; i <= end; i++) {
                  if (!pages.includes(i)) {
                    pages.push(i);
                  }
                }
                if (page < totalPages - 2) {
                  pages.push('...');
                }
                if (!pages.includes(totalPages)) {
                  pages.push(totalPages);
                }
              }
              return pages;
            })().map((n, idx) => {
              if (n === '...') {
                return (
                  <span key={`dots-${idx}`} className="px-1 text-xs font-semibold text-[var(--color-gray-400)] select-none">
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={n}
                  onClick={() => setPage(Number(n))}
                  className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
                    n === page ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-gray-500)] hover:bg-gray-100'
                  }`}
                >
                  {n}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p+1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 hover:text-[var(--color-dark)] transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {selectedPardna && createPortal(
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPardna(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header (Dark Premium Panel) */}
            <div className="bg-slate-900 px-6 py-6 text-white flex items-center justify-between relative overflow-hidden">
              {/* Subtle pattern */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_14px]"></div>

              <div className="relative z-10 flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-xs">
                    P
                  </div>
                  <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
                    Pardna Details
                  </span>
                </div>
                <h2 className="text-xl font-extrabold tracking-tight truncate leading-tight mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {selectedPardna.name}
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  ID: {selectedPardna.id}
                </p>
              </div>

              <div className="relative z-10 shrink-0">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${
                  selectedPardna.status === 'ACTIVE' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                  selectedPardna.status === 'COMPLETED' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                  selectedPardna.status === 'PAUSED' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  'text-slate-400 bg-slate-500/10 border-slate-500/20'
                }`}>
                  {selectedPardna.status.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border-b border-slate-100">
              <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                  <DollarSign size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Contribution</p>
                  <p className="text-sm font-extrabold text-slate-900 leading-none">£{Number(selectedPardna.contribution).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Frequency</p>
                  <p className="text-sm font-extrabold text-slate-900 leading-none capitalize">{selectedPardna.frequency.toLowerCase()}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                  <RefreshCw size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Cycle Progress</p>
                  <p className="text-xs font-bold text-slate-900 leading-none">Round {selectedPardna.currentRound} / {selectedPardna.totalRounds}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                  <Users size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Participants</p>
                  <p className="text-sm font-extrabold text-slate-900 leading-none">{selectedPardna._count.participants}</p>
                </div>
              </div>
            </div>

            {/* Core details */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Pardna Details Card */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3.5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Landmark size={14} className="text-slate-400" /> Pardna Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-xs text-slate-400">Created Date</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedPardnaDate}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Cycle Configuration</span>
                      <p className="font-semibold text-slate-800 mt-0.5 capitalize">
                        {selectedPardna.frequency.toLowerCase()} payouts · {selectedPardna.totalRounds} rounds
                      </p>
                    </div>
                  </div>
                </div>

                {/* Banker Details Card */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3.5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={14} className="text-slate-400" /> Assigned Banker
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-xs text-slate-400">Full Name</span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {`${selectedPardna.banker.firstName} ${selectedPardna.banker.lastName}`.trim()}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Email Address</span>
                      <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                        <Mail size={12} className="text-slate-400" /> {selectedPardna.banker.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end rounded-b-3xl">
              <button
                onClick={() => setSelectedPardna(null)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer border-none bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all outline-none shadow-sm"
              >
                <X size={15} />
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
