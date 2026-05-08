import Badge from '@/components/ui/Badge';

interface ActivityItemProps {
  type: 'payment' | 'status' | 'admin' | 'recycle';
  title: string;
  description: string;
  time: string;
}

const typeConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'purple' }> = {
  payment: { label: 'payment', variant: 'success' },
  status: { label: 'status', variant: 'warning' },
  admin: { label: 'admin', variant: 'error' },
  recycle: { label: 'recycle', variant: 'purple' },
};

export default function ActivityItem({ type, title, description, time }: ActivityItemProps) {
  const config = typeConfig[type];

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-1 rounded transition-colors">
      <div className="flex items-center gap-3">
        <Badge variant={config.variant} size="sm">
          {config.label}
        </Badge>
        <div>
          <p className="text-sm font-medium text-[var(--color-dark)]">{title}</p>
          <p className="text-xs text-[var(--color-gray-400)]">{description}</p>
        </div>
      </div>
      <span className="text-xs text-[var(--color-gray-400)] flex-shrink-0 ml-4">{time}</span>
    </div>
  );
}
