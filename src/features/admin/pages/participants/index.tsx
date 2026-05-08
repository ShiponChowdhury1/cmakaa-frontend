import { useState } from 'react';
import { Search } from 'lucide-react';
import ParticipantsTab from './ParticipantsTab';
import PaymentsTab     from './PaymentsTab';
import PayoutsTab      from './PayoutsTab';

type Tab = 'participants' | 'payments' | 'payouts';

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  {
    key: 'participants',
    label: 'Participants',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    key: 'payments',
    label: 'Payments',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <path d="M2 10h20"/>
      </svg>
    ),
  },
  {
    key: 'payouts',
    label: 'Payouts',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8"/>
      </svg>
    ),
  },
];

export default function ParticipantsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('participants');
  const [search, setSearch]       = useState('');

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Participants
        </h1>
        <p className="text-sm text-[var(--color-gray-400)] mt-0.5">
          Manage participants, their payments and payouts
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]" />
        <input
          type="text"
          placeholder="Search participants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all"
        />
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-0">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearch(''); }}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all cursor-pointer border-none bg-transparent relative ${
                activeTab === tab.key
                  ? 'text-orange-500'
                  : 'text-[var(--color-gray-400)] hover:text-[var(--color-dark)]'
              }`}
            >
              {tab.icon}
              {tab.label}
              {/* Active underline */}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'participants' && <ParticipantsTab search={search} />}
        {activeTab === 'payments'     && <PaymentsTab     search={search} />}
        {activeTab === 'payouts'      && <PayoutsTab      search={search} />}
      </div>
    </div>
  );
}
