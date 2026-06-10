import { useState } from 'react';
import { Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';
import StatsCard from '../../components/StatsCard';
import { useGetAdminPardnasQuery } from '@/store/features/adminDashboard/adminDashboardApi';
import type { AdminPardna } from '@/store/features/adminDashboard/adminDashboardApi.types';

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

  const pardnas = data?.data ?? [];
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
          <table className="w-full">
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
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-[var(--color-gray-400)]">
            Showing{' '}
            <span className="font-semibold text-[var(--color-dark)]">
              {totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalItems)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-[var(--color-dark)]">{totalItems}</span>{' '}
            pardnas
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p-1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 hover:text-[var(--color-dark)] transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed"
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
                  <span key={`dots-${idx}`} className="px-1.5 text-xs font-semibold text-[var(--color-gray-400)] select-none">
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={n}
                  onClick={() => setPage(Number(n))}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 hover:text-[var(--color-dark)] transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {selectedPardna && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/40 p-4 sm:p-6 flex items-center justify-center"
          onClick={() => setSelectedPardna(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-[var(--color-dark)]">Pardna Details</h3>
                <p className="text-xs text-[var(--color-gray-400)] mt-0.5">{selectedPardna.id}</p>
              </div>
              <button
                onClick={() => setSelectedPardna(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-gray-500)] hover:text-[var(--color-dark)] hover:bg-gray-100 transition-all border-none bg-transparent cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[var(--color-gray-400)] mb-1">Name</p>
                <p className="font-semibold text-[var(--color-dark)]">{selectedPardna.name}</p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-gray-400)] mb-1">Status</p>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle[selectedPardna.status] ?? 'text-gray-500 bg-gray-100 border-gray-300'}`}>
                  {selectedPardna.status.toLowerCase()}
                </span>
              </div>

              <div>
                <p className="text-xs text-[var(--color-gray-400)] mb-1">Contribution</p>
                <p className="font-semibold text-[var(--color-dark)]">£{Number(selectedPardna.contribution).toLocaleString()}</p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-gray-400)] mb-1">Frequency</p>
                <p className="font-semibold text-[var(--color-dark)]">{selectedPardna.frequency.toLowerCase()}</p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-gray-400)] mb-1">Current Round</p>
                <p className="font-semibold text-[var(--color-dark)]">{selectedPardna.currentRound}</p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-gray-400)] mb-1">Total Rounds</p>
                <p className="font-semibold text-[var(--color-dark)]">{selectedPardna.totalRounds}</p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-gray-400)] mb-1">Participants</p>
                <p className="font-semibold text-[var(--color-dark)]">{selectedPardna._count.participants}</p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-gray-400)] mb-1">Created At</p>
                <p className="font-semibold text-[var(--color-dark)]">{selectedPardnaDate}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs text-[var(--color-gray-400)] mb-1">Banker</p>
                <p className="font-semibold text-[var(--color-dark)]">
                  {`${selectedPardna.banker.firstName} ${selectedPardna.banker.lastName}`.trim()}
                </p>
                <p className="text-xs text-[var(--color-gray-400)] mt-0.5">{selectedPardna.banker.email}</p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
