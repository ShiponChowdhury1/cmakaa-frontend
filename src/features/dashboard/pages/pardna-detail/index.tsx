import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useGetPardnaByIdQuery } from '@/store/features/createPardna/createPardna.api';

export default function PardnaDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'payments' | 'payouts'>('payments');

  // Query details from live API endpoint
  const { data: pardna, isLoading, isError } = useGetPardnaByIdQuery(id || '', {
    skip: !id,
  });

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-[#E57432] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Pardna details...</p>
      </div>
    );
  }

  if (isError || !pardna) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-red-500 font-semibold">Pardna not found or error loading details</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer border-none"
          style={{ background: '#E57432' }}
        >
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  const roundsCompleted = pardna.rounds?.filter((r) => r.status === 'COMPLETED').length || 0;
  const totalRounds = pardna.totalRounds || 1;
  const cycleProgress = (roundsCompleted / totalRounds) * 100;
  const nextRoundNumber = pardna.currentRound || roundsCompleted + 1;
  
  // Find the next active or upcoming payout round
  const nextRound = pardna.rounds?.find((r) => r.roundNumber === nextRoundNumber) ||
    pardna.rounds?.find((r) => r.status === 'ACTIVE' || r.status === 'UPCOMING');

  const monthName = format(currentMonth, 'MMMM yyyy');

  // Find round detail matching selected calendar date
  const highlightedRound = pardna.rounds?.find((r) =>
    isSameDay(new Date(r.payoutDate), selectedDate) ||
    isSameDay(new Date(r.collectionDate), selectedDate)
  );

  return (
    <div className="space-y-5 animate-fade-in pb-24">
      {/* Header */}
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
          {pardna.name}
        </h1>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Per Round</div>
          <div className="text-2xl font-bold text-[var(--color-dark)]">£{Number(pardna.contribution).toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Participants</div>
          <div className="text-2xl font-bold text-[var(--color-dark)]">{pardna.participants?.length || 0}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Rounds Done</div>
          <div className="text-2xl font-bold text-[var(--color-dark)]">
            {roundsCompleted}/{totalRounds}
          </div>
        </div>
      </div>

      {/* Cycle progress */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--color-dark)]">Cycle Progress</h3>
          <span className="text-xs font-bold text-[var(--color-primary)]">{cycleProgress.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] transition-all"
            style={{ width: `${cycleProgress}%` }}
          />
        </div>
      </div>

      {/* Next payout notification */}
      {nextRound && (
        <div className="bg-[var(--color-primary)] text-white rounded-xl p-4">
          <p className="text-sm font-semibold">Next payout: Round {nextRound.roundNumber}</p>
          <p className="text-xs mt-1 opacity-90">
            {nextRound.payoutTo?.fullName} receives £{(Number(pardna.contribution) * (pardna.participants?.length || 0)).toLocaleString()} on {format(new Date(nextRound.payoutDate), 'dd MMM yyyy')}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary)] hover:opacity-90 transition-all cursor-pointer border-none">
          + Record Payment
        </button>
        <button className="w-full py-3 rounded-xl text-sm font-semibold text-[var(--color-primary)] bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-all cursor-pointer">
          Manage Payouts
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-gray-100">
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'payments'
              ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
              : 'text-gray-400 border-transparent'
          }`}
        >
          Payment Management
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'payouts'
              ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
              : 'text-gray-400 border-transparent'
          }`}
        >
          Payout Management
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-[22px] border border-gray-100 p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-[40px_1fr_40px] items-center mb-4">
          <button
            onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <span className="text-2xl leading-none">‹</span>
          </button>
          <h3 className="text-center text-lg font-semibold text-[var(--color-dark)]">
            {monthName}
          </h3>
          <button
            onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <span className="text-2xl leading-none">›</span>
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium text-slate-500 mb-3">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-3 sm:gap-y-4 text-center">
            {calendarDays.map((day) => {
              const inMonth = day.getMonth() === currentMonth.getMonth();
              
              // Dynamic highlight matching round collection and payout dates
              const isCollectionDay = pardna.rounds?.some((r) => isSameDay(new Date(r.collectionDate), day)) || false;
              const isPayoutDay = pardna.rounds?.some((r) => isSameDay(new Date(r.payoutDate), day)) || false;
              const isCurrentDay = isToday(day);
              const isSelected = isSameDay(day, selectedDate);
              const isConfirmedDay = pardna.rounds?.some((r) => r.status === 'COMPLETED' && (isSameDay(new Date(r.collectionDate), day) || isSameDay(new Date(r.payoutDate), day))) || false;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => {
                    if (inMonth) {
                      setSelectedDate(day);
                    }
                  }}
                  className={`mx-auto h-11 w-11 sm:h-12 sm:w-12 rounded-full text-sm sm:text-base font-medium transition-all ${
                    inMonth ? 'cursor-pointer' : 'cursor-default'
                  } ${
                    isCurrentDay
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : isSelected
                      ? 'text-slate-900 font-semibold'
                      : isConfirmedDay
                      ? 'text-emerald-600 font-semibold'
                      : isPayoutDay
                      ? 'text-[#ff7a00] font-semibold'
                      : isCollectionDay
                      ? 'text-slate-900 font-semibold'
                      : inMonth
                      ? 'text-slate-500 hover:bg-slate-100'
                      : 'text-slate-300'
                  }`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5 text-xs sm:text-sm text-slate-500">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 rounded border border-orange-200 bg-white" />
                <span>Start date</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 rounded-full bg-[#ff8a00]" />
                <span>Collection day</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <span className="text-[15px] leading-none">✓</span>
                <span>Confirmed (collection or payout)</span>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="flex items-center justify-end gap-2">
                <span>End date</span>
                <span className="inline-flex h-4 w-4 rounded bg-slate-800" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <span>Payout day</span>
                <span className="inline-flex h-4 w-4 rounded-full bg-blue-500" />
              </div>
            </div>
          </div>
          <p className="text-center text-slate-400">Tap a highlighted day to see round details</p>
        </div>

        {highlightedRound && (
          <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3 text-sm">
            <p className="font-semibold text-[var(--color-dark)]">Round {highlightedRound.roundNumber} - Payout to {highlightedRound.payoutTo?.fullName}</p>
            <p className="text-xs text-slate-500 mt-1">
              Collection Date: {format(new Date(highlightedRound.collectionDate), 'EEE, d MMM yyyy')} <br />
              Payout Date: {format(new Date(highlightedRound.payoutDate), 'EEE, d MMM yyyy')}
            </p>
            <p className="text-xs font-semibold text-[#E57432] mt-1.5 uppercase">Status: {highlightedRound.status}</p>
          </div>
        )}
      </div>

      {/* Payout schedule */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-3">Payout Schedule</h3>
        <div className="space-y-2">
          {pardna.rounds?.map((round) => (
            <div
              key={round.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                  {round.roundNumber}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-dark)]">{round.payoutTo?.fullName}</p>
                  <p className="text-xs text-gray-500">{format(new Date(round.payoutDate), 'dd MMM yyyy')}</p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  round.status === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-700'
                    : round.status === 'ACTIVE'
                    ? 'bg-sky-50 text-sky-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {round.status === 'COMPLETED' ? '✓ Completed' : round.status === 'ACTIVE' ? 'Active' : 'Upcoming'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
