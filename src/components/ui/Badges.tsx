import type { CapturedRequest } from '@/types/ipc';
import { methodStyle, SOURCE_STYLES, statusColor, statusText } from '@/lib/http';
import { cn } from '@/lib/cn';

export function MethodBadge({ method, size = 'sm', className }: { method: string; size?: 'sm' | 'md'; className?: string }) {
  const s = methodStyle(method);
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded font-mono font-bold leading-none tracking-wide',
        size === 'sm' ? 'h-[20px] min-w-[46px] px-1.5 text-[11px]' : 'h-[26px] min-w-[58px] px-2 text-[12px]',
        className,
      )}
      style={{ color: s.text, backgroundColor: s.bg, border: `1px solid ${s.border}` }}
    >
      {method.toUpperCase()}
    </span>
  );
}

export function StatusDot({ active, pulse = false, color }: { active: boolean; pulse?: boolean; color?: string }) {
  const c = color ?? (active ? '#10B981' : '#64748B');
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      {active && pulse && <span className="absolute inset-0 rounded-full animate-soft-ping" style={{ backgroundColor: c }} />}
      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
    </span>
  );
}

export function StatusCode({ code, withText = true, className }: { code: number; withText?: boolean; className?: string }) {
  const color = statusColor(code);
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-mono text-[12px]', className)}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-semibold" style={{ color }}>
        {code || 'ERR'}
      </span>
      {withText && <span className="text-fg-subtle">{statusText(code)}</span>}
    </span>
  );
}

export function StatusPill({ code }: { code: number }) {
  const color = statusColor(code);
  return (
    <span
      className="inline-flex h-[20px] items-center rounded px-1.5 font-mono text-[11px] font-semibold"
      style={{ color, backgroundColor: `${color}1F`, border: `1px solid ${color}40` }}
    >
      {code}
    </span>
  );
}

export function SourceTag({ source }: { source: CapturedRequest['source_type'] }) {
  const style = SOURCE_STYLES[source];
  if (!style) return null;
  return (
    <span
      className="inline-flex h-[18px] items-center rounded-sm px-1.5 font-mono text-[10px] font-semibold tracking-wider"
      style={{ color: style.color, backgroundColor: `${style.color}17`, border: `1px solid ${style.color}33` }}
    >
      {style.label}
    </span>
  );
}

export function CountPill({ value, active = false }: { value: number; active?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-4 min-w-[20px] items-center justify-center rounded px-1.5 font-mono text-[11px] leading-none',
        active ? 'bg-brand-soft text-brand font-semibold' : 'bg-hover text-fg-subtle',
      )}
    >
      {value}
    </span>
  );
}
