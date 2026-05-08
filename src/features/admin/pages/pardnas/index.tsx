import { useState } from 'react';
import { Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import StatsCard from '../../components/StatsCard';

// ─── Data ─────────────────────────────────────────────────────────────────────

type PardnaStatus = 'active' | 'completed' | 'paused' | 'closed';

interface Pardna {
  id: string;
  name: string;
  banker: string;
  members: number;
  collected: string;
  status: PardnaStatus;
  overdue: number | null;
}

const PARDNAS: Pardna[] = [
  { id: 'PR01', name: 'Family Monthly',      banker: 'Joseph L.',  members:  9, collected: '£8,100',  status: 'active',    overdue: null },
  { id: 'PR02', name: 'Work Friends Savings', banker: 'Hassan T.',  members: 12, collected: '£14,400', status: 'active',    overdue: 1    },
  { id: 'PR03', name: 'Summer Holiday Fund',  banker: 'Nathan H.',  members:  5, collected: '£1,250',  status: 'active',    overdue: 1    },
  { id: 'PR04', name: 'Community Build',      banker: 'Ngozi E.',   members:  7, collected: '£14,000', status: 'active',    overdue: 2    },
  { id: 'PR05', name: 'Youth Club Savings',   banker: 'Irene G.',   members: 13, collected: '£19,500', status: 'active',    overdue: 1    },
  { id: 'PR06', name: 'Church Building Fund', banker: 'Caleb O.',   members:  5, collected: '£1,500',  status: 'active',    overdue: 2    },
  { id: 'PR07', name: 'Wedding Pardna',       banker: 'Tomi H.',    members:  9, collected: '£2,700',  status: 'active',    overdue: 2    },
  { id: 'PR08', name: 'Back to School',       banker: 'Grace K.',   members: 12, collected: '£10,800', status: 'active',    overdue: 3    },
  { id: 'PR09', name: 'Christmas Pardna',     banker: 'Ama C.',     members:  9, collected: '£2,700',  status: 'active',    overdue: null },
  { id: 'PR10', name: 'Eid Savings',          banker: 'Henry K.',   members: 10, collected: '£3,000',  status: 'active',    overdue: 3    },
  { id: 'PR11', name: 'Business Starter',     banker: 'Kwame A.',   members:  8, collected: '£6,400',  status: 'active',    overdue: 1    },
  { id: 'PR12', name: 'Healthcare Fund',      banker: 'Fatou D.',   members:  6, collected: '£2,400',  status: 'paused',    overdue: null },
  { id: 'PR13', name: 'New Home Savings',     banker: 'James K.',   members: 10, collected: '£22,000', status: 'completed', overdue: null },
  { id: 'PR14', name: 'University Fund',      banker: 'Lisa C.',    members:  8, collected: '£9,600',  status: 'active',    overdue: 2    },
  { id: 'PR15', name: 'Emergency Reserve',    banker: 'Paul M.',    members:  5, collected: '£1,800',  status: 'closed',    overdue: null },
];

// ─── Stats ─────────────────────────────────────────────────────────────────────

const activeCount    = PARDNAS.filter(p => p.status === 'active').length;
const totalCollected = PARDNAS.reduce((sum, p) => {
  const val = parseFloat(p.collected.replace(/[£,]/g, ''));
  return sum + (isNaN(val) ? 0 : val);
}, 0);
const overdueTotal   = PARDNAS.reduce((sum, p) => sum + (p.overdue ?? 0), 0);

const stats = [
  {
    label: 'Total Pardnas', value: String(PARDNAS.length), iconBg: 'bg-orange-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 7v10M12 7v10M16 7v10"/></svg>,
  },
  {
    label: 'Active', value: String(activeCount), iconBg: 'bg-emerald-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
  },
  {
    label: 'Total Collected', value: `£${totalCollected.toLocaleString()}`, iconBg: 'bg-amber-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  },
  {
    label: 'Overdue Payments', value: String(overdueTotal), iconBg: 'bg-red-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,
  },
];

// ─── Status badge styles ───────────────────────────────────────────────────────

const statusStyle: Record<PardnaStatus, string> = {
  active:    'text-emerald-600 bg-emerald-50 border-emerald-200',
  completed: 'text-blue-600   bg-blue-50    border-blue-200',
  paused:    'text-amber-600  bg-amber-50   border-amber-200',
  closed:    'text-gray-500   bg-gray-100   border-gray-300',
};

const PAGE_SIZE = 10;

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AllPardnasPage() {
  const [search, setSearch] = useState('');
  const [page,   setPage]   = useState(1);

  const filtered   = PARDNAS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.banker.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          All Pardnas
        </h1>
        <p className="text-sm text-[var(--color-gray-400)] mt-0.5">{PARDNAS.length} pardnas registered</p>
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
              {paginated.map(p => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-orange-50/20 transition-colors">

                  {/* Name */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-[var(--color-primary)] cursor-pointer hover:underline">
                      {p.name}
                    </span>
                  </td>

                  {/* Banker */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-[var(--color-primary)]">{p.banker}</span>
                  </td>

                  {/* Members */}
                  <td className="px-5 py-3.5 text-sm text-[var(--color-dark)] font-medium">{p.members}</td>

                  {/* Collected */}
                  <td className="px-5 py-3.5 text-sm font-semibold text-[var(--color-dark)]">{p.collected}</td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle[p.status]}`}>
                      {p.status}
                    </span>
                  </td>

                  {/* Overdue */}
                  <td className="px-5 py-3.5">
                    {p.overdue ? (
                      <span className="text-sm font-bold text-red-500">{p.overdue}</span>
                    ) : (
                      <span className="text-sm text-[var(--color-gray-400)]">—</span>
                    )}
                  </td>

                  {/* View action */}
                  <td className="px-5 py-3.5">
                    <button
                      title="View pardna details"
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[var(--color-dark)] hover:bg-gray-100 transition-all cursor-pointer border-none bg-transparent"
                    >
                      <Eye size={15} />
                    </button>
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
              {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-[var(--color-dark)]">{filtered.length}</span>{' '}
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
