import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export const inputClass =
  'h-8 w-full rounded-md border border-line bg-shell px-2.5 text-[12.5px] text-fg placeholder:text-fg-subtle/70 outline-none transition-colors focus:border-line-focus focus:ring-2 focus:ring-brand/15';

export const textareaClass =
  'w-full resize-none rounded-md border border-line bg-shell px-2.5 py-2 font-mono text-[12px] leading-relaxed text-fg placeholder:text-fg-subtle/70 outline-none transition-colors focus:border-line-focus focus:ring-2 focus:ring-brand/15';

interface FieldProps {
  label: string;
  hint?: ReactNode;
  error?: string | null;
  className?: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ label, hint, error, className, required, children }: FieldProps) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-fg-subtle">
        {label}
        {required && <span className="ml-1 text-brand font-bold">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-[11px] text-[#F87171]">{error}</span>
      ) : (
        hint && <span className="mt-1.5 block text-[11px] text-fg-subtle">{hint}</span>
      )}
    </label>
  );
}

