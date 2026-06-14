import StatsCard from '../../components/StatsCard';
import PardnaStatusPieChart from '../../components/charts/PardnaStatusPieChart';
import MonthlyCollectionsBarChart from '../../components/charts/MonthlyCollectionsBarChart';
import UserGrowthLineChart from '../../components/charts/UserGrowthLineChart';

const analyticsStats = [
  {
    label: 'Monthly Growth',
    value: '+12.5%',
    iconBg: 'bg-green-50',
    trend: { direction: 'up' as const, color: 'text-green-500' },
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>,
  },
  {
    label: 'Avg Contribution',
    value: '£285',
    iconBg: 'bg-blue-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
  },
  {
    label: 'Active Groups',
    value: '12',
    iconBg: 'bg-purple-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  },
  {
    label: 'Completion Rate',
    value: '94%',
    iconBg: 'bg-amber-50',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>,
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Analytics
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {analyticsStats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts Row 1: Bar Chart + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyCollectionsBarChart />
        </div>
        <div>
          <PardnaStatusPieChart />
        </div>
      </div>

      {/* Charts Row 2: Line Chart */}
      <UserGrowthLineChart />
    </div>
  );
}
