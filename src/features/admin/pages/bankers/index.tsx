import { useState } from 'react';
import { Printer, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import StatsCard from '../../components/StatsCard';

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

const BANKERS: Banker[] = [
  {
    id: 'B01', name: 'Joseph Laryea',    username: '@joseph_l1',  pardnas: 8,  activePardnas: 3, completedPardnas: 5, trustScore: 96, rating: 'Strong', status: 'active', memberSince: 'Jan 2025', overall: 'Excellent',
    signs: [
      makeSign('Payment Consistency',   '99% on-time across cycles',       'Strong'),
      makeSign('Timeliness',            'Always pays on the due date',      'Strong'),
      makeSign('Post-Payout Behaviour', 'Continued paying post-payout',     'Strong'),
      makeSign('Commitment Duration',   'Multiple completed cycles',        'Strong'),
      makeSign('Completion Rate',       'Consistent over 18 months',        'Strong'),
      makeSign('Group Stability',       'No disputes recorded',             'Strong'),
      makeSign('Behaviour Trend',       'Fast collection turnaround',       'Strong'),
    ],
  },
  {
    id: 'B02', name: 'Hassan Thompson',  username: '@hassan_t2',  pardnas: 6,  activePardnas: 2, completedPardnas: 4, trustScore: 94, rating: 'Strong', status: 'active', memberSince: 'Jun 2025', overall: 'Reliable',
    signs: [
      makeSign('Payment Consistency',   '98% on-time across cycles',       'Strong'),
      makeSign('Timeliness',            'Always pays on the due date',      'Strong'),
      makeSign('Post-Payout Behaviour', 'Continued paying post-payout',     'Strong'),
      makeSign('Commitment Duration',   'Multiple completed cycles',        'Strong'),
      makeSign('Completion Rate',       'Consistent over 12 months',        'Strong'),
      makeSign('Group Stability',       'No disputes recorded',             'Strong'),
      makeSign('Behaviour Trend',       'Fast collection turnaround',       'Strong'),
    ],
  },
  {
    id: 'B03', name: 'Nathan Hassan',    username: '@nathan_h3',  pardnas: 7,  activePardnas: 4, completedPardnas: 3, trustScore: 92, rating: 'Strong', status: 'active', memberSince: 'Mar 2025', overall: 'Reliable',
    signs: [
      makeSign('Payment Consistency',   '96% on-time across cycles',       'Strong'),
      makeSign('Timeliness',            'Rarely misses due dates',          'Strong'),
      makeSign('Post-Payout Behaviour', 'Continued paying post-payout',     'Strong'),
      makeSign('Commitment Duration',   'Multiple completed cycles',        'Strong'),
      makeSign('Completion Rate',       'Consistent over 10 months',        'Strong'),
      makeSign('Group Stability',       'Minor dispute resolved',           'Fair'),
      makeSign('Behaviour Trend',       'Steadily improving',               'Strong'),
    ],
  },
  {
    id: 'B04', name: 'Ngozi Eze',        username: '@ngozi_e4',   pardnas: 6,  activePardnas: 3, completedPardnas: 3, trustScore: 90, rating: 'Strong', status: 'active', memberSince: 'Apr 2025', overall: 'Reliable',
    signs: [
      makeSign('Payment Consistency',   '94% on-time across cycles',       'Strong'),
      makeSign('Timeliness',            'Mostly on the due date',           'Strong'),
      makeSign('Post-Payout Behaviour', 'Continued paying post-payout',     'Strong'),
      makeSign('Commitment Duration',   'Completed 3 full cycles',          'Strong'),
      makeSign('Completion Rate',       'Consistent over 9 months',         'Strong'),
      makeSign('Group Stability',       'No disputes recorded',             'Strong'),
      makeSign('Behaviour Trend',       'Positive turnaround',              'Fair'),
    ],
  },
  {
    id: 'B05', name: 'Irene Green',      username: '@irene_g5',   pardnas: 6,  activePardnas: 2, completedPardnas: 4, trustScore: 88, rating: 'Strong', status: 'active', memberSince: 'Feb 2025', overall: 'Reliable',
    signs: [
      makeSign('Payment Consistency',   '92% on-time across cycles',       'Strong'),
      makeSign('Timeliness',            'Occasional late payments',         'Fair'),
      makeSign('Post-Payout Behaviour', 'Continued paying post-payout',     'Strong'),
      makeSign('Commitment Duration',   'Multiple completed cycles',        'Strong'),
      makeSign('Completion Rate',       'Consistent over 8 months',         'Strong'),
      makeSign('Group Stability',       'No disputes recorded',             'Strong'),
      makeSign('Behaviour Trend',       'Steadily improving',               'Strong'),
    ],
  },
  {
    id: 'B06', name: 'Caleb Okonkwo',   username: '@caleb_o6',   pardnas: 4,  activePardnas: 2, completedPardnas: 2, trustScore: 86, rating: 'Strong', status: 'active', memberSince: 'May 2025', overall: 'Reliable',
    signs: [
      makeSign('Payment Consistency',   '90% on-time across cycles',       'Strong'),
      makeSign('Timeliness',            'Usually on time',                  'Strong'),
      makeSign('Post-Payout Behaviour', 'Continued paying post-payout',     'Fair'),
      makeSign('Commitment Duration',   '2 completed cycles',               'Strong'),
      makeSign('Completion Rate',       'Consistent over 7 months',         'Strong'),
      makeSign('Group Stability',       'No disputes recorded',             'Strong'),
      makeSign('Behaviour Trend',       'Positive trend',                   'Fair'),
    ],
  },
  {
    id: 'B07', name: 'Tomi Hughes',      username: '@tomi_h7',    pardnas: 4,  activePardnas: 3, completedPardnas: 1, trustScore: 84, rating: 'Fair',   status: 'active', memberSince: 'Jul 2025', overall: 'Average',
    signs: [
      makeSign('Payment Consistency',   '85% on-time across cycles',       'Fair'),
      makeSign('Timeliness',            'Some late payments recorded',      'Fair'),
      makeSign('Post-Payout Behaviour', 'Mostly continued paying',          'Fair'),
      makeSign('Commitment Duration',   '1 completed cycle',                'Fair'),
      makeSign('Completion Rate',       'Improving over 6 months',          'Fair'),
      makeSign('Group Stability',       'Minor issue resolved',             'Fair'),
      makeSign('Behaviour Trend',       'Trending upward',                  'Strong'),
    ],
  },
  {
    id: 'B08', name: 'Grace Kamara',     username: '@grace_k8',   pardnas: 5,  activePardnas: 3, completedPardnas: 2, trustScore: 82, rating: 'Fair',   status: 'active', memberSince: 'Aug 2025', overall: 'Average',
    signs: [
      makeSign('Payment Consistency',   '83% on-time across cycles',       'Fair'),
      makeSign('Timeliness',            'Late payments on occasion',        'Fair'),
      makeSign('Post-Payout Behaviour', 'Inconsistent post-payout',        'Fair'),
      makeSign('Commitment Duration',   '2 completed cycles',               'Fair'),
      makeSign('Completion Rate',       'Over 5 months',                    'Fair'),
      makeSign('Group Stability',       'One unresolved dispute',           'Weak'),
      makeSign('Behaviour Trend',       'Slightly improving',               'Fair'),
    ],
  },
  {
    id: 'B09', name: 'Ama Conteh',       username: '@ama_c9',     pardnas: 3,  activePardnas: 2, completedPardnas: 1, trustScore: 80, rating: 'Fair',   status: 'active', memberSince: 'Sep 2025', overall: 'Average',
    signs: [
      makeSign('Payment Consistency',   '80% on-time across cycles',       'Fair'),
      makeSign('Timeliness',            'Regularly late by a few days',     'Fair'),
      makeSign('Post-Payout Behaviour', 'Partially continued paying',       'Fair'),
      makeSign('Commitment Duration',   '1 completed cycle',                'Fair'),
      makeSign('Completion Rate',       'Over 4 months',                    'Fair'),
      makeSign('Group Stability',       'No major disputes',                'Fair'),
      makeSign('Behaviour Trend',       'Stable',                           'Fair'),
    ],
  },
  {
    id: 'B10', name: 'Kwame Adjei',      username: '@kwame_a10',  pardnas: 3,  activePardnas: 2, completedPardnas: 1, trustScore: 78, rating: 'Fair',   status: 'active', memberSince: 'Oct 2025', overall: 'Average',
    signs: [
      makeSign('Payment Consistency',   '79% on-time across cycles',       'Fair'),
      makeSign('Timeliness',            'Frequently late',                  'Weak'),
      makeSign('Post-Payout Behaviour', 'Partially continued paying',       'Fair'),
      makeSign('Commitment Duration',   '1 completed cycle',                'Fair'),
      makeSign('Completion Rate',       'Over 3 months',                    'Fair'),
      makeSign('Group Stability',       'One minor dispute',                'Fair'),
      makeSign('Behaviour Trend',       'Improving slowly',                 'Fair'),
    ],
  },
  {
    id: 'B11', name: 'Fatou Diallo',     username: '@fatou_d11',  pardnas: 2,  activePardnas: 2, completedPardnas: 0, trustScore: 72, rating: 'Weak',   status: 'active', memberSince: 'Nov 2025', overall: 'At Risk',
    signs: [
      makeSign('Payment Consistency',   '70% on-time across cycles',       'Weak'),
      makeSign('Timeliness',            'Consistent late payments',         'Weak'),
      makeSign('Post-Payout Behaviour', 'Stopped paying after payout',      'Weak'),
      makeSign('Commitment Duration',   'No completed cycles',              'Weak'),
      makeSign('Completion Rate',       'Under review',                     'Weak'),
      makeSign('Group Stability',       'Two unresolved disputes',          'Weak'),
      makeSign('Behaviour Trend',       'Declining',                        'Weak'),
    ],
  },
  {
    id: 'B12', name: 'James King',       username: '@james_k12',  pardnas: 1,  activePardnas: 0, completedPardnas: 1, trustScore: 65, rating: 'Weak',   status: 'suspended', memberSince: 'Dec 2024', overall: 'At Risk',
    signs: [
      makeSign('Payment Consistency',   '60% on-time across cycles',       'Weak'),
      makeSign('Timeliness',            'Repeatedly missed deadlines',      'Weak'),
      makeSign('Post-Payout Behaviour', 'Stopped paying after payout',      'Weak'),
      makeSign('Commitment Duration',   '1 completed cycle (early)',        'Fair'),
      makeSign('Completion Rate',       'Suspended — under review',         'Weak'),
      makeSign('Group Stability',       'Multiple complaints',              'Weak'),
      makeSign('Behaviour Trend',       'Negative trend',                   'Weak'),
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ratingColor: Record<Rating, string> = {
  Strong: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  Fair:   'text-amber-600  bg-amber-50  border-amber-200',
  Weak:   'text-red-500    bg-red-50    border-red-200',
};

const ratingDot: Record<Rating, string> = {
  Strong: 'bg-emerald-500',
  Fair:   'bg-amber-500',
  Weak:   'bg-red-500',
};

const PAGE_SIZE = 10;

// ─── Stats ────────────────────────────────────────────────────────────────────

const activeCount    = BANKERS.filter(b => b.status === 'active').length;
const suspendedCount = BANKERS.filter(b => b.status === 'suspended').length;
const avgTrust       = Math.round(BANKERS.reduce((s, b) => s + b.trustScore, 0) / BANKERS.length);

const stats = [
  {
    label: 'Total Bankers', value: String(BANKERS.length), iconBg: 'bg-orange-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 7v10M12 7v10M16 7v10"/></svg>,
  },
  {
    label: 'Active', value: String(activeCount), iconBg: 'bg-emerald-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
  },
  {
    label: 'Suspended', value: String(suspendedCount), iconBg: 'bg-red-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>,
  },
  {
    label: 'Avg Trust Score', value: String(avgTrust), iconBg: 'bg-gray-100',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  },
];

// ─── Trust Summary Card (Print Modal) ─────────────────────────────────────────

function TrustCard({ banker, onClose }: { banker: Banker; onClose: () => void }) {
  const scoreColor =
    banker.trustScore >= 88 ? '#10B981' : banker.trustScore >= 75 ? '#F59E0B' : '#EF4444';

  return (
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
                      <div className={`w-1.5 h-1.5 rounded-full ${ratingDot[sign.rating]}`} />
                      <span className={`text-xs font-semibold ${
                        sign.rating === 'Strong' ? 'text-emerald-600' :
                        sign.rating === 'Fair'   ? 'text-amber-500'  : 'text-red-500'
                      }`}>{sign.rating}</span>
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
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BankersPage() {
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [bankers, setBankers]       = useState(BANKERS);
  const [printTarget, setPrintTarget] = useState<Banker | null>(null);

  const filtered = bankers.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSuspend = (id: string) =>
    setBankers(prev => prev.map(b =>
      b.id === id ? { ...b, status: b.status === 'active' ? 'suspended' : 'active' } : b
    ));

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Bankers
          </h1>
          <p className="text-sm text-[var(--color-gray-400)] mt-0.5">
            {bankers.length} total bankers registered
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
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name', 'Username', 'Pardnas', 'Trust', 'Rating', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-[var(--color-gray-400)] uppercase tracking-wider px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  {/* Name */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-[var(--color-dark)]">{b.name}</span>
                  </td>
                  {/* Username */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-[var(--color-primary)]">{b.username}</span>
                  </td>
                  {/* Pardnas */}
                  <td className="px-5 py-3.5 text-sm text-[var(--color-dark)] font-medium">{b.pardnas}</td>
                  {/* Trust score */}
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-bold ${
                      b.trustScore >= 88 ? 'text-emerald-600' :
                      b.trustScore >= 75 ? 'text-amber-500'  : 'text-red-500'
                    }`}>{b.trustScore}</span>
                  </td>
                  {/* Rating badge */}
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ratingColor[b.rating]}`}>
                      {b.rating}
                    </span>
                  </td>
                  {/* Status badge */}
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      b.status === 'active'
                        ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                        : 'text-red-500 bg-red-50 border-red-200'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {/* Print → opens Trust Card modal */}
                      <button
                        onClick={() => setPrintTarget(b)}
                        title="Print Trust Summary Card"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[var(--color-dark)] hover:bg-gray-100 transition-all cursor-pointer border-none bg-transparent"
                      >
                        <Printer size={15} />
                      </button>
                      {/* Suspend / Unsuspend */}
                      <button
                        onClick={() => toggleSuspend(b.id)}
                        title={b.status === 'active' ? 'Suspend banker' : 'Activate banker'}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer border-none bg-transparent ${
                          b.status === 'active'
                            ? 'text-red-400 hover:text-red-600 hover:bg-red-50'
                            : 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {b.status === 'active' ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/>
                          </svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-[var(--color-gray-400)]">
            Showing{' '}
            <span className="font-semibold text-[var(--color-dark)]">
              {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-[var(--color-dark)]">{filtered.length}</span>{' '}
            bankers
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
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
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Trust Summary Card Modal */}
      {printTarget && (
        <TrustCard banker={printTarget} onClose={() => setPrintTarget(null)} />
      )}
    </div>
  );
}
