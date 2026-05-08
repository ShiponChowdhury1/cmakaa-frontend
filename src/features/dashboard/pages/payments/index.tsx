import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Participant, PardnaGroup, ParticipantStatus } from './types';

/* ─── Mock Data ─────────────────────────────────────── */

const PARTICIPANTS: Participant[] = [
  { id: 1, name: 'Grace M.',   initials: 'G', trust: 95, amount: 200, date: '2026-04-21', status: 'paid' },
  { id: 2, name: 'Michael T.', initials: 'M', trust: 88, amount: 200, date: '2026-04-17', status: 'paid' },
  { id: 3, name: 'Sarah J.',   initials: 'S', trust: 92, amount: 200, date: '2026-04-18', status: 'paid' },
  { id: 4, name: 'David K.',   initials: 'D', trust: 78, amount: 200, date: '2026-04-19', status: 'paid' },
  { id: 5, name: 'Ama O.',     initials: 'A', trust: 90, amount: 200, date: '2026-04-20', status: 'paid' },
  { id: 6, name: 'Kwame B.',   initials: 'K', trust: 85, amount: 200,                     status: 'missed' },
  { id: 7, name: 'Ruth N.',    initials: 'R', trust: 70, amount: 200,                     status: 'pending' },
  { id: 8, name: 'Patrick L.', initials: 'P', trust: 82, amount: 200,                     status: 'pending' },
];

const GROUPS: PardnaGroup[] = [
  { id: 1, name: 'Family Monthly',       roundLabel: 'Round 6', amountPerPerson: 200, paidCount: 5, totalCount: 8,  participants: PARTICIPANTS },
  { id: 2, name: 'Work Friends Savings', roundLabel: 'Round 4', amountPerPerson: 100, paidCount: 4, totalCount: 6,  participants: [] },
  { id: 3, name: 'Church Building Fund', roundLabel: 'Round 9', amountPerPerson: 250, paidCount: 10, totalCount: 12, participants: [] },
  { id: 4, name: 'Sisters Circle',       roundLabel: 'Round 4', amountPerPerson: 150, paidCount: 2, totalCount: 7,  participants: [] },
  { id: 5, name: 'Market Traders',       roundLabel: 'Round 6', amountPerPerson: 300, paidCount: 8, totalCount: 10, participants: [] },
  { id: 6, name: 'Wedding Pardna',       roundLabel: 'Round 2', amountPerPerson: 500, paidCount: 0, totalCount: 5,  participants: [] },
];

const PAYMENT_STATS = { paid: 27, pending: 21, late: 2, missed: 7 };

const OVERVIEW = {
  amountPerRound: 200,
  participants: 8,
  roundsDone: 6,
  totalRounds: 8,
  cycleProgress: 75.5,
  nextPayout: { round: 7, text: 'Ruth N. receives £1,600 on 2026-05-19 — tap to confirm' },
};

/* ─── Status Config ─────────────────────────────────── */

const statusStyle: Record<ParticipantStatus, { label: string; color: string; bg: string }> = {
  paid:    { label: '✓ Paid',  color: '#16A34A', bg: 'transparent' },
  pending: { label: 'Pending', color: '#64748B', bg: '#F1F5F9' },
  late:    { label: 'Late',    color: '#EA580C', bg: '#FFF7ED' },
  missed:  { label: 'Missed',  color: '#DC2626', bg: '#FEF2F2' },
};

/* ─── Component ─────────────────────────────────────── */

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'payment' | 'payout'>('payment');
  const [participants, setParticipants] = useState(PARTICIPANTS);
  const [openGroupId, setOpenGroupId] = useState<number>(1);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<number | null>(null);

  const openRecordModal = (participant?: Participant) => {
    setSelectedParticipantId(participant?.id ?? null);
    setIsRecordModalOpen(true);
  };

  const handleMarkPaid = () => {
    if (!selectedParticipantId) return;
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === selectedParticipantId
          ? { ...p, status: 'paid' as ParticipantStatus, date: '2026-04-22' }
          : p
      )
    );
    setIsRecordModalOpen(false);
    setSelectedParticipantId(null);
  };

  const groups = GROUPS.map((group) =>
    group.id === 1
      ? { ...group, participants, paidCount: participants.filter((p) => p.status === 'paid').length }
      : group
  );

  const selectedParticipant = participants.find((p) => p.id === selectedParticipantId) ?? null;

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

      {/* ── Stats Row: Paid / Pending / Late / Missed ─ */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Paid',    value: PAYMENT_STATS.paid,    color: '#16A34A' },
          { label: 'Pending', value: PAYMENT_STATS.pending, color: '#1B2A4A' },
          { label: 'Late',    value: PAYMENT_STATS.late,    color: '#EA580C' },
          { label: 'Missed',  value: PAYMENT_STATS.missed,  color: '#DC2626' },
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
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '💰', value: `£${OVERVIEW.amountPerRound}`, label: 'Per round',   iconBg: '#FFFBEB' },
          { icon: '👥', value: String(OVERVIEW.participants),  label: 'Participants', iconBg: '#EFF6FF' },
          { icon: '🗓',  value: `${OVERVIEW.roundsDone}/${OVERVIEW.totalRounds}`, label: 'Rounds done', iconBg: '#F0FDF4' },
        ].map((c) => (
          <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm mb-2" style={{ background: c.iconBg }}>
              {c.icon}
            </div>
            <p className="text-3xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {c.value}
            </p>
            <p className="text-sm text-[#64748B] mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* ── Cycle Progress ──────────────────────────── */}
      <section className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="font-semibold text-[var(--color-dark)]">Cycle progress</span>
          <span className="font-bold text-[var(--color-dark)]">{OVERVIEW.cycleProgress}%</span>
        </div>

        {/* Progress bar: filled = #1E293B, remaining = #FF9C65 */}
        <div className="h-3 rounded-full overflow-hidden mb-4" style={{ background: '#FF9C65' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${OVERVIEW.cycleProgress}%`, background: '#1E293B' }}
          />
        </div>

        {/* Next payout banner */}
        <div className="rounded-2xl p-4 text-white mb-4" style={{ background: '#F2935C' }}>
          <p className="text-xl sm:text-2xl font-bold leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Next payout: Round {OVERVIEW.nextPayout.round}
          </p>
          <p className="text-sm mt-1.5 text-orange-50">{OVERVIEW.nextPayout.text}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Record Payment — #E57432 */}
          <button
            onClick={() => openRecordModal()}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm cursor-pointer border-none transition-opacity hover:opacity-90"
            style={{ background: '#E57432' }}
          >
            + Record Payment
          </button>
          {/* Manage Payouts — #F3F4F6 */}
          <button
            onClick={() => navigate('/dashboard/payouts')}
            className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer border border-gray-200 transition-colors hover:border-gray-300"
            style={{ background: '#F3F4F6', color: 'var(--color-dark)' }}
          >
            📋 Manage Payouts
          </button>
        </div>
      </section>

      {/* ── Section Tabs ────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Payment Management — active: #E57432 border + text */}
        <button
          onClick={() => setActiveSection('payment')}
          className="py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all"
          style={{
            background: activeSection === 'payment' ? '#FFFFFF' : '#FFFFFF',
            border: activeSection === 'payment' ? '2px solid #E57432' : '1px solid #E5E7EB',
            color: activeSection === 'payment' ? '#E57432' : 'var(--color-dark)',
          }}
        >
          Payment Management
        </button>
        {/* Payout Management — bg #FFFFFF */}
        <button
          onClick={() => setActiveSection('payout')}
          className="py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all"
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
        /* ─ Payment Management: Participant rows ─ */
        <section className="space-y-3">
          {participants.map((p) => {
            const cfg = statusStyle[p.status];
            return (
              <div key={p.id} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#23334D] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {p.id}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-bold text-[var(--color-dark)] leading-tight">{p.name}</p>
                    <p className="text-sm text-[#64748B]">✓ Trust: {p.trust}</p>
                  </div>
                </div>

                {p.status === 'pending' || p.status === 'missed' ? (
                  <button
                    onClick={() => openRecordModal(p)}
                    className="px-4 py-2 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90 shrink-0"
                    style={{ background: 'linear-gradient(90deg, #E57432 0%, #F4A261 100%)' }}
                  >
                    ◔ Record
                  </button>
                ) : (
                  <span
                    className="px-3 py-1 rounded-full text-sm font-semibold shrink-0"
                    style={{ color: cfg.color, background: cfg.bg }}
                  >
                    {cfg.label}
                  </span>
                )}
              </div>
            );
          })}
        </section>
      ) : (
        /* ─ Payout Management: Expandable groups ─ */
        <section className="space-y-3">
          {groups.map((group) => {
            const isOpen = group.id === openGroupId;
            return (
              <div key={group.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenGroupId((prev) => (prev === group.id ? 0 : group.id))}
                  className="w-full p-4 flex items-center justify-between text-left border-none bg-white cursor-pointer"
                >
                  <div>
                    <p className="text-base font-bold text-[var(--color-dark)] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                      {group.name}
                    </p>
                    <p className="text-sm text-[#64748B] mt-0.5">
                      {group.roundLabel} · £{group.amountPerPerson}/person
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: '#EB7E42' }}>
                      {group.paidCount}/{group.totalCount} paid
                    </span>
                    <span className={`text-[#94A3B8] transition-transform text-lg ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
                  </div>
                </button>

                {isOpen && group.participants.length > 0 && (
                  <div className="px-4 pb-4 space-y-2 bg-gray-50/60 border-t border-gray-100">
                    {group.participants.map((p) => {
                      const cfg = statusStyle[p.status];
                      return (
                        <div key={p.id} className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-[#344966] text-white text-sm font-bold flex items-center justify-center shrink-0">
                              {p.id}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[var(--color-dark)] leading-tight">{p.name}</p>
                              <p className="text-xs text-[#64748B]">£{p.amount}{p.date ? ` · ${p.date}` : ''}</p>
                            </div>
                          </div>

                          {p.status === 'paid' ? (
                            <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ color: '#16A34A' }}>✓ Paid</span>
                          ) : (
                            <button
                              onClick={() => openRecordModal(p)}
                              className="px-3 py-1.5 rounded-lg text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90"
                              style={{ background: 'linear-gradient(90deg, #E57432 0%, #F4A261 100%)' }}
                            >
                              ◔ Record
                            </button>
                          )}
                        </div>
                      );
                    })}
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
          onClick={() => { setIsRecordModalOpen(false); setSelectedParticipantId(null); }}
        >
          <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Record Payment
                </h2>
                <p className="text-xs text-[#5B46FF] mt-0.5">Family Monthly</p>
              </div>
              <button
                onClick={() => { setIsRecordModalOpen(false); setSelectedParticipantId(null); }}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-500 cursor-pointer hover:bg-gray-50 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-center text-base font-medium mb-3 text-[var(--color-dark)]">Select participant</p>

            <div className="relative mb-4">
              <select
                value={selectedParticipantId ?? ''}
                onChange={(e) => setSelectedParticipantId(Number(e.target.value))}
                className="w-full rounded-2xl border-2 border-[#E57432] px-4 py-3 bg-white text-base font-medium appearance-none text-[var(--color-dark)]"
              >
                <option value="" disabled>Select participant</option>
                {participants.filter((p) => p.status !== 'paid').map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">⌄</span>
            </div>

            {selectedParticipant && (
              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#5B46FF]">Amount due this round</p>
                  <p className="text-4xl font-bold mt-1 text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    £{selectedParticipant.amount}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-[#344966] text-white text-xl font-bold flex items-center justify-center">
                  {selectedParticipant.initials}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setIsRecordModalOpen(false); setSelectedParticipantId(null); }}
                className="w-full py-3 rounded-2xl bg-white border border-gray-200 text-[#344054] font-medium text-sm cursor-pointer hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkPaid}
                disabled={!selectedParticipant}
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
    </div>
  );
}
