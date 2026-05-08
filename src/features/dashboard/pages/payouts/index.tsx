import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Types ─────────────────────────────────────────── */

type PayoutStatus = 'completed' | 'pending';

interface PayoutEntry {
  id: number;
  name: string;
  initials: string;
  amount: number;
  date: string;
  status: PayoutStatus;
}

/* ─── Mock Data ─────────────────────────────────────── */

const PAYOUT_HISTORY: PayoutEntry[] = [
  { id: 1, name: 'Grace M.',   initials: 'GM', amount: 1600, date: '2024-11-20', status: 'completed' },
  { id: 2, name: 'Michael T.', initials: 'MT', amount: 1600, date: '2024-12-20', status: 'completed' },
  { id: 3, name: 'Sarah J.',   initials: 'SJ', amount: 1600, date: '2025-01-19', status: 'completed' },
  { id: 4, name: 'David K.',   initials: 'DK', amount: 1600, date: '2025-02-18', status: 'completed' },
  { id: 5, name: 'Ama O.',     initials: 'AO', amount: 1600, date: '2025-03-20', status: 'completed' },
  { id: 6, name: 'Kwame B.',   initials: 'KB', amount: 1600, date: '2026-04-21', status: 'completed' },
  { id: 7, name: 'Ruth N.',    initials: 'RN', amount: 1600, date: '2026-04-21', status: 'completed' },
  { id: 8, name: 'Patrick L.', initials: 'PL', amount: 1600, date: '2025-06-18', status: 'pending' },
];

/* ─── Component ─────────────────────────────────────── */

export default function PayoutsPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState(PAYOUT_HISTORY);
  const [isConfirming, setIsConfirming] = useState(false);
  const [notes, setNotes] = useState('');

  const pendingEntry = entries.find((e) => e.status === 'pending');
  const completedEntries = entries.filter((e) => e.status === 'completed');
  const totalPaidOut = completedEntries.reduce((sum, e) => sum + e.amount, 0);
  const roundsDone = completedEntries.length;
  const totalRounds = entries.length;
  const remaining = entries.filter((e) => e.status === 'pending').length;

  const handleConfirmPayout = () => {
    if (!pendingEntry) return;
    setEntries((prev) =>
      prev.map((e) =>
        e.id === pendingEntry.id
          ? { ...e, status: 'completed' as PayoutStatus, date: new Date().toISOString().split('T')[0] }
          : e
      )
    );
    setIsConfirming(false);
    setNotes('');
  };

  return (
    <div className="space-y-5 animate-fade-in pb-24">

      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/payments')}
          className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Payout Management
        </h1>
      </div>

      {/* ── Stats Cards ─────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total paid out */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-sm mx-auto mb-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            £{totalPaidOut.toLocaleString()}
          </p>
          <p className="text-sm text-[#64748B] mt-0.5">Total paid out</p>
        </div>

        {/* Rounds done */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-sm mx-auto mb-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {roundsDone}/{totalRounds}
          </p>
          <p className="text-sm text-[#64748B] mt-0.5">Rounds done</p>
        </div>

        {/* Remaining */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-sm mx-auto mb-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {remaining}
          </p>
          <p className="text-sm text-[#64748B] mt-0.5">Remaining</p>
        </div>
      </div>

      {/* ── Pending Payout Card ─────────────────────── */}
      {pendingEntry && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Pending person info */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {pendingEntry.id}
              </div>
              <div>
                <p className="text-base font-bold text-[var(--color-dark)] leading-tight">{pendingEntry.name}</p>
                <p className="text-sm text-[#64748B]">£{pendingEntry.amount.toLocaleString()} due {pendingEntry.date}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-[#EA580C]">Pending</span>
          </div>

          {/* Confirm section (expanded when clicking Mark Payout Complete) */}
          {isConfirming && (
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
              {/* Warning message */}
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                <span className="text-amber-600 shrink-0 mt-0.5">⚠</span>
                <p className="text-sm text-[var(--color-dark)]">
                  Confirm that <strong>{pendingEntry.name}</strong> has received their £{pendingEntry.amount.toLocaleString()} payout. This action will be recorded in the ledger.
                </p>
              </div>

              {/* Notes field */}
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes (optional)..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-gray-400 outline-none focus:border-[#E57432] transition-colors"
              />

              {/* Confirm + Cancel buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleConfirmPayout}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm cursor-pointer border-none transition-opacity hover:opacity-90"
                  style={{ background: '#16A34A' }}
                >
                  Confirm Payout
                </button>
                <button
                  onClick={() => { setIsConfirming(false); setNotes(''); }}
                  className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer border border-gray-200 bg-white text-[var(--color-dark)] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Mark Payout Complete button (only when NOT confirming) */}
          {!isConfirming && (
            <div className="px-4 pb-4">
              <button
                onClick={() => setIsConfirming(true)}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm cursor-pointer border-none transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(90deg, #E57432 0%, #FF9C65 100%)' }}
              >
                Mark Payout Complete
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Payout History ──────────────────────────── */}
      <div>
        <h2 className="text-base font-bold text-[var(--color-dark)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Payout History
        </h2>

        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: entry.status === 'pending' ? '#16A34A' : '#344966' }}
                >
                  {entry.id}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-[var(--color-dark)] leading-tight">{entry.name}</p>
                  <p className="text-sm text-[#64748B]">
                    £{entry.amount.toLocaleString()} · {entry.status === 'completed' ? 'Paid' : 'Due'} {entry.date}
                  </p>
                </div>
              </div>

              {entry.status === 'completed' ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span className="text-sm font-semibold text-[#16A34A]">Completed</span>
                </div>
              ) : (
                <button
                  onClick={() => { if (pendingEntry?.id === entry.id) setIsConfirming(true); }}
                  className="px-4 py-2 rounded-lg text-white font-semibold text-sm cursor-pointer border-none transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(90deg, #E57432 0%, #FF9C65 100%)' }}
                >
                  Mark Complete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
