import StatsCard from '../../components/StatsCard';
import ActivityItem from '../../components/ActivityItem';
import { useGetAdminPlatformStatsQuery } from '@/store/features/adminDashboard/adminDashboardApi';
import PardnaStatusPieChart from '../../components/charts/PardnaStatusPieChart';
import MonthlyCollectionsBarChart from '../../components/charts/MonthlyCollectionsBarChart';
import UserGrowthLineChart from '../../components/charts/UserGrowthLineChart';

const statsRow1Base = [
  {
    label: 'Total Bankers',
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
    iconBg: 'bg-blue-50',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    label: 'Total Pardnas',
    iconBg: 'bg-purple-50',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
  },
];

const statsRow2Base = [
  {
    label: 'Pending KYC',
    iconBg: 'bg-red-50',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
        <path d="M23 6l-9.5 9.5-5-5L1 18" />
        <path d="M17 6h6v6" />
      </svg>
    ),
  },
  {
    label: 'Confirmed Payouts',
    iconBg: 'bg-gray-100',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    label: 'Total Users',
    iconBg: 'bg-amber-50',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    label: 'Status',
    value: 'Live',
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

const recentActivity = [
  { type: 'payment' as const, title: 'Sarah J. Recorded payment', description: 'Family Monthly → Grace M.', time: '04:12' },
  { type: 'status' as const, title: 'System. Marked payment overdue', description: 'Community Build → Participant #4', time: '03:45' },
  { type: 'admin' as const, title: 'Admin. Suspended user', description: 'James King', time: '12:30' },
  { type: 'recycle' as const, title: 'Mike T. Completed cycle', description: 'Summer Holiday Fund', time: '10:00' },
];

const topPerformingPardnas = [
  { name: 'Family Monthly', score: 98, amount: '£12,400' },
  { name: 'Community Build', score: 92, amount: '£8,200' },
  { name: 'Youth Club Savings', score: 88, amount: '£6,800' },
  { name: 'Summer Holiday Fund', score: 85, amount: '£5,100' },
];

export default function OverviewPage() {
  const { data: response, isLoading: isStatsLoading } = useGetAdminPlatformStatsQuery();
  const stats = response?.data ?? null;

  const statsRow1 = [
    { ...statsRow1Base[0], value: stats?.totalBankers ?? 0 },
    { ...statsRow1Base[1], value: stats?.totalParticipants ?? 0 },
    { ...statsRow1Base[2], value: stats?.activePardnas ?? 0 },
    { ...statsRow1Base[3], value: stats?.totalPardnas ?? 0 },
  ];

  const statsRow2 = [
    { ...statsRow2Base[0], value: stats?.pendingKyc ?? 0 },
    { ...statsRow2Base[1], value: stats?.totalConfirmedPayouts ?? 0 },
    { ...statsRow2Base[2], value: (stats?.totalBankers ?? 0) + (stats?.totalParticipants ?? 0) },
    { ...statsRow2Base[3], value: isStatsLoading ? 'Loading...' : 'Live' },
  ];

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

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyCollectionsBarChart />
        </div>
        <div>
          <PardnaStatusPieChart />
        </div>
      </div>

      <UserGrowthLineChart />

      {/* Top Performing Pardnas */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-4">Top Performing Pardnas</h3>
        <div className="space-y-3">
          {topPerformingPardnas.map((p) => (
            <div key={p.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm font-medium text-[var(--color-dark)]">{p.name}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-32">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-full transition-all"
                    style={{ width: `${p.score}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-[var(--color-primary)]">{p.score}%</span>
                <span className="text-sm font-semibold text-[var(--color-dark)]">{p.amount}</span>
              </div>
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
