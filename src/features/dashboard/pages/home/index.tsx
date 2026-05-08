import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type PardnaStatus = 'active' | 'fair' | 'completed' | 'paused';

const todos = [
  'Collect Sweets Fiend payment from Sarah Monday',
  'Chase Kwame B: missed payment',
  'Review Kwame B: build query',
];

const recentActivities = [
  { id: '1', label: 'Confirmed payout — Kwame B, £1,600', time: 'today' },
];

const upcomingPayouts = [
  { id: '1', name: 'Sarah',   pardna: 'Sweets Fiend',         amount: '£100', date: '20 Feb 2025' },
  { id: '2', name: 'Lisa A',  pardna: 'Work Friends Savings',  amount: '£600', date: '26 Feb 2025' },
  { id: '3', name: 'Nadia T', pardna: 'Sisters Circle',        amount: '£150', date: '1 Mar 2025' },
];

const statusStyle: Record<PardnaStatus, string> = {
  active:    'text-emerald-600 bg-emerald-50',
  fair:      'text-amber-600  bg-amber-50',
  completed: 'text-blue-600   bg-blue-50',
  paused:    'text-gray-500   bg-gray-100',
};

interface PardnaCard {
  id: string; name: string; status: PardnaStatus;
  frequency: string; collected: string; amount: string; nextPayout: string;
}

const pardnas: PardnaCard[] = [
  { id: '1', name: 'Family Monthly',       status: 'active', frequency: 'Monthly',     collected: '5/8',   amount: '£200', nextPayout: '19 May' },
  { id: '2', name: 'Work Friends Savings', status: 'active', frequency: 'Fortnightly', collected: '4/6',   amount: '£100', nextPayout: '26 Feb' },
  { id: '3', name: 'Church Building Fund', status: 'active', frequency: 'Monthly',     collected: '11/12', amount: '£250', nextPayout: '29 Mar' },
  { id: '4', name: 'Sisters Circle',       status: 'fair',   frequency: 'Weekly',      collected: '3/7',   amount: '£100', nextPayout: '22 Feb' },
];

function GettingStartedBanner({ onReadGuide }: { onReadGuide: () => void }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-[#E57432] flex items-center justify-center shrink-0">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-dark)]">New to pardnas?</p>
          <button
            onClick={onReadGuide}
            className="text-xs font-semibold text-[#E57432] hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Read the 2-min guide →
          </button>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer bg-transparent border-none p-1"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 pb-12">

      {/* Banner */}
      <GettingStartedBanner onReadGuide={() => navigate('/dashboard/guide')} />

      {/* Greeting + New Pardna */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {greeting}, Sarah
          </h1>
          <p className="text-xs text-[var(--color-gray-400)] mt-0.5">sarah_j@pardnabook</p>
          <p className="text-xs text-[var(--color-gray-400)]">You have 7 active pardnas</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/pardnas/new')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 shrink-0"
          style={{ background: '#E57432' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Pardna
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6 py-2">
        <div className="flex flex-col gap-1">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mb-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]">7</p>
          <p className="text-xs text-[var(--color-gray-400)]">Active Pardnas</p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mb-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]">56</p>
          <p className="text-xs text-[var(--color-gray-400)]">Total Participants</p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mb-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-[var(--color-dark)]">£9.6k</p>
          <p className="text-xs text-[var(--color-gray-400)]">Total Value</p>
        </div>
      </div>

      {/* Today's To Do + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-3">Today's To Do</h3>
          <ol className="space-y-2">
            {todos.map((todo, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                <span className="shrink-0 font-medium text-[var(--color-dark)]">{i + 1}.</span>
                {todo}
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--color-dark)]">Recent Activity</h3>
            <button
              onClick={() => navigate('/dashboard/audit')}
              className="text-xs font-semibold text-[#E57432] hover:text-[#c5612a] transition-colors cursor-pointer bg-transparent border-none"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((a) => (
              <div key={a.id} className="flex items-center justify-between">
                <p className="text-sm text-[var(--color-text-muted)]">{a.label}</p>
                <span className="text-xs text-[var(--color-gray-400)]">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Payouts */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--color-dark)]">Upcoming Payouts</h3>
          <button
            onClick={() => navigate('/dashboard/payouts')}
            className="text-xs font-semibold text-[#E57432] hover:text-[#c5612a] transition-colors cursor-pointer bg-transparent border-none"
          >
            View all
          </button>
        </div>
        <div className="space-y-0">
          {upcomingPayouts.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <p className="text-sm text-[var(--color-dark)]">{p.name} — {p.pardna}</p>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[var(--color-dark)]">{p.amount}</span>
                <span className="text-xs text-[var(--color-gray-400)] w-24 text-right">{p.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Pardnas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Your Pardnas
          </h3>
          <button
            onClick={() => navigate('/dashboard/pardnas')}
            className="text-xs font-semibold text-[#E57432] hover:text-[#c5612a] transition-colors cursor-pointer bg-transparent border-none"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pardnas.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:border-orange-200 transition-all cursor-pointer group"
              onClick={() => navigate(`/dashboard/pardnas/${p.id}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[var(--color-dark)]">{p.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[p.status]}`}>
                    {p.status}
                  </span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="text-gray-300 group-hover:text-[#E57432] transition-colors">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <p className="text-[var(--color-gray-400)]">Frequency:</p>
                  <p className="font-medium text-[var(--color-dark)] mt-0.5">{p.frequency}</p>
                </div>
                <div>
                  <p className="text-[var(--color-gray-400)]">Collected:</p>
                  <p className="font-medium text-[var(--color-dark)] mt-0.5">{p.collected}</p>
                </div>
                <div>
                  <p className="text-[var(--color-gray-400)]">Amount:</p>
                  <p className="font-medium text-[var(--color-dark)] mt-0.5">{p.amount}</p>
                </div>
                <div>
                  <p className="text-[var(--color-gray-400)]">Next payout:</p>
                  <p className="font-medium text-[var(--color-dark)] mt-0.5">{p.nextPayout}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}