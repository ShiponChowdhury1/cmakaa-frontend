import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetPardnasQuery,
  useGetActiveRoundByPardnaIdQuery,
  useRecordPaymentMutation,
  useConfirmPayoutMutation,
} from '@/store/features/createPardna/createPardna.api';
import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';

/* ─── Status Config ─────────────────────────────────── */

const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
  PAID: { label: '✓ Paid', color: '#16A34A', bg: 'transparent' },
  PENDING: { label: 'Pending', color: '#64748B', bg: '#F1F5F9' },
  LATE: { label: 'Late', color: '#EA580C', bg: '#FFF7ED' },
  MISSED: { label: 'Missed', color: '#DC2626', bg: '#FEF2F2' },
};

/* ─── Component ─────────────────────────────────────── */

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryPardnaId = searchParams.get('pardnaId') || '';
  const querySection = searchParams.get('section') || 'payment';

  const [selectedPardnaId, setSelectedPardnaId] = useState<string>(queryPardnaId);
  const [activeSection, setActiveSection] = useState<'payment' | 'payout'>(
    querySection === 'payout' ? 'payout' : 'payment'
  );

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // Fetch all Pardnas
  const { data: pardnas = [], isLoading: isLoadingPardnas } = useGetPardnasQuery();

  // Sync state with URL query parameters
  useEffect(() => {
    if (queryPardnaId) {
      setSelectedPardnaId(queryPardnaId);
    } else if (pardnas.length > 0 && !selectedPardnaId) {
      setSelectedPardnaId(pardnas[0].id);
    }
  }, [queryPardnaId, pardnas]);

  useEffect(() => {
    if (querySection) {
      setActiveSection(querySection === 'payout' ? 'payout' : 'payment');
    }
  }, [querySection]);

  // Fetch Active Round for selected Pardna
  const {
    data: activeRound,
    isLoading: isLoadingRound,
    refetch: refetchActiveRound,
  } = useGetActiveRoundByPardnaIdQuery(selectedPardnaId, {
    skip: !selectedPardnaId,
  });

  const [recordPayment] = useRecordPaymentMutation();
  const [confirmPayout] = useConfirmPayoutMutation();

  const selectedPardna = pardnas.find((p) => p.id === selectedPardnaId);

  // Helper to fetch full participant info (like trustScore)
  const getFullParticipant = (participantId?: string) => {
    if (!participantId || !selectedPardna) return null;
    return selectedPardna.participants?.find((p) => p.id === participantId);
  };

  const handlePardnaChange = (id: string) => {
    setSelectedPardnaId(id);
    setSearchParams({ pardnaId: id, section: activeSection });
  };

  const handleSectionChange = (section: 'payment' | 'payout') => {
    setActiveSection(section);
    setSearchParams({ pardnaId: selectedPardnaId, section });
  };

  const openRecordModal = (paymentId?: string) => {
    if (paymentId) {
      setSelectedPaymentId(paymentId);
    } else {
      // Default to the first pending payment in active round
      const firstPending = activeRound?.payments?.find((p) => p.status !== 'PAID');
      setSelectedPaymentId(firstPending?.id || null);
    }
    setIsRecordModalOpen(true);
  };
  const handleMarkPaid = async () => {
    if (!selectedPaymentId || !activeRound) return;
    const paymentItem = activeRound.payments?.find((p) => p.id === selectedPaymentId);
    if (!paymentItem) return;

    // Close the modal immediately so the user sees the optimistic update
    setIsRecordModalOpen(false);
    setSelectedPaymentId(null);
    const savedNotes = notes;
    setNotes('');

    try {
      await recordPayment({
        roundId: activeRound.id,
        participantId: paymentItem.participant.id,
        amount: Number(paymentItem.amount),
        status: 'PAID',
        notes: savedNotes || 'N/A',
        pardnaId: selectedPardnaId, // enables optimistic cache patch
      }).unwrap();
      toast.success('Payment recorded successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to record payment');
      // Force refetch to sync UI with backend database state
      refetchActiveRound();
    }
  };

  if (isLoadingPardnas || (selectedPardnaId && isLoadingRound)) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-[#E57432] animate-spin" />
        <p className="text-gray-500 font-medium">Loading details...</p>
      </div>
    );
  }

  if (pardnas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center px-4">
        <p className="text-gray-500 font-semibold text-lg">You do not have any active Pardnas</p>
        <p className="text-gray-400 text-sm max-w-sm">Create a new Pardna first to start managing payments.</p>
        <button
          onClick={() => navigate('/dashboard/new-pardna')}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer border-none"
          style={{ background: '#E57432' }}
        >
          Create a Pardna
        </button>
      </div>
    );
  }

  // Calculate Metrics
  const contribution = selectedPardna ? Number(selectedPardna.contribution) : 0;
  const numParticipants = selectedPardna?.participants?.length || 0;
  const totalPot = contribution * numParticipants;
  const roundsCompleted = selectedPardna?.rounds?.filter((r) => r.status === 'COMPLETED').length || 0;
  const totalRounds = selectedPardna?.totalRounds || 1;
  const cycleProgress = (roundsCompleted / totalRounds) * 100;

  // Active Round Stats
  const paidCount = activeRound?.payments?.filter((p) => p.status === 'PAID').length || 0;
  const pendingCount = activeRound?.payments?.filter((p) => p.status === 'PENDING').length || 0;
  const lateCount = activeRound?.payments?.filter((p) => p.status === 'LATE').length || 0;
  const missedCount = activeRound?.payments?.filter((p) => p.status === 'MISSED').length || 0;

  const payoutText = activeRound?.payoutTo
    ? `${activeRound.payoutTo.fullName} receives £${totalPot.toLocaleString()} on ${format(
      new Date(activeRound.payoutDate),
      'dd MMM yyyy'
    )}`
    : 'No active payout';

  const selectedPayment = activeRound?.payments?.find((p) => p.id === selectedPaymentId) || null;

  return (
    <div className="space-y-4 animate-fade-in pb-24">

      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Payments Management
        </h1>
      </div>

      {/* ── Pardna Group Selector Dropdown ──────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Pardna Group
          </label>
          <p className="text-sm text-[#64748B]">{selectedPardna?.name || 'Select a group'}</p>
        </div>
        <div className="relative min-w-[200px]">
          <select
            value={selectedPardnaId}
            onChange={(e) => handlePardnaChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 bg-white text-sm font-semibold text-[var(--color-dark)] focus:border-[#E57432] focus:outline-none appearance-none cursor-pointer"
          >
            {pardnas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {!activeRound ? (
        <div className="flex flex-col items-center justify-center h-72 space-y-4 text-center px-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <p className="text-gray-500 font-semibold">No active round found for this Pardna</p>
          <p className="text-gray-400 text-xs max-w-xs">This group might be completed or has not started yet.</p>
        </div>
      ) : (
        <>
          {/* ── Stats Row ───────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Paid', value: paidCount, color: '#16A34A' },
              { label: 'Pending', value: pendingCount, color: '#1B2A4A' },
              { label: 'Late', value: lateCount, color: '#EA580C' },
              { label: 'Missed', value: missedCount, color: '#DC2626' },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-gray-100 rounded-2xl py-3 text-center shadow-sm">
                <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: s.color }}>
                  {s.value}
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Summary Cards ───────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: '💰', value: `£${contribution.toLocaleString()}`, label: 'Per round', iconBg: '#FFFBEB' },
              { icon: '👥', value: String(numParticipants), label: 'Participants', iconBg: '#EFF6FF' },
              { icon: '🗓', value: `${roundsCompleted}/${totalRounds}`, label: 'Rounds done', iconBg: '#F0FDF4' },
            ].map((c) => (
              <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center sm:block gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm mb-0 sm:mb-2 shrink-0" style={{ background: c.iconBg }}>
                  {c.icon}
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {c.value}
                  </p>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 sm:mt-1">{c.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Cycle Progress ──────────────────────────── */}
          <section className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="font-semibold text-[var(--color-dark)]">Cycle progress</span>
              <span className="font-bold text-[var(--color-dark)]">{cycleProgress.toFixed(1)}%</span>
            </div>

            <div className="h-3 rounded-full overflow-hidden mb-4" style={{ background: '#FF9C65' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${cycleProgress}%`, background: '#1E293B' }}
              />
            </div>

            {/* Next payout banner */}
            <div className="rounded-2xl p-4 text-white mb-4" style={{ background: '#F2935C' }}>
              <p className="text-xl sm:text-2xl font-bold leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Next payout: Round {activeRound.roundNumber}
              </p>
              <p className="text-sm mt-1.5 text-orange-50">{payoutText}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openRecordModal()}
                className="flex-1 py-3 rounded-xl text-white font-semibold text-sm cursor-pointer border-none transition-opacity hover:opacity-90"
                style={{ background: '#E57432' }}
              >
                + Record Payment
              </button>
              <button
                onClick={() => handleSectionChange('payout')}
                className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer border border-gray-200 transition-colors hover:border-gray-300"
                style={{ background: '#F3F4F6', color: 'var(--color-dark)' }}
              >
                📋 Manage Payouts
              </button>
            </div>
          </section>

          {/* ── Section Tabs ────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSectionChange('payment')}
              className="py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all"
              style={{
                background: '#FFFFFF',
                border: activeSection === 'payment' ? '2px solid #E57432' : '1px solid #E5E7EB',
                color: activeSection === 'payment' ? '#E57432' : 'var(--color-dark)',
              }}
            >
              Payment Management
            </button>
            <button
              onClick={() => handleSectionChange('payout')}
              className="py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all"
              style={{
                background: '#FFFFFF',
                border: activeSection === 'payout' ? '2px solid #E57432' : '1px solid #E5E7EB',
                color: activeSection === 'payout' ? '#E57432' : 'var(--color-dark)',
              }}
            >
              Payout Management
            </button>
          </div>

          {/* ── Content Area ────────────────────────────── */}
          {activeSection === 'payment' ? (
            /* ─ Payment Management ─ */
            <section className="space-y-3">
              {activeRound.payments?.map((p) => {
                const isPaid = p.status === 'PAID';
                const statusKey = isPaid ? 'PAID' : p.status;
                const { label, color, bg } = statusStyle[statusKey] || { label: p.status, color: '#64748B', bg: '#F1F5F9' };
                const participantDetails = getFullParticipant(p.participant?.id);

                return (
                  <div key={p.id} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#23334D] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {participantDetails?.payoutOrder || 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-[var(--color-dark)] leading-tight">
                          {p.participant?.fullName || 'Participant'}
                        </p>
                        <p className="text-sm text-[#64748B]">
                          ✓ Trust: {participantDetails?.trustScore?.compositeScore ?? 90}
                        </p>
                      </div>
                    </div>

                    {!isPaid ? (
                      <button
                        onClick={() => openRecordModal(p.id)}
                        className="px-4 py-2 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90 shrink-0"
                        style={{ background: 'linear-gradient(90deg, #E57432 0%, #F4A261 100%)' }}
                      >
                        ◔ Record
                      </button>
                    ) : (
                      <div className="text-right shrink-0">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-semibold inline-block"
                          style={{ color: color, background: bg }}
                        >
                          {label}
                        </span>
                        {p.paidAt && (
                          <p className="text-[10px] text-gray-400 mt-1">
                            {format(new Date(p.paidAt), 'dd MMM yyyy')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          ) : (
            /* ─ Payout Management ─ */
            <section className="space-y-3">
              {activeRound.payouts?.map((payout) => {
                const isCompleted = payout.status === 'CONFIRMED' || payout.status === 'COMPLETED';
                return (
                  <div key={payout.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#344966] text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {getFullParticipant(activeRound.payoutTo?.id)?.payoutOrder || 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-bold text-[var(--color-dark)] leading-tight">
                            {activeRound.payoutTo?.fullName || 'Recipient'}
                          </p>
                          <p className="text-sm text-[#64748B]">
                            £{Number(payout.amount).toLocaleString()}
                            {payout.confirmedAt && ` · Confirmed ${format(new Date(payout.confirmedAt), 'dd MMM yyyy')}`}
                          </p>
                        </div>
                      </div>

                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          <span className="text-sm font-semibold text-[#16A34A]">Completed</span>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-[#EA580C]">Pending</span>
                      )}
                    </div>

                    {!isCompleted && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                          <span className="text-amber-600 shrink-0 mt-0.5">⚠</span>
                          <p className="text-xs text-[var(--color-dark)]">
                            Confirm that <strong>{activeRound.payoutTo?.fullName}</strong> has received their £{Number(payout.amount).toLocaleString()} payout. This action will be recorded in the ledger.
                          </p>
                        </div>

                        <input
                          type="text"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add notes (optional)..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-gray-400 outline-none focus:border-[#E57432] transition-colors"
                        />

                        <button
                          onClick={async () => {
                            try {
                              await confirmPayout({
                                pardnaId: selectedPardnaId,
                                roundId: activeRound.id,
                                participantId: payout.participantId || activeRound.payoutTo?.id || '',
                                notes: notes || 'N/A',
                              }).unwrap();
                              toast.success('Payout confirmed successfully!');
                              setNotes('');
                            } catch (err: any) {
                              toast.error(err?.data?.message || 'Failed to confirm payout');
                              // Force refetch to sync UI with backend database state
                              refetchActiveRound();
                            }
                          }}
                          className="w-full py-3 rounded-xl text-white font-semibold text-sm cursor-pointer border-none transition-opacity hover:opacity-90 bg-[#16A34A]"
                        >
                          Confirm Payout
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          )}

          {/* ── Record Payment Modal ────────────────────── */}
          {isRecordModalOpen && (
            <div
              className="fixed inset-0 z-[999] flex items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(5, 10, 20, 0.45)', backdropFilter: 'blur(3px)' }}
              onClick={() => { setIsRecordModalOpen(false); setSelectedPaymentId(null); }}
            >
              <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
                      Record Payment
                    </h2>
                    <p className="text-xs text-[#5B46FF] mt-0.5">{selectedPardna?.name}</p>
                  </div>
                  <button
                    onClick={() => { setIsRecordModalOpen(false); setSelectedPaymentId(null); }}
                    className="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-500 cursor-pointer hover:bg-gray-50 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-center text-base font-medium mb-3 text-[var(--color-dark)]">Select participant</p>

                <div className="relative mb-4">
                  <select
                    value={selectedPaymentId ?? ''}
                    onChange={(e) => setSelectedPaymentId(e.target.value)}
                    className="w-full rounded-2xl border-2 border-[#E57432] px-4 py-3 bg-white text-base font-medium appearance-none text-[var(--color-dark)] cursor-pointer"
                  >
                    <option value="" disabled>Select participant</option>
                    {activeRound?.payments?.filter((p) => p.status !== 'PAID').map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.participant?.fullName}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">⌄</span>
                </div>

                {selectedPayment && (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#5B46FF]">Amount due this round</p>
                      <p className="text-4xl font-bold mt-1 text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
                        £{Number(selectedPayment.amount).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-[#344966] text-white text-xl font-bold flex items-center justify-center">
                      {selectedPayment.participant?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'P'}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add payment notes (optional)..."
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-gray-400 outline-none focus:border-[#E57432] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setIsRecordModalOpen(false); setSelectedPaymentId(null); }}
                    className="w-full py-3 rounded-2xl bg-white border border-gray-200 text-[#344054] font-medium text-sm cursor-pointer hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMarkPaid}
                    disabled={!selectedPayment}
                    className="w-full py-3 rounded-2xl text-white font-medium text-sm border-none cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: '#FF9500' }}
                  >
                    ✓ Mark Paid
                  </button>
                </div>

                <p className="text-xs text-center text-[#1F3D2B] mt-4">
                  ✓ On-time payments improve participant trust score
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
