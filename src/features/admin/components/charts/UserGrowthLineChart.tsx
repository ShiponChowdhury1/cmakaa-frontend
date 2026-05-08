import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { LabelProps } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

const data = [
  { month: 'Jan', users: 18, bankers: 2, participants: 16 },
  { month: 'Feb', users: 22, bankers: 2, participants: 20 },
  { month: 'Mar', users: 26, bankers: 3, participants: 23 },
  { month: 'Apr', users: 30, bankers: 3, participants: 27 },
  { month: 'May', users: 35, bankers: 4, participants: 31 },
  { month: 'Jun', users: 38, bankers: 4, participants: 34 },
  { month: 'Jul', users: 42, bankers: 4, participants: 38 },
];

const CustomizedLabel = ({ x, y, stroke, value }: LabelProps) => (
  <text x={x} y={y} dy={-6} fill={stroke as string} fontSize={10} textAnchor="middle" fontWeight={600}>
    {value}
  </text>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const colors: Record<string, string> = {
    users: '#7C3AED',
    bankers: '#F97316',
    participants: '#10B981',
  };
  const labels: Record<string, string> = {
    users: 'Total Users',
    bankers: 'Bankers',
    participants: 'Participants',
  };
  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: '10px',
      padding: '10px 14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
      fontSize: '13px',
      minWidth: '140px',
    }}>
      <p style={{ color: '#6B7280', marginBottom: 6, fontWeight: 600, borderBottom: '1px solid #F3F4F6', paddingBottom: 4 }}>{label}</p>
      {payload.map((item: any) => (
        <div key={item.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 3 }}>
          <span style={{ color: colors[item.dataKey] ?? item.stroke, fontWeight: 500 }}>
            {labels[item.dataKey] ?? item.dataKey}
          </span>
          <span style={{ color: '#111827', fontWeight: 700 }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function UserGrowthLineChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 w-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-dark)] mb-1">User Growth Trend</h3>
          <p className="text-xs text-[var(--color-gray-400)]">Total users, bankers and participants over time</p>
        </div>
        <div className="flex gap-4 text-right">
          {[
            { label: 'Users', value: 42, color: '#7C3AED' },
            { label: 'Bankers', value: 4, color: '#F97316' },
            { label: 'Members', value: 38, color: '#10B981' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-xs text-[var(--color-gray-400)]">{s.label}</p>
              <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <LineChart
        style={{ width: '100%', aspectRatio: 2.8 }}
        responsive
        data={data}
        margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '12px', color: '#6B7280', paddingTop: '12px' }}
          formatter={(value) => {
            const labels: Record<string, string> = { users: 'Total Users', bankers: 'Bankers', participants: 'Participants' };
            return labels[value] || value;
          }}
        />
        <Line
          type="monotone"
          dataKey="users"
          stroke="#7C3AED"
          strokeWidth={2.5}
          label={<CustomizedLabel />}
          dot={{ r: 4, fill: '#fff', stroke: '#7C3AED', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="bankers"
          stroke="#F97316"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#fff', stroke: '#F97316', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#F97316', stroke: '#fff', strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="participants"
          stroke="#10B981"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#fff', stroke: '#10B981', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
        />
        <RechartsDevtools />
      </LineChart>
    </div>
  );
}
