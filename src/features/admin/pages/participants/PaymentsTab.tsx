import { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';

type PaymentStatus = 'Paid' | 'Late' | 'Pending' | 'Missed';

interface Payment {
  id: number;
  pardna: string;
  banker: string;
  participant: string;
  round: number;
  amount: string;
  date: string;
  status: PaymentStatus;
}

const PAYMENTS: Payment[] = [
  { id:  1, pardna: 'Family Monthly',      banker: 'Joseph L.', participant: 'Sade A.',   round:  5, amount: '£250',  date: '2026-01-08', status: 'Paid'    },
  { id:  2, pardna: 'Family Monthly',      banker: 'Joseph L.', participant: 'Abena C.',  round:  4, amount: '£250',  date: '2026-01-03', status: 'Paid'    },
  { id:  3, pardna: 'Family Monthly',      banker: 'Joseph L.', participant: 'Chuka S.',  round:  7, amount: '£250',  date: '2026-03-07', status: 'Paid'    },
  { id:  4, pardna: 'Family Monthly',      banker: 'Joseph L.', participant: 'Funmi T.',  round:  9, amount: '£250',  date: '2026-03-25', status: 'Late'    },
  { id:  5, pardna: 'Work Friends Savings',banker: 'Hassan T.', participant: 'Miriam C.', round: 10, amount: '£600',  date: '2026-01-09', status: 'Paid'    },
  { id:  6, pardna: 'Work Friends Savings',banker: 'Hassan T.', participant: 'Karen M.',  round:  7, amount: '£600',  date: '2026-01-07', status: 'Paid'    },
  { id:  7, pardna: 'Work Friends Savings',banker: 'Hassan T.', participant: 'Tomi B.',   round:  6, amount: '£600',  date: '2026-04-04', status: 'Paid'    },
  { id:  8, pardna: 'Work Friends Savings',banker: 'Hassan T.', participant: 'Mary O.',   round:  2, amount: '£600',  date: '2026-02-06', status: 'Late'    },
  { id:  9, pardna: 'Summer Holiday Fund', banker: 'Nathan H.', participant: 'Marcus B.', round:  3, amount: '£300',  date: '2026-02-10', status: 'Paid'    },
  { id: 10, pardna: 'Summer Holiday Fund', banker: 'Nathan H.', participant: 'Mary E.',   round:  4, amount: '£300',  date: '2026-03-10', status: 'Pending' },
  { id: 11, pardna: 'Community Build',     banker: 'Ngozi E.',  participant: 'Maya W.',   round:  9, amount: '£450',  date: '2026-04-23', status: 'Paid'    },
  { id: 12, pardna: 'Community Build',     banker: 'Ngozi E.',  participant: 'Julian B.', round:  2, amount: '£450',  date: '2026-03-10', status: 'Paid'    },
  { id: 13, pardna: 'Family Monthly',      banker: 'Joseph L.', participant: 'Rachel E.', round:  1, amount: '£250',  date: '2026-01-25', status: 'Paid'    },
  { id: 14, pardna: 'Family Monthly',      banker: 'Joseph L.', participant: 'Tobi A.',   round:  6, amount: '£250',  date: '2026-02-15', status: 'Missed'  },
  { id: 15, pardna: 'Work Friends Savings',banker: 'Hassan T.', participant: 'Yaw T.',    round:  8, amount: '£600',  date: '2026-03-18', status: 'Missed'  },
  { id: 16, pardna: 'Work Friends Savings',banker: 'Hassan T.', participant: 'Akin C.',   round:  3, amount: '£600',  date: '2026-02-20', status: 'Paid'    },
  { id: 17, pardna: 'Summer Holiday Fund', banker: 'Nathan H.', participant: 'Lola J.',   round:  5, amount: '£300',  date: '2026-03-05', status: 'Paid'    },
  { id: 18, pardna: 'Community Build',     banker: 'Ngozi E.',  participant: 'Niyi K.',   round:  4, amount: '£450',  date: '2026-04-01', status: 'Late'    },
  { id: 19, pardna: 'Family Monthly',      banker: 'Joseph L.', participant: 'Lydia D.',  round:  8, amount: '£250',  date: '2026-04-10', status: 'Pending' },
  { id: 20, pardna: 'Community Build',     banker: 'Ngozi E.',  participant: 'Stephen T.',round:  6, amount: '£450',  date: '2026-04-15', status: 'Missed'  },
];

const paidCount    = PAYMENTS.filter(p => p.status === 'Paid').length;
const pendingCount = PAYMENTS.filter(p => p.status === 'Pending').length;
const lateCount    = PAYMENTS.filter(p => p.status === 'Late').length;
const missedCount  = PAYMENTS.filter(p => p.status === 'Missed').length;

const statusStyle: Record<PaymentStatus, string> = {
  Paid:    'text-emerald-600 bg-emerald-50 border-emerald-200',
  Pending: 'text-amber-600   bg-amber-50   border-amber-200',
  Late:    'text-orange-500  bg-orange-50  border-orange-200',
  Missed:  'text-red-500     bg-red-50     border-red-200',
};

const PAGE_SIZE = 10;

export default function PaymentsTab({ search }: { search: string }) {
  const [page, setPage] = useState(1);

  const filtered   = PAYMENTS.filter(p =>
    p.pardna.toLowerCase().includes(search.toLowerCase()) ||
    p.participant.toLowerCase().includes(search.toLowerCase()) ||
    p.banker.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Paid',    value: paidCount,    color: 'text-emerald-600' },
          { label: 'Pending', value: pendingCount,  color: 'text-blue-500'    },
          { label: 'Late',    value: lateCount,     color: 'text-orange-500'  },
          { label: 'Missed',  value: missedCount,   color: 'text-red-500'     },
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
                {['Pardna','Banker','Participant','Round','Amount','Date','Status',''].map(h => (
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
                  <td className="px-5 py-3.5 text-sm text-[var(--color-gray-500)]">{p.participant}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-[var(--color-primary)]">{p.round}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-[var(--color-dark)]">{p.amount}</td>
                  <td className="px-5 py-3.5 text-sm text-[var(--color-gray-500)]">{p.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`flex items-center gap-1 w-fit text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle[p.status]}`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {p.status === 'Paid' ? <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></> :
                         p.status === 'Late' ? <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></> :
                         p.status === 'Missed' ? <><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></> :
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
            Showing <span className="font-semibold text-[var(--color-dark)]">{Math.min((page-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(page*PAGE_SIZE,filtered.length)}</span> of <span className="font-semibold text-[var(--color-dark)]">{filtered.length}</span> payments
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
