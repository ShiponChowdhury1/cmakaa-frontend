import StatsCard from '../../components/StatsCard';
import ActivityItem from '../../components/ActivityItem';
import Badge from '@/components/ui/Badge';

const statsRow1 = [
  {
    label: 'Total Bankers',
    value: '4',
    iconBg: 'bg-orange-50',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M8 7v10M12 7v10M16 7v10" />
      </svg>
    ),
  },
  {
    label: 'Total Participants',
    value: '38',
    iconBg: 'bg-emerald-50',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    label: 'Active Pardnas',
    value: '12',
    iconBg: 'bg-blue-50',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    label: 'Completed',
    value: '8',
    iconBg: 'bg-purple-50',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
  },
];

const statsRow2 = [
  {
    label: 'Overdue Rate',
    value: '6.4%',
    iconBg: 'bg-red-50',
    trend: { direction: 'down' as const, color: 'text-red-500' },
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
        <path d="M23 6l-9.5 9.5-5-5L1 18" />
        <path d="M17 6h6v6" />
      </svg>
    ),
  },
  {
    label: 'Avg Trust Score',
    value: '87',
    iconBg: 'bg-gray-100',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    label: 'Total Collected',
    value: '£34,200',
    iconBg: 'bg-amber-50',
    trend: { direction: 'up' as const, color: 'text-green-500' },
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    label: 'Total Users',
    value: '42',
    iconBg: 'bg-indigo-50',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];



const pardnasAttention = [
  { name: 'Family Monthly', banker: 'Sarah J.', overdue: 1 },
  { name: 'Community Build', banker: 'Donna R.', overdue: 2 },
  { name: 'Youth Club Savings', banker: 'James K.', overdue: 3 },
];

const recentActivity = [
  { type: 'payment' as const, title: 'Sarah J. Recorded payment', description: 'Family Monthly → Grace M.', time: '04:12' },
  { type: 'status' as const, title: 'System. Marked payment overdue', description: 'Community Build → Participant #4', time: '03:45' },
  { type: 'admin' as const, title: 'Admin. Suspended user', description: 'James King', time: '12:30' },
  { type: 'recycle' as const, title: 'Mike T. Completed cycle', description: 'Summer Holiday Fund', time: '10:00' },
];

export default function OverviewPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {statsRow1.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Stats Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {statsRow2.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>
      

      {/* Pardnas Needing Attention */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-[var(--color-dark)]">Pardnas Needing Attention</h3>
        </div>

        <div className="space-y-0">
          {pardnasAttention.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-dark)]">{p.name}</p>
                <p className="text-xs text-[var(--color-gray-400)]">by {p.banker}</p>
              </div>
              <Badge variant="error" size="sm">
                {p.overdue} overdue
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">Recent Activity</h3>
        <div>
          {recentActivity.map((a, i) => (
            <ActivityItem key={i} {...a} />
          ))}
        </div>
      </div>
    </div>
  );
}
