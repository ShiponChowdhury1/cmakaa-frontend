import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetPayoutHistoryQuery,
  useConfirmPayoutMutation,
} from '@/store/features/createPardna/createPardna.api';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  UserCheck, 
  Clock, 
  HelpCircle 
} from 'lucide-react';
import type { PayoutHistoryEntry } from '@/store/features/createPardna/createPardna.type';

export default function PayoutsPage() {
  const navigate = useNavigate();
  const { data: payouts = [], isLoading, error, refetch } = useGetPayoutHistoryQuery();
  const [confirmPayout, { isLoading: isConfirmingPayout }] = useConfirmPayoutMutation();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [confirmingPayoutId, setConfirmingPayoutId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // Calculate statistics
  const confirmedPayouts = payouts.filter((p) => p.status === 'CONFIRMED');
  const pendingPayouts = payouts.filter((p) => p.status === 'PENDING');
  
  const totalPaidOut = confirmedPayouts.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalRounds = payouts.length;
  const remaining = pendingPayouts.length;

  const handleConfirmPayout = async (payout: PayoutHistoryEntry) => {
    try {
      await confirmPayout({
        pardnaId: payout.participant.pardnaId,
        roundId: payout.roundId,
        participantId: payout.participantId,
        notes: notes || 'N/A',
      }).unwrap();
      toast.success('Payout confirmed successfully!');
      setConfirmingPayoutId(null);
      setNotes('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to confirm payout');
      refetch(); // sync in case of mismatch
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'P';
  };

  const filteredPayouts = payouts.filter((p) => {
    if (activeTab === 'pending') return p.status === 'PENDING';
    if (activeTab === 'confirmed') return p.status === 'CONFIRMED';
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-[#E57432] animate-spin" />
        <p className="text-gray-500 font-medium">Loading payout history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-500 font-semibold text-lg">Failed to load payouts</p>
        <p className="text-gray-500 text-sm max-w-sm">Please check your connection and try again.</p>
        <button 
          onClick={() => refetch()} 
          className="px-5 py-2.5 rounded-xl text-white font-medium bg-[#E57432] border-none cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24 max-w-4xl mx-auto">
      
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/payments')}
          className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shrink-0 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Payout History
          </h1>
          <p className="text-xs text-gray-400">Track and manage payouts across all your active Pardnas</p>
        </div>
      </div>

      {/* ── Stats Cards ─────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Total paid out */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-2 text-[#E57432]">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            £{totalPaidOut.toLocaleString()}
          </p>
          <p className="text-xs font-medium text-[#64748B] mt-1">Total Paid Out</p>
        </div>

        {/* Rounds done */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-2 text-[#16A34A]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {confirmedPayouts.length}/{totalRounds}
          </p>
          <p className="text-xs font-medium text-[#64748B] mt-1">Completed Payouts</p>
        </div>

        {/* Remaining */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-2 text-[#2563EB]">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {remaining}
          </p>
          <p className="text-xs font-medium text-[#64748B] mt-1">Pending Payouts</p>
        </div>
      </div>

      {/* ── Tabs Filter ────────────────────────────── */}
      <div className="flex gap-2 border-b border-gray-100 pb-px">
        {(['all', 'pending', 'confirmed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2.5 text-sm font-semibold capitalize cursor-pointer transition-all border-b-2 -mb-px"
            style={{
              borderColor: activeTab === tab ? '#E57432' : 'transparent',
              color: activeTab === tab ? '#E57432' : '#64748B',
            }}
          >
            {tab === 'all' ? 'All Payouts' : `${tab} Payouts`}
          </button>
        ))}
      </div>

      {/* ── List Content ────────────────────────────── */}
      <div className="space-y-4">
        {filteredPayouts.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-500 shadow-sm">
            <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-medium">No payouts found</p>
            <p className="text-xs text-gray-400 mt-1">There are no payouts in the "{activeTab}" filter.</p>
          </div>
        ) : (
          filteredPayouts.map((payout) => {
            const isCompleted = payout.status === 'CONFIRMED';
            const isExpanding = confirmingPayoutId === payout.id;

            return (
              <div
                key={payout.id}
                onClick={() => navigate(`/dashboard/payouts/${payout.id}`)}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:border-gray-200 transition-all cursor-pointer hover:shadow-md"
              >
                {/* Main Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-[#344966] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-inner">
                      {getInitials(payout.participant.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-bold text-[var(--color-dark)] leading-tight">
                        {payout.participant.fullName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-semibold text-[#5B46FF]">
                          {payout.round?.pardna?.name || 'Pardna Group'}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span>Round {payout.round?.roundNumber}</span>
                        {payout.createdAt && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span>Created {format(new Date(payout.createdAt), 'dd MMM yyyy')}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    {/* Amount */}
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-[var(--color-dark)]">
                        £{Number(payout.amount).toLocaleString()}
                      </p>
                      {isCompleted && payout.confirmedAt && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Paid {format(new Date(payout.confirmedAt), 'dd MMM yyyy')}
                        </p>
                      )}
                    </div>

                    {/* Status / Confirm Trigger */}
                    <div>
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 text-[#16A34A]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 border border-orange-100 rounded-full px-2.5 py-1">
                            Pending
                          </span>
                          {!isExpanding && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmingPayoutId(payout.id);
                                setNotes('');
                              }}
                              className="px-3 py-1.5 rounded-lg text-white font-semibold text-xs cursor-pointer border-none transition-opacity hover:opacity-90"
                              style={{ background: '#16A34A' }}
                            >
                              Confirm
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Confirm Section */}
                {isExpanding && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 pb-4 pt-3 border-t border-gray-100 bg-gray-50/50 space-y-3"
                  >
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                      <span className="text-amber-600 shrink-0 mt-0.5">⚠</span>
                      <p className="text-xs text-[var(--color-dark)]">
                        Confirm that <strong>{payout.participant.fullName}</strong> has received their £{Number(payout.amount).toLocaleString()} payout. This action will be recorded in the ledger.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes (optional)..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-gray-400 outline-none focus:border-[#E57432] transition-colors"
                      />
                    </div>

                    <div className="flex justify-end gap-2.5">
                      <button
                        onClick={() => {
                          setConfirmingPayoutId(null);
                          setNotes('');
                        }}
                        className="px-4 py-2 rounded-xl font-semibold text-xs cursor-pointer border border-gray-200 bg-white text-[var(--color-dark)] hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirmPayout(payout)}
                        disabled={isConfirmingPayout}
                        className="px-4 py-2 rounded-xl text-white font-semibold text-xs cursor-pointer border-none transition-opacity hover:opacity-90 bg-[#16A34A] disabled:opacity-50"
                      >
                        {isConfirmingPayout ? 'Confirming...' : 'Confirm Payout'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Additional details for completed payout (notes, who confirmed it) */}
                {isCompleted && (payout.notes || payout.confirmedBy) && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 pb-3.5 pt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-gray-50 text-xs text-[#64748B] bg-gray-50/20"
                  >
                    {payout.confirmedBy && (
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Confirmed by: <strong>{payout.confirmedBy.firstName} {payout.confirmedBy.lastName}</strong></span>
                      </span>
                    )}
                    {payout.notes && payout.notes !== 'N/A' && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-[#5B46FF]" />
                        <span>Notes: <em>"{payout.notes}"</em></span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
