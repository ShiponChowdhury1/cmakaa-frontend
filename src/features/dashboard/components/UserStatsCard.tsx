import { cn } from '@/utils/cn';

interface UserStatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  subtitle?: string;
  trend?: {
    direction: 'up' | 'down';
    color: string;
  };
}

export default function UserStatsCard({ label, value, icon, iconBg, subtitle, trend }: UserStatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300 group cursor-default">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300',
            iconBg
          )}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="min-w-0">
          <p className="text-xs text-[var(--color-gray-400)] font-medium">{label}</p>
          <p className="text-xl font-bold text-[var(--color-dark)] leading-tight mt-0.5 flex items-center gap-1.5">
            {value}
            {trend && (
              <span className={cn('text-xs font-semibold', trend.color)}>
                {trend.direction === 'up' ? '↗' : '↘'}
              </span>
            )}
          </p>
          {subtitle && (
            <p className="text-[11px] text-[var(--color-gray-400)] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
