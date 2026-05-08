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

interface Pardna {
  id: string;
  name: string;
  amount: number;
  participants: number;
  rounds: number;
  roundsCompleted: number;
  frequency: string;
  startDate: string;
  collected: number;
  status: 'active' | 'paused' | 'completed';
}

interface PayoutSchedule {
  round: number;
  participant: string;
  date: string;
  status: 'completed' | 'upcoming' | 'pending';
}

const PARDNAS: Record<string, Pardna> = {
  '1': {
    id: '1',
    name: 'Family Monthly',
    amount: 200,
    participants: 8,
    rounds: 8,
    roundsCompleted: 7,
    frequency: 'Monthly',
    startDate: 'September 2024',
    collected: 1600,
    status: 'active',
  },
  '2': {
    id: '2',
    name: 'Work Friends Savings',
    amount: 100,
    participants: 6,
    rounds: 6,
    roundsCompleted: 4,
    frequency: 'Fortnightly',
    startDate: 'January 2025',
    collected: 400,
    status: 'active',
  },
  '3': {
    id: '3',
    name: 'Church Building Fund',
    amount: 250,
    participants: 12,
    rounds: 12,
    roundsCompleted: 11,
    frequency: 'Monthly',
    startDate: 'April 2024',
    collected: 2750,
    status: 'active',
  },
  '4': {
    id: '4',
    name: 'Sisters Circle',
    amount: 100,
    participants: 7,
    rounds: 7,
    roundsCompleted: 3,
    frequency: 'Weekly',
    startDate: 'February 2025',
    collected: 300,
    status: 'active',
  },
};

const PAYOUT_SCHEDULES: Record<string, PayoutSchedule[]> = {
  '1': [
    { round: 1, participant: 'Grace M.', date: '2024-11-21', status: 'completed' },
    { round: 2, participant: 'Michael T.', date: '2024-12-21', status: 'completed' },
    { round: 3, participant: 'Sarah J.', date: '2025-01-21', status: 'completed' },
    { round: 4, participant: 'David K.', date: '2025-02-21', status: 'completed' },
    { round: 5, participant: 'Ama O.', date: '2025-03-21', status: 'completed' },
    { round: 6, participant: 'Kwame B.', date: '2025-04-21', status: 'completed' },
    { round: 7, participant: 'Ruth N.', date: '2025-05-21', status: 'completed' },
    { round: 8, participant: 'Patrick L.', date: '2025-06-18', status: 'upcoming' },
  ],
  '2': [
    { round: 1, participant: 'Sarah', date: '2025-02-15', status: 'completed' },
    { round: 2, participant: 'Lisa A', date: '2025-03-01', status: 'completed' },
    { round: 3, participant: 'Hassan T', date: '2025-03-15', status: 'completed' },
    { round: 4, participant: 'Tomi B', date: '2025-04-01', status: 'completed' },
    { round: 5, participant: 'Marcus B', date: '2025-04-15', status: 'upcoming' },
    { round: 6, participant: 'Kevin S', date: '2025-05-01', status: 'pending' },
  ],
  '3': [
    { round: 1, participant: 'Member 1', date: '2024-05-01', status: 'completed' },
    { round: 2, participant: 'Member 2', date: '2024-06-01', status: 'completed' },
    { round: 3, participant: 'Member 3', date: '2024-07-01', status: 'completed' },
    { round: 4, participant: 'Member 4', date: '2024-08-01', status: 'completed' },
    { round: 5, participant: 'Member 5', date: '2024-09-01', status: 'completed' },
    { round: 6, participant: 'Member 6', date: '2024-10-01', status: 'completed' },
    { round: 7, participant: 'Member 7', date: '2024-11-01', status: 'completed' },
    { round: 8, participant: 'Member 8', date: '2024-12-01', status: 'completed' },
    { round: 9, participant: 'Member 9', date: '2025-01-01', status: 'completed' },
    { round: 10, participant: 'Member 10', date: '2025-02-01', status: 'completed' },
    { round: 11, participant: 'Member 11', date: '2025-03-01', status: 'completed' },
    { round: 12, participant: 'Member 12', date: '2025-04-01', status: 'upcoming' },
  ],
  '4': [
    { round: 1, participant: 'Grace M.', date: '2025-02-15', status: 'completed' },
    { round: 2, participant: 'Sarah J.', date: '2025-02-22', status: 'completed' },
    { round: 3, participant: 'Lisa A', date: '2025-03-01', status: 'completed' },
    { round: 4, participant: 'Nadia F', date: '2025-03-08', status: 'upcoming' },
    { round: 5, participant: 'Ama O', date: '2025-03-15', status: 'pending' },
    { round: 6, participant: 'Kwame B', date: '2025-03-22', status: 'pending' },
    { round: 7, participant: 'Ruth N', date: '2025-03-29', status: 'pending' },
  ],
};

export default function PardnaDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'payments' | 'payouts'>('payments');

  const pardna = id && PARDNAS[id];
  const schedules = id ? PAYOUT_SCHEDULES[id] : [];

  if (!pardna) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Pardna not found</p>
      </div>
    );
  }

  const cycleProgress = (pardna.roundsCompleted / pardna.rounds) * 100;
  const nextRound = pardna.roundsCompleted + 1;
  const nextPayout = schedules.find((s) => s.round === nextRound);

  const monthName = format(currentMonth, 'MMMM yyyy');
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const highlightedDay = schedules.find((schedule) =>
    isSameDay(new Date(schedule.date), selectedDate)
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
          <div className="text-2xl font-bold text-[var(--color-dark)]">£{pardna.amount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Participants</div>
          <div className="text-2xl font-bold text-[var(--color-dark)]">{pardna.participants}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Rounds Done</div>
          <div className="text-2xl font-bold text-[var(--color-dark)]">
            {pardna.roundsCompleted}/{pardna.rounds}
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
      {nextPayout && (
        <div className="bg-[var(--color-primary)] text-white rounded-xl p-4">
          <p className="text-sm font-semibold">Next payout: Round {nextRound}</p>
          <p className="text-xs mt-1 opacity-90">
            {nextPayout.participant} receives £{pardna.amount * pardna.participants} on {nextPayout.date}
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
              const isCollectionDay = isSameDay(day, new Date(2024, 10, 20));
              const isPayoutDay = isSameDay(day, new Date(2024, 10, 21));
              const isCurrentDay = isToday(day);
              const isSelected = isSameDay(day, selectedDate);

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

        {highlightedDay && (
          <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3 text-sm">
            <p className="font-semibold text-[var(--color-dark)]">{highlightedDay.participant}</p>
            <p className="text-xs text-slate-500 mt-1">
              Payout {format(new Date(highlightedDay.date), 'EEE, d MMM yyyy')}
            </p>
          </div>
        )}
      </div>

      {/* Payout schedule */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-3">Payout Schedule</h3>
        <div className="space-y-2">
          {schedules.map((schedule) => (
            <div
              key={schedule.round}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                  {schedule.round}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-dark)]">{schedule.participant}</p>
                  <p className="text-xs text-gray-500">{schedule.date}</p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  schedule.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700'
                    : schedule.status === 'upcoming'
                    ? 'bg-sky-50 text-sky-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {schedule.status === 'completed' ? '✓ Completed' : schedule.status === 'upcoming' ? 'Upcoming' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
