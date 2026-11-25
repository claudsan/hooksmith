import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'active';
type Size = 'xs' | 'sm' | 'md';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white shadow-brand hover:bg-brand-hover active:translate-y-px',
  secondary: 'border border-line bg-elevated text-fg hover:border-line-focus hover:bg-hover',
  ghost: 'text-fg-muted hover:bg-hover hover:text-fg',
  danger: 'text-[#F87171] hover:bg-[rgba(239,68,68,0.12)]',
  active: 'border border-[rgba(249,115,22,0.35)] bg-brand-soft text-brand',
};

const SIZES: Record<Size, string> = {
  xs: 'h-6 gap-1 px-2 text-[11px]',
  sm: 'h-7 gap-1.5 px-2.5 text-[12px]',
  md: 'h-8 gap-2 px-3.5 text-[12.5px]',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({ variant = 'secondary', size = 'sm', className, type = 'button', children, ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md font-medium transition-[background-color,color,border-color,transform] duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:pointer-events-none disabled:opacity-45',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  tone?: 'default' | 'danger';
  children: ReactNode;
}

export function IconButton({ label, tone = 'default', className, children, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={cn(
        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-40',
        tone === 'danger' ? 'text-fg-subtle hover:bg-[rgba(239,68,68,0.12)] hover:text-[#F87171]' : 'text-fg-subtle hover:bg-hover hover:text-fg',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

