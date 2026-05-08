import { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';

type PayoutStatus = 'Paid' | 'Upcoming' | 'Pending';

interface Payout {
  id: number;
  pardna: string;
  banker: string;
  recipient: string;
  round: number;
  amount: string;
  date: string;
  status: PayoutStatus;
}

const PAYOUTS: Payout[] = [
  { id:  1, pardna: 'Family Monthly',      banker: 'Joseph L.', recipient: 'Rachel E.',  round: 1, amount: '£1,600', date: '2026-01-25', status: 'Paid'     },
  { id:  2, pardna: 'Family Monthly',      banker: 'Joseph L.', recipient: 'Abena C.',   round: 8, amount: '£1,600', date: '2026-06-03', status: 'Upcoming'  },
  { id:  3, pardna: 'Work Friends Savings',banker: 'Hassan T.', recipient: 'Yaw T.',     round: 7, amount: '£4,800', date: '2026-08-23', status: 'Upcoming'  },
  { id:  4, pardna: 'Work Friends Savings',banker: 'Hassan T.', recipient: 'Akin C.',    round: 7, amount: '£4,800', date: '2026-09-06', status: 'Upcoming'  },
  { id:  5, pardna: 'Summer Holiday Fund', banker: 'Nathan H.', recipient: 'Marcus B.',  round: 2, amount: '£300',   date: '2026-08-25', status: 'Upcoming'  },
  { id:  6, pardna: 'Summer Holiday Fund', banker: 'Nathan H.', recipient: 'Mary E.',    round: 2, amount: '£300',   date: '—',          status: 'Pending'   },
  { id:  7, pardna: 'Community Build',     banker: 'Ngozi E.',  recipient: 'Maya W.',    round: 9, amount: '£3,500', date: '2026-04-23', status: 'Paid'     },
  { id:  8, pardna: 'Community Build',     banker: 'Ngozi E.',  recipient: 'Julian B.',  round: 2, amount: '£3,500', date: '2026-03-10', status: 'Paid'     },
  { id:  9, pardna: 'Family Monthly',      banker: 'Joseph L.', recipient: 'Tobi A.',    round: 3, amount: '£1,600', date: '2026-03-15', status: 'Paid'     },
  { id: 10, pardna: 'Family Monthly',      banker: 'Joseph L.', recipient: 'Funmi T.',   round: 6, amount: '£1,600', date: '2026-05-20', status: 'Upcoming'  },
  { id: 11, pardna: 'Work Friends Savings',banker: 'Hassan T.', recipient: 'Tomi B.',    round: 4, amount: '£4,800', date: '2026-07-10', status: 'Upcoming'  },
  { id: 12, pardna: 'Work Friends Savings',banker: 'Hassan T.', recipient: 'Karen M.',   round: 5, amount: '£4,800', date: '—',          status: 'Pending'   },
  { id: 13, pardna: 'Summer Holiday Fund', banker: 'Nathan H.', recipient: 'Lola J.',    round: 1, amount: '£300',   date: '2026-01-18', status: 'Paid'     },
  { id: 14, pardna: 'Community Build',     banker: 'Ngozi E.',  recipient: 'Niyi K.',    round: 5, amount: '£3,500', date: '2026-06-01', status: 'Upcoming'  },
  { id: 15, pardna: 'Community Build',     banker: 'Ngozi E.',  recipient: 'Stephen T.', round: 8, amount: '£3,500', date: '—',          status: 'Pending'   },
];

const paidCount     = PAYOUTS.filter(p => p.status === 'Paid').length;
const pendingCount  = PAYOUTS.filter(p => p.status === 'Pending').length;
const upcomingCount = PAYOUTS.filter(p => p.status === 'Upcoming').length;

const statusStyle: Record<PayoutStatus, string> = {
  Paid:     'text-emerald-600 bg-emerald-50  border-emerald-200',
  Upcoming: 'text-gray-500   bg-gray-100    border-gray-300',
  Pending:  'text-orange-500 bg-orange-50   border-orange-200',
};

const PAGE_SIZE = 10;

export default function PayoutsTab({ search }: { search: string }) {
  const [page, setPage] = useState(1);

  const filtered   = PAYOUTS.filter(p =>
    p.pardna.toLowerCase().includes(search.toLowerCase()) ||
    p.recipient.toLowerCase().includes(search.toLowerCase()) ||
    p.banker.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Paid',     value: paidCount,     color: 'text-emerald-600' },
          { label: 'Pending',  value: pendingCount,  color: 'text-orange-500'  },
          { label: 'Upcoming', value: upcomingCount, color: 'text-blue-500'    },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-md border border-gray-100 p-5 text-center hover:shadow-sm transition-all">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[var(--color-gray-400)] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Pardna','Banker','Recipient','Round','Amount','Date','Status',''].map(h => (
                  <th key={h} className={`text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 ${
                    ['Round','Amount'].includes(h) ? 'text-[var(--color-primary)]' : 'text-[var(--color-gray-400)]'
                  }`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-orange-50/20 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-semibold text-[var(--color-dark)]">{p.pardna}</td>
                  <td className="px-5 py-3.5 text-sm text-[var(--color-primary)]">{p.banker}</td>
                  <td className="px-5 py-3.5 text-sm text-[var(--color-gray-500)]">{p.recipient}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-[var(--color-primary)]">{p.round}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-[var(--color-dark)]">{p.amount}</td>
                  <td className="px-5 py-3.5 text-sm text-[var(--color-gray-500)]">{p.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`flex items-center gap-1 w-fit text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle[p.status]}`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {p.status === 'Paid' ? <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></> :
                         p.status === 'Upcoming' ? <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></> :
                         <><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></>}
                      </svg>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[var(--color-dark)] hover:bg-gray-100 transition-all cursor-pointer border-none bg-transparent">
                      <Eye size={15}/>
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
            Showing <span className="font-semibold text-[var(--color-dark)]">{Math.min((page-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(page*PAGE_SIZE,filtered.length)}</span> of <span className="font-semibold text-[var(--color-dark)]">{filtered.length}</span> payouts
          </p>
          <div className="flex items-center gap-2">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft size={14}/> Previous
            </button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
              <button key={n} onClick={()=>setPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${n===page?'bg-[var(--color-primary)] text-white':'text-[var(--color-gray-500)] hover:bg-gray-100'}`}>
                {n}
              </button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed">
              Next <ChevronRight size={14}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
