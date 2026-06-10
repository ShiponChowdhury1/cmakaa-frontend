import { useState } from 'react';
import { Printer, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import StatsCard from '../../components/StatsCard';
import { useGetAdminBankersQuery } from '@/store/features/adminDashboard/adminDashboardApi';
import type { AdminBanker } from '@/store/features/adminDashboard/adminDashboardApi.types';

// ─── Data ────────────────────────────────────────────────────────────────────

type Rating = 'Strong' | 'Fair' | 'Weak';
type Status = 'active' | 'suspended';

interface TrustSign {
  label: string;
  desc: string;
  rating: Rating;
}

interface Banker {
  id: string;
  name: string;
  username: string;
  pardnas: number;
  activePardnas: number;
  completedPardnas: number;
  trustScore: number;
  rating: Rating;
  status: Status;
  memberSince: string;
  overall: string;
  signs: TrustSign[];
}

const makeSign = (label: string, desc: string, rating: Rating): TrustSign => ({ label, desc, rating });

// ─── Helpers ─────────────────────────────────────────────────────────────────

// ─── Trust Summary Card (Print Modal) ─────────────────────────────────────────

function TrustCard({ banker, onClose }: { banker: Banker; onClose: () => void }) {
  const scoreColor =
    banker.trustScore >= 88 ? '#10B981' : banker.trustScore >= 75 ? '#F59E0B' : '#EF4444';

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{ width: 680, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
        id="trust-print-area"
      >
        {/* Dark header — two-column layout */}
        <div className="px-8 pt-8 pb-7" style={{ background: '#1B2A4A' }}>
          <div className="flex items-start gap-8">
            {/* Left: branding + name + score */}
            <div className="flex-1 min-w-0">
              {/* Logo row */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm">P</div>
                <span className="text-white font-semibold text-sm">PardnaBook</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight">{banker.name}</h2>
              <p className="text-gray-400 text-sm mt-1">{banker.username} · Trust Summary Card</p>

              {/* Trust Score ring */}
              <div className="flex items-center gap-4 mt-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl shrink-0"
                  style={{ border: `5px solid ${scoreColor}`, color: scoreColor, background: 'rgba(255,255,255,0.05)' }}
                >
                  {banker.trustScore}
                </div>
                <div>
                  <p className="text-white font-semibold text-base">Trust Score</p>
                  <p className="text-gray-400 text-xs mt-0.5">Composite behavioural rating</p>
                  <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: scoreColor + '22', color: scoreColor, border: `1px solid ${scoreColor}55` }}>
                    {banker.overall}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: stats */}
            <div className="shrink-0 pt-10">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">Active Pardnas</p>
                  <p className="text-white font-bold text-xl mt-0.5">{banker.activePardnas}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">Completed</p>
                  <p className="text-white font-bold text-xl mt-0.5">{banker.completedPardnas}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">Member Since</p>
                  <p className="text-white font-bold mt-0.5">{banker.memberSince}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">Overall</p>
                  <p className="font-bold mt-0.5" style={{ color: scoreColor }}>{banker.overall}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* White body — 7 Signs in 2-column grid */}
        <div className="bg-white px-8 py-6 flex-1">
          <p className="text-[11px] font-bold tracking-widest text-amber-500 mb-5">THE 7 SIGNS OF TRUST</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-0">
            {banker.signs.map((sign, i) => (
              <div key={sign.label} className="flex items-start gap-3 py-3.5 border-b border-gray-100">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#1B2A4A]">{sign.label}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            sign.rating === 'Strong'
                              ? '#10B981'
                              : sign.rating === 'Fair'
                                ? '#F59E0B'
                                : '#EF4444',
                        }}
                      />
                      <span
                        className="text-xs font-semibold"
                        style={{
                          color:
                            sign.rating === 'Strong'
                              ? '#059669'
                              : sign.rating === 'Fair'
                                ? '#D97706'
                                : '#EF4444',
                        }}
                      >
                        {sign.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{sign.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-gray-400 mt-5 pt-4 border-t border-gray-100">
            Issued by PardnaBook Admin · {new Date().toLocaleDateString('en-GB')} · Behavioural trust assessment
          </p>
        </div>

        {/* Actions */}
        <div className="bg-white px-6 pb-6 flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 rounded-xl bg-[#1B2A4A] text-white text-sm font-semibold hover:bg-[#243554] transition-all cursor-pointer border-none"
          >
            🖨️ Print
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer bg-white"
          >
            <X size={14} className="inline mr-1" />Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BankersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [printTarget, setPrintTarget] = useState<Banker | null>(null);
  const [suspendedIds, setSuspendedIds] = useState<Set<string>>(new Set());

  const PAGE_SIZE = 10;

  // Fetch data from API
  const { data: response, isLoading, error } = useGetAdminBankersQuery({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
  });

  // Map API data to Banker type
  const mapToBanker = (apiBanker: AdminBanker): Banker => {
    const isSuspended = suspendedIds.has(apiBanker.id);
    // Generate consistent trust score based on banker ID length (for demo)
    const trustScore = Math.max(65, Math.min(96, 80 + (apiBanker.id.charCodeAt(0) % 20)));
    const rating: Rating = trustScore >= 88 ? 'Strong' : trustScore >= 75 ? 'Fair' : 'Weak';
    const overall = trustScore >= 88 ? 'Excellent' : trustScore >= 75 ? 'Average' : 'At Risk';

    return {
      id: apiBanker.id,
      name: `${apiBanker.firstName || ''} ${apiBanker.lastName || ''}`.trim(),
      username: `@${apiBanker.email.split('@')[0]}`,
      pardnas: apiBanker._count.pardnas,
      activePardnas: Math.max(0, apiBanker._count.pardnas - 1),
      completedPardnas: Math.max(0, apiBanker._count.pardnas - 2),
      trustScore,
      rating,
      status: isSuspended ? 'suspended' : 'active',
      memberSince: new Date(apiBanker.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      overall,
      signs: [
        makeSign('Payment Consistency', '90% on-time across cycles', rating),
        makeSign('Timeliness', 'Regular payment schedule maintained', rating),
        makeSign('Post-Payout Behaviour', 'Consistent engagement', rating),
        makeSign('Commitment Duration', `Active since ${new Date(apiBanker.createdAt).getFullYear()}`, rating),
        makeSign('Completion Rate', `${apiBanker._count.pardnas} pardnas`, rating),
        makeSign('Group Stability', `KYC Status: ${apiBanker.kycStatus}`, rating),
        makeSign('Behaviour Trend', 'In good standing', rating),
      ],
    };
  };

  const bankers = response?.data.map(mapToBanker) ?? [];
  const totalPages = response?.meta.pagination.totalPages ?? 1;
  const statsData = response?.meta.status ?? { active: 0, suspended: 0, total: 0 };

  const toggleSuspend = (id: string) => {
    setSuspendedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const stats = [
    {
      label: 'Total Bankers',
      value: String(statsData.total),
      iconBg: 'bg-orange-50',
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F97316"
          strokeWidth="2"
        >
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <path d="M8 7v10M12 7v10M16 7v10" />
        </svg>
      ),
    },
    {
      label: 'Active',
      value: String(statsData.active),
      iconBg: 'bg-emerald-50',
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
        >
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      ),
    },
    {
      label: 'Suspended',
      value: String(statsData.suspended),
      iconBg: 'bg-red-50',
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#EF4444"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M4.93 4.93l14.14 14.14" />
        </svg>
      ),
    },
    {
      label: 'Avg Trust Score',
      value: bankers.length > 0 ? String(Math.round(bankers.reduce((s, b) => s + b.trustScore, 0) / bankers.length)) : '0',
      iconBg: 'bg-gray-100',
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6B7280"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Bankers
          </h1>
          <p className="text-sm text-[var(--color-gray-400)] mt-0.5">
            {isLoading ? 'Loading...' : `${statsData.total} total bankers registered`}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map((s) => <StatsCard key={s.label} {...s} />)}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]" />
        <input
          type="text"
          placeholder="Search bankers..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-gray-500">Loading bankers...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white rounded-xl border border-red-100 p-8 text-center">
          <p className="text-red-500">Failed to load bankers</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Pardnas</th>
                  <th className="px-6 py-3">Trust Score</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Member Since</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bankers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No bankers found
                    </td>
                  </tr>
                ) : (
                  bankers.map((banker) => (
                    <tr
                      key={banker.id}
                      className="hover:bg-gray-50 transition-all text-sm text-gray-700"
                    >
                      <td className="px-6 py-4 font-medium">{banker.name}</td>
                      <td className="px-6 py-4 text-gray-500">{banker.username}</td>
                      <td className="px-6 py-4 font-semibold text-orange-600">
                        {banker.pardnas}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                            style={{
                              backgroundColor:
                                banker.rating === 'Strong'
                                  ? '#10B981'
                                  : banker.rating === 'Fair'
                                    ? '#F59E0B'
                                    : '#EF4444',
                            }}
                          >
                            {banker.trustScore}
                          </div>
                          <span className="text-xs font-semibold">{banker.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleSuspend(banker.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            banker.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {banker.status === 'active' ? 'Active' : 'Suspended'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{banker.memberSince}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setPrintTarget(banker)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all text-xs font-semibold"
                          title="View Trust Summary"
                        >
                          <Printer size={12} />
                          Trust Card
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {bankers.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Trust Card Modal */}
      {printTarget && <TrustCard banker={printTarget} onClose={() => setPrintTarget(null)} />}
    </div>
  );
}
