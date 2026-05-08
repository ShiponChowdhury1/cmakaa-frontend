import { cn } from '@/utils/cn';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  trend?: {
    direction: 'up' | 'down';
    color: string;
  };
}

export default function StatsCard({ label, value, icon, iconBg, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-md border border-gray-100 p-8 hover:shadow-md transition-all group">
      <div className="flex items-start gap-2">
        {/* Icon */}
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform',
            iconBg
          )}
        >
          {icon}
        </div>

        {/* Content */}
        <div>
          <p className="text-2xl font-bold text-[var(--color-dark)] leading-tight flex items-center gap-2">
            {value}
            {trend && (
              <span className={cn('text-xs', trend.color)}>
                {trend.direction === 'up' ? '↗' : '↘'}
              </span>
            )}
          </p>
          <p className="text-xs text-[var(--color-gray-400)] mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}
