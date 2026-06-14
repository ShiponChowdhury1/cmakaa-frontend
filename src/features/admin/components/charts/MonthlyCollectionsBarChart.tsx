import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

type MonthlyItem = { month: string; amount: number };

interface Props {
  data?: MonthlyItem[];
}

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

export default function MonthlyCollectionsBarChart({ data }: Props) {
  const series = (data ?? []).map(d => ({ month: d.month, collected: Number(d.amount ?? 0) }));
  const total = series.reduce((sum, d) => sum + d.collected, 0);
  const peak = series.length ? Math.max(...series.map((d) => d.collected)) : 0;

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
      <div className="w-full h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={series.length ? series : [{ month: '—', collected: 0 }]}
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
        </ResponsiveContainer>
      </div>
    </div>
  );
}
