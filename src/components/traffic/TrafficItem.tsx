import { memo, useEffect, useRef } from 'react';
import type { CapturedRequest } from '@/types/ipc';
import { formatRelative } from '@/lib/http';
import { MethodBadge, SourceTag, StatusCode } from '@/components/ui/Badges';
import { cn } from '@/lib/cn';

interface TrafficItemProps {
  request: CapturedRequest;
  selected: boolean;
  now: number;
  onSelect: (id: string) => void;
}

const NEW_ITEM_WINDOW_MS = 1500;

function TrafficItemBase({ request, selected, now, onSelect }: TrafficItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const isNew = useRef(Date.now() - request.created_at < NEW_ITEM_WINDOW_MS).current;

  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onSelect(request.id)}
      className={cn(
        'relative block w-full border-b border-line/60 py-2.5 pl-3.5 pr-3 text-left transition-colors focus:outline-none',
        selected ? 'bg-elevated' : 'hover:bg-[#151920]',
        isNew && 'animate-flash-in',
      )}
    >
      {selected && <span className="absolute inset-y-0 left-0 w-[2px] bg-brand shadow-[0_0_12px_rgba(249,115,22,0.6)]" />}
      <div className="flex items-center gap-2">
        <MethodBadge method={request.method} />
        <span className={cn('min-w-0 flex-1 truncate font-mono text-[13px]', selected ? 'text-fg font-medium' : 'text-[#CBD5E1]')} title={request.path}>
          {request.path}
        </span>
        <span className="shrink-0 font-mono text-[11.5px] text-fg-subtle">{formatRelative(request.created_at, now)}</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2 pl-[54px] text-[12px]">
        <StatusCode code={request.response_status} />
        <span className="text-line-focus">·</span>
        <span className="font-mono text-fg-muted">{request.duration_ms}ms</span>
        <span className="ml-auto flex items-center gap-1.5">
          <SourceTag source={request.source_type} />
          <span className="font-mono text-[11px] text-fg-subtle">:{request.listener_port}</span>
        </span>
      </div>
    </button>
  );
}

export const TrafficItem = memo(TrafficItemBase);
