/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

const data = [
  { month: 'Jan', collected: 4200 },
  { month: 'Feb', collected: 4800 },
  { month: 'Mar', collected: 5100 },
  { month: 'Apr', collected: 4600 },
  { month: 'May', collected: 5300 },
  { month: 'Jun', collected: 4900 },
  { month: 'Jul', collected: 5500 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: '10px',
          padding: '10px 14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
          fontSize: '13px',
        }}
      >
        <p style={{ color: '#6B7280', marginBottom: 4, fontWeight: 500 }}>{label}</p>
        <p style={{ color: '#E57432', fontWeight: 700 }}>
          £{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function MonthlyCollectionsBarChart() {
  const total = data.reduce((sum, d) => sum + d.collected, 0);
  const peak = Math.max(...data.map((d) => d.collected));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-1">Monthly Collections</h3>
          <p className="text-xs text-[var(--color-gray-400)]">Hover over bars to see details</p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-xs text-[var(--color-gray-400)]">Total</p>
            <p className="text-sm font-bold text-[var(--color-dark)]">£{total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-gray-400)]">Peak</p>
            <p className="text-sm font-bold text-[var(--color-primary)]">£{peak.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <BarChart
        style={{ width: '100%', aspectRatio: 2.8 }}
        responsive
        data={data}
        margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <defs>
          <linearGradient id="monthly-collections-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E57432" />
            <stop offset="100%" stopColor="#FF9C65" />
          </linearGradient>
        </defs>
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(229,116,50,0.08)', radius: 6 }} />
        <Bar dataKey="collected" fill="url(#monthly-collections-grad)" radius={[6, 6, 0, 0]} maxBarSize={40} />
        <RechartsDevtools />
      </BarChart>
    </div>
  );
}
