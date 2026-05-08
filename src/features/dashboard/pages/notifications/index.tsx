import { useState } from 'react';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'overdue' | 'due-soon' | 'payouts'>('all');

  // Extended data with pardna groups
  const alertNotifications = [
    { id: 1, type: 'due-soon', title: 'Contributions due soon', desc: '2 participants have contributions due for Round 5.', group: 'Family Monthly', date: '2026-04-21', icon: 'alert' },
    { id: 2, type: 'due-soon', title: 'Contributions due soon', desc: '2 participants have contributions due for Round 4.', group: 'Work Friends Savings', date: '2026-04-21', icon: 'alert' },
    { id: 3, type: 'due-soon', title: 'Contributions due soon', desc: '2 participants have contributions due for Round 9.', group: 'Church Building Fund', date: '2026-04-21', icon: 'alert' },
    { id: 4, type: 'due-soon', title: 'Contributions due soon', desc: '2 participants have contributions due for Round 4.', group: 'Sisters Circle', date: '2026-04-21', icon: 'alert' },
    { id: 5, type: 'due-soon', title: 'Contributions due soon', desc: '2 participants have contributions due for Round 6.', group: 'Market Traders', date: '2026-04-21', icon: 'alert' },
    { id: 6, type: 'due-soon', title: 'Contributions due soon', desc: '2 participants have contributions due for Round 2.', group: 'Wedding Pandna', date: '2026-04-21', icon: 'alert' },
    { id: 7, type: 'due-soon', title: 'Contributions due soon', desc: '2 participants have contributions due for Round 7.', group: 'Back to School', date: '2026-04-21', icon: 'alert' },
    { id: 8, type: 'overdue', title: 'Late payment — Grace M.', desc: 'Round 6 contribution of £200 was 1 day overdue.', group: 'Family Monthly', date: '2026-04-20', icon: 'warning' },
    { id: 9, type: 'overdue', title: 'Late payment — Ama O.', desc: 'Round 4 contribution of £150 was 1 day overdue.', group: 'Sisters Circle', date: '2026-04-20', icon: 'warning' },
    { id: 10, type: 'overdue', title: 'Late payment — Kwame B.', desc: 'Round 6 contribution of £300 was 2 days overdue.', group: 'Market Traders', date: '2026-04-19', icon: 'warning' },
    { id: 11, type: 'payouts', title: 'Payout Ready', desc: 'You received £1,800 from Work Friends Savings.', group: 'Work Friends Savings', date: '2026-04-21', icon: 'success' },
  ];

  const filtered = filter === 'all' ? alertNotifications : alertNotifications.filter(n => n.type === filter);

  const getIcon = (type: string) => {
    if (type === 'alert') return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E57432" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/></svg>;
    if (type === 'warning') return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8294A" strokeWidth="2.5"><path d="M12 2l10 18H2z"/></svg>;
    if (type === 'success') return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
  };

  return (
    <div className="space-y-5 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {(['all', 'overdue', 'due-soon', 'payouts'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border-none whitespace-nowrap ${
              filter === f ? 'text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
            style={filter === f ? { background: 'linear-gradient(90deg, #E57432 0%, #FF9C65 100%)' } : undefined}
          >
            {f === 'all' ? 'All' : f === 'overdue' ? 'Overdue' : f === 'due-soon' ? 'Due Soon' : 'Payouts'}
          </button>
        ))}
      </div>

      {/* Notification items */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
            <p className="text-sm font-semibold text-gray-900">No notifications</p>
          </div>
        ) : (
          filtered.map(n => (
            <div key={n.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(n.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{n.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{n.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium">
                      <span className="text-gray-600">{n.group}</span>
                      <span className="text-gray-400 ml-2">{n.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
