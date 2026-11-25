import { cn } from '@/lib/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  tone?: 'brand' | 'success';
}

export function Toggle({ checked, onChange, label, tone = 'brand' }: ToggleProps) {
  const on = tone === 'success' ? 'bg-ok border-ok' : 'bg-brand border-brand';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        'relative inline-flex h-[16px] w-[28px] shrink-0 items-center rounded-full border transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
        checked ? on : 'border-line-focus bg-shell',
      )}
    >
      <span
        className={cn(
          'inline-block h-[10px] w-[10px] rounded-full shadow-sm transition-transform duration-150',
          checked ? 'translate-x-[14px] bg-white' : 'translate-x-[2px] bg-fg-subtle',
        )}
      />
    </button>
  );
}

