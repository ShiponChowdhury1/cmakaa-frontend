import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-[var(--color-dark)] mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-lg border border-[var(--color-gray-200)] bg-white',
            'text-[var(--color-dark)] placeholder:text-[var(--color-gray-400)]',
            'transition-all duration-200',
            'focus:outline-none focus:border-[var(--color-primary)]',
            'hover:border-[var(--color-gray-300)]',
            !!icon && 'pl-10',
            error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]/20',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}
