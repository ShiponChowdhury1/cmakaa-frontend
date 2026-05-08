import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  ...props
}: CardProps) {
  const variants: Record<string, string> = {
    default: 'bg-white border border-[var(--color-gray-200)] shadow-[var(--shadow-card)]',
    elevated: 'bg-white shadow-[var(--shadow-lg)]',
    bordered: 'bg-white border-2 border-[var(--color-gray-200)]',
    glass: 'bg-white/70 backdrop-blur-lg border border-white/20 shadow-[var(--shadow-lg)]',
  };

  const paddings: Record<string, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] transition-all duration-200',
        variants[variant],
        paddings[padding],
        hover && 'hover:shadow-[var(--shadow-xl)] hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
