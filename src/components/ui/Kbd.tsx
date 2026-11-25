import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Kbd({ children, tone = 'default', className }: { children: ReactNode; tone?: 'default' | 'onBrand'; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-[18px] items-center rounded px-1.5 font-mono text-[11px] font-medium leading-none',
        tone === 'onBrand'
          ? 'bg-black/20 text-white/85'
          : 'border border-line bg-elevated text-fg-muted shadow-[0_1px_0_#232834]',
        className,
      )}
    >
      {children}
    </kbd>
  );
}

