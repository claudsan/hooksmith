import { useMemo } from 'react';
import { Activity, Radar, SearchX, Trash2 } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { filterRequests, matchesFilter, type TrafficFilter } from '@/lib/http';
import { useNow } from '@/hooks/useNow';
import { Button } from '@/components/ui/Button';
import { CountPill } from '@/components/ui/Badges';
import { cn } from '@/lib/cn';
import { TrafficItem } from './TrafficItem';

interface TrafficListProps {
  width?: number;
}

export function TrafficList({ width }: TrafficListProps = {}) {
  const { t } = useTranslation();
  const { requests, filter, query, selectedRequestId } = useAppStore(
    useShallow((s) => ({ requests: s.requests, filter: s.trafficFilter, query: s.searchQuery, selectedRequestId: s.selectedRequestId })),
  );
  const { setTrafficFilter, selectRequest, clearRequests } = useAppStore.getState();
  const now = useNow();

  const filters: { id: TrafficFilter; label: string }[] = useMemo(() => [
    { id: 'ALL', label: t('traffic.all') },
    { id: 'POST', label: 'POST' },
    { id: 'GET', label: 'GET' },
    { id: 'ERRORS', label: t('traffic.errors') },
  ], [t]);

  const visible = useMemo(() => filterRequests(requests, filter, query), [requests, filter, query]);
  const counts = useMemo(
    () => Object.fromEntries(filters.map((f) => [f.id, requests.filter((r) => matchesFilter(r, f.id)).length])) as Record<TrafficFilter, number>,
    [requests, filters],
  );

  return (
    <section
      style={width ? { width: `${width}px` } : undefined}
      className={cn('flex shrink-0 flex-col border-r border-line bg-panel', !width && 'w-[350px]')}
    >
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-line pl-3.5 pr-2">
        <Activity className="h-4 w-4 text-brand" />
        <h2 className="text-[13px] font-semibold text-fg">{t('traffic.liveTraffic')}</h2>
        <CountPill value={visible.length} />
        <Button variant="ghost" size="xs" className="ml-auto text-[11.5px]" disabled={requests.length === 0} onClick={() => void clearRequests()}>
          <Trash2 className="h-3.5 w-3.5" />
          {t('traffic.clear')}
        </Button>
      </div>

      <div className="flex shrink-0 items-center gap-1 border-b border-line px-2.5 py-1.5">
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setTrafficFilter(f.id)}
              className={cn(
                'flex h-6 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] font-medium transition-colors',
                active ? 'bg-elevated text-fg shadow-[inset_0_0_0_1px_#232834]' : 'text-fg-subtle hover:bg-elevated/60 hover:text-fg-muted',
              )}
            >
              {f.label}
              <span className={cn('font-mono text-[11px]', active ? (f.id === 'ERRORS' && counts.ERRORS > 0 ? 'text-danger font-bold' : 'text-brand font-bold') : 'text-fg-subtle/70')}>
                {counts[f.id]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {visible.length === 0 ? (
          <TrafficEmpty hasRequests={requests.length > 0} />
        ) : (
          visible.map((req) => (
            <TrafficItem
              key={req.id}
              request={req}
              now={now}
              selected={req.id === selectedRequestId}
              onSelect={(id) => selectRequest(selectedRequestId === id ? null : id)}
            />
          ))
        )}
      </div>
    </section>
  );
}

function TrafficEmpty({ hasRequests }: { hasRequests: boolean }) {
  const { t } = useTranslation();

  if (hasRequests) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <SearchX className="h-5 w-5 text-fg-subtle" />
        <p className="text-[12.5px] text-fg-muted">{t('traffic.noMatch')}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-[rgba(249,115,22,0.25)] animate-soft-ping" />
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-elevated">
          <Radar className="h-5 w-5 text-brand" />
        </span>
      </div>
      <div>
        <p className="text-[13px] font-medium text-fg">{t('traffic.waiting')}</p>
        <p className="mt-1 text-[11.5px] text-fg-subtle max-w-[240px] leading-relaxed">
          {t('traffic.waitingSubtitle')}
        </p>
      </div>
    </div>
  );
}
