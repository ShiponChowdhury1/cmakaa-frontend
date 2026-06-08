import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPardnasQuery } from '@/store/features/createPardna/createPardna.api';
import { format } from 'date-fns';

type PardnaStatus = 'active' | 'fair' | 'completed' | 'paused';
type FilterTab = 'all' | 'active' | 'completed' | 'paused';

const statusStyle: Record<PardnaStatus, string> = {
  active:    'text-emerald-600 bg-emerald-50',
  fair:      'text-amber-600  bg-amber-50',
  completed: 'text-blue-600   bg-blue-50',
  paused:    'text-gray-500   bg-gray-100',
};

const statusDot: Record<PardnaStatus, string> = {
  active:    'bg-emerald-500',
  fair:      'bg-amber-500',
  completed: 'bg-blue-500',
  paused:    'bg-gray-400',
};

export default function AllPardnasPage() {
  const navigate = useNavigate();
  const { data: pardnasList = [], isLoading } = useGetPardnasQuery();
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = pardnasList;
    if (filter !== 'all') {
      list = list.filter((p) => p.status?.toLowerCase() === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [pardnasList, filter, search]);

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: pardnasList.length },
    { key: 'active', label: 'Active', count: pardnasList.filter((p) => p.status?.toLowerCase() === 'active').length },
    { key: 'completed', label: 'Completed', count: pardnasList.filter((p) => p.status?.toLowerCase() === 'completed').length },
    { key: 'paused', label: 'Paused', count: pardnasList.filter((p) => p.status?.toLowerCase() === 'paused').length },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-[#E57432] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Pardnas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12 animate-fade-in">
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
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Your Pardnas
          </h1>
          <p className="text-xs text-[var(--color-gray-400)]">{pardnasList.length} pardna{pardnasList.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/pardnas/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 shrink-0"
          style={{ background: 'linear-gradient(135deg, #E57432 0%, #F4A261 100%)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Pardna
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pardnas by name..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#94A3B8] outline-none focus:border-[#E57432] transition-colors"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all whitespace-nowrap ${
              filter === tab.key
                ? 'bg-[#E57432] text-white border-[#E57432]'
                : 'bg-white text-[var(--color-dark)] border-gray-200 hover:border-orange-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Pardnas grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((p) => {
            const completedRounds = p.rounds?.filter((r) => r.status === 'COMPLETED').length || 0;
            const collected = `${completedRounds}/${p.totalRounds || 0}`;
            const nextRound = p.rounds?.find((r) => r.status === 'ACTIVE' || r.status === 'UPCOMING');
            const nextPayout = nextRound ? format(new Date(nextRound.payoutDate), 'd MMM') : '—';
            const statusKey = (p.status?.toLowerCase() as PardnaStatus) || 'active';
            const totalPot = Number(p.contribution) * (p.participants?.length || 0);
            const progress = p.totalRounds ? (completedRounds / p.totalRounds) * 100 : 0;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate(`/dashboard/pardnas/${p.id}`)}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[statusKey] || 'bg-gray-400'}`} />
                      <p className="text-sm font-bold text-[var(--color-dark)] truncate">{p.name}</p>
                    </div>
                    <p className="text-xs text-[#64748B] truncate">{p.description || 'No description'}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 ml-2 ${statusStyle[statusKey] || 'text-gray-500 bg-gray-100'}`}>
                    {statusKey}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] font-medium text-[#94A3B8] mb-1">
                    <span>Progress</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #E57432, #F4A261)',
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-orange-50 flex items-center justify-center shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E57432" strokeWidth="2.5">
                        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#94A3B8]">Per Round</p>
                      <p className="font-bold text-[var(--color-dark)]">£{Number(p.contribution).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#94A3B8]">Members</p>
                      <p className="font-bold text-[var(--color-dark)]">{p.participants?.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#94A3B8]">Rounds</p>
                      <p className="font-bold text-[var(--color-dark)]">{collected}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#94A3B8]">Next Payout</p>
                      <p className="font-bold text-[var(--color-dark)]">{nextPayout}</p>
                    </div>
                  </div>
                </div>

                {/* Total pot footer */}
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Total Pot</span>
                  <span className="text-sm font-bold text-[#E57432]">£{totalPot.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E57432" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-[var(--color-dark)] mb-1">No pardnas found</h3>
          <p className="text-xs text-[#94A3B8] max-w-xs">
            {search ? 'Try adjusting your search or filter.' : 'Create your first pardna to get started!'}
          </p>
          {!search && (
            <button
              onClick={() => navigate('/dashboard/pardnas/new')}
              className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer border-none transition-all hover:opacity-90"
              style={{ background: '#E57432' }}
            >
              + Create Pardna
            </button>
          )}
        </div>
      )}
    </div>
  );
}
