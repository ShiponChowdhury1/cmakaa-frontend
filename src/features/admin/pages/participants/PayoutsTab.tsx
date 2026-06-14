import { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, DollarSign, RefreshCw, User, Mail, Calendar, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useGetAdminPayoutsQuery } from '@/store/features/adminDashboard/adminDashboardApi';
import type { AdminPayout } from '@/store/features/adminDashboard/adminDashboardApi.types';

type PayoutStatus = 'Paid' | 'Pending';

interface Payout {
  id: string;
  pardna: string;
  banker: string;
  recipient: string;
  round: number;
  amount: string;
  date: string;
  status: PayoutStatus;
}

const statusStyle: Record<PayoutStatus, string> = {
  Paid:    'text-emerald-600 bg-emerald-50  border-emerald-200',
  Pending: 'text-orange-500 bg-orange-50   border-orange-200',
};

const PAGE_SIZE = 10;

export default function PayoutsTab({ search }: { search: string }) {
  const [page, setPage] = useState(1);
  const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null);

  // Fetch data from API
  const { data: response, isLoading, isError } = useGetAdminPayoutsQuery({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
  });

  const selectedPayout = response?.data.find(x => x.id === selectedPayoutId);

  // Map API data to Payout type
  const mapToPayout = (apiPayout: AdminPayout): Payout => {
    return {
      id: apiPayout.id,
      pardna: 'Weekend Trip Fund', // Default - not in API
      banker: apiPayout.confirmedBy ? `${apiPayout.confirmedBy.firstName} ${apiPayout.confirmedBy.lastName}` : 'N/A',
      recipient: apiPayout.participant.fullName,
      round: apiPayout.round.roundNumber,
      amount: `£${apiPayout.amount}`,
      date: apiPayout.confirmedAt ? new Date(apiPayout.confirmedAt).toLocaleDateString('en-GB') : '—',
      status: (apiPayout.status === 'CONFIRMED' ? 'Paid' : 'Pending') as PayoutStatus,
    };
  };

  const payouts = response?.data.map(mapToPayout) ?? [];
  const pagination = response?.meta.pagination;
  const statusMeta = response?.meta.status;
  const totalItems = pagination?.total ?? payouts.length;
  const totalPages = pagination?.totalPages ?? 1;

  const paidCount = statusMeta?.CONFIRMED ?? 0;
  const pendingCount = statusMeta?.PENDING ?? 0;

  const filtered = payouts.filter(p =>
    p.pardna.toLowerCase().includes(search.toLowerCase()) ||
    p.recipient.toLowerCase().includes(search.toLowerCase()) ||
    p.banker.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(0, PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
        Loading payouts...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        Failed to load payouts data.
      </div>
    );
  }

  const getPageNumbers = () => {
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
  };

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Confirmed', value: paidCount,    color: 'text-emerald-600' },
          { label: 'Pending',   value: pendingCount, color: 'text-orange-500'  },
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
                         <><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></>}
                      </svg>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setSelectedPayoutId(p.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[var(--color-dark)] hover:bg-gray-100 transition-all cursor-pointer border-none bg-transparent"
                    >
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
            Showing <span className="font-semibold text-[var(--color-dark)]">{Math.min((page-1)*PAGE_SIZE+1,totalItems)}–{Math.min(page*PAGE_SIZE,totalItems)}</span> of <span className="font-semibold text-[var(--color-dark)]">{totalItems}</span> payouts
          </p>
          <div className="flex items-center gap-2">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft size={14}/> Previous
            </button>
            {getPageNumbers().map((n, idx) => {
              if (n === '...') {
                return (
                  <span key={`dots-${idx}`} className="px-1.5 text-xs font-semibold text-[var(--color-gray-400)] select-none">
                    ...
                  </span>
                );
              }
              return (
                <button key={n} onClick={()=>setPage(Number(n))}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${n===page?'bg-[var(--color-primary)] text-white':'text-[var(--color-gray-500)] hover:bg-gray-100'}`}>
                  {n}
                </button>
              );
            })}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed">
              Next <ChevronRight size={14}/>
            </button>
          </div>
        </div>
      </div>

      {selectedPayout && (
        <PayoutDetailsModal
          payout={selectedPayout}
          onClose={() => setSelectedPayoutId(null)}
        />
      )}
    </div>
  );
}

interface PayoutDetailsModalProps {
  payout: AdminPayout;
  onClose: () => void;
}

function PayoutDetailsModal({ payout, onClose }: PayoutDetailsModalProps) {
  const statusColors = {
    CONFIRMED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    PENDING: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_14px]"></div>
          <div className="relative z-10 flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-[10px]">
                P
              </div>
              <span className="text-[10px] font-bold tracking-widest text-orange-400 uppercase">
                Payout Record
              </span>
            </div>
            <h3 className="text-lg font-extrabold tracking-tight truncate leading-tight mb-0.5">
              Payout Details
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">ID: {payout.id}</p>
          </div>
          <div className="relative z-10 shrink-0">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${payout.status === 'CONFIRMED' ? statusColors.CONFIRMED : statusColors.PENDING}`}>
              {payout.status === 'CONFIRMED' ? 'confirmed' : 'pending'}
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border-b border-slate-100">
          <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
              <DollarSign size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Amount</p>
              <p className="text-sm font-extrabold text-slate-900 leading-none">£{Number(payout.amount).toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <RefreshCw size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Round</p>
              <p className="text-sm font-extrabold text-slate-900 leading-none">Round {payout.round.roundNumber}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Recipient Info */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User size={14} className="text-slate-400" /> Recipient Info
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-xs text-slate-400">Full Name</span>
                <p className="font-semibold text-slate-800 mt-0.5">{payout.participant.fullName}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Email Address</span>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" /> {payout.participant.email}
                </p>
              </div>
            </div>
          </div>

          {/* Payout metadata */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400" /> Payout Info
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400">Created At</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {new Date(payout.createdAt).toLocaleString('en-GB')}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Confirmed At</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {payout.confirmedAt ? new Date(payout.confirmedAt).toLocaleString('en-GB') : '—'}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-slate-400">Confirmed By</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {payout.confirmedBy ? `${payout.confirmedBy.firstName} ${payout.confirmedBy.lastName}` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end rounded-b-3xl">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer border-none bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all outline-none shadow-sm"
          >
            <X size={15} />
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
