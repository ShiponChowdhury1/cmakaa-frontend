import { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetAdminPaymentsQuery } from '@/store/features/adminDashboard/adminDashboardApi';
import type { AdminPayment } from '@/store/features/adminDashboard/adminDashboardApi.types';

type PaymentStatus = 'PAID' | 'LATE' | 'PENDING' | 'MISSED';

interface Payment {
  id: string;
  pardna: string;
  banker: string;
  participant: string;
  round: number;
  amount: string;
  date: string;
  status: PaymentStatus;
}

const statusStyle: Record<PaymentStatus, string> = {
  PAID:    'text-emerald-600 bg-emerald-50 border-emerald-200',
  PENDING: 'text-amber-600   bg-amber-50   border-amber-200',
  LATE:    'text-orange-500  bg-orange-50  border-orange-200',
  MISSED:  'text-red-500     bg-red-50     border-red-200',
};

const PAGE_SIZE = 10;

export default function PaymentsTab({ search }: { search: string }) {
  const [page, setPage] = useState(1);

  // Fetch data from API
  const { data: response, isLoading, isError } = useGetAdminPaymentsQuery({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
  });

  // Map API data to Payment type
  const mapToPayment = (apiPayment: AdminPayment): Payment => {
    return {
      id: apiPayment.id,
      pardna: 'Weekend Trip Fund', // Default - not in API
      banker: 'N/A', // Not in API response
      participant: apiPayment.participant.fullName,
      round: apiPayment.round.roundNumber,
      amount: `£${apiPayment.amount}`,
      date: new Date(apiPayment.createdAt).toLocaleDateString('en-GB'),
      status: apiPayment.status as PaymentStatus,
    };
  };

  const payments = response?.data.map(mapToPayment) ?? [];
  const pagination = response?.meta.pagination;
  const statusMeta = response?.meta.status;
  const totalItems = pagination?.total ?? payments.length;
  const totalPages = pagination?.totalPages ?? 1;

  const paidCount = statusMeta?.PAID ?? 0;
  const pendingCount = statusMeta?.PENDING ?? 0;
  const lateCount = statusMeta?.LATE ?? 0;
  const missedCount = statusMeta?.MISSED ?? 0;

  const filtered = payments.filter(p =>
    p.pardna.toLowerCase().includes(search.toLowerCase()) ||
    p.participant.toLowerCase().includes(search.toLowerCase()) ||
    p.banker.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(0, PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
        Loading payments...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        Failed to load payments data.
      </div>
    );
  }

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
                        {p.status === 'PAID' ? <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></> :
                         p.status === 'LATE' ? <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></> :
                         p.status === 'MISSED' ? <><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></> :
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
            Showing <span className="font-semibold text-[var(--color-dark)]">{Math.min((page-1)*PAGE_SIZE+1,totalItems)}–{Math.min(page*PAGE_SIZE,totalItems)}</span> of <span className="font-semibold text-[var(--color-dark)]">{totalItems}</span> payments
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
