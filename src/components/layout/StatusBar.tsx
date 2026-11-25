import { Layers } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { BrandMark } from '@/components/ui/Brand';
import { StatusDot } from '@/components/ui/Badges';
import { Kbd } from '@/components/ui/Kbd';

const Sep = () => <span className="h-3 w-px bg-line" />;

export function StatusBar() {
  const { t } = useTranslation();
  const activePorts = useAppStore(useShallow((s) => s.listeners.filter((l) => l.is_active).map((l) => l.port)));
  const total = useAppStore((s) => s.requests.length);
  const workspaceName = useAppStore((s) => s.workspaces.find((w) => w.id === s.activeWorkspaceId)?.name ?? '—');

  return (
    <footer className="flex h-[26px] shrink-0 items-center gap-3 border-t border-line bg-shell px-3 text-[12px] text-fg-muted">
      <span className="flex items-center gap-1.5">
        <StatusDot active={activePorts.length > 0} />
        {activePorts.length === 1
          ? t('statusbar.activePorts_one', { count: activePorts.length })
          : t('statusbar.activePorts_other', { count: activePorts.length })}
        {activePorts.length > 0 && <span className="font-mono text-fg-subtle">{activePorts.map((p) => `:${p}`).join(' ')}</span>}
      </span>
      <Sep />
      <span>
        <span className="font-mono text-fg">{total}</span> {t('statusbar.captured')}
      </span>
      <Sep />
      <span className="flex min-w-0 items-center gap-1.5">
        <Layers className="h-3 w-3 text-fg-subtle" />
        <span className="truncate">{workspaceName}</span>
      </span>

      <div className="ml-auto flex items-center gap-3 text-fg-subtle">
        <span className="flex items-center gap-1.5"><Kbd>Ctrl +/-</Kbd> {t('statusbar.zoom')}</span>
        <span className="flex items-center gap-1.5"><Kbd>Ctrl K</Kbd> {t('statusbar.search')}</span>
        <span className="flex items-center gap-1.5"><Kbd>Ctrl ↵</Kbd> {t('statusbar.replay')}</span>
        <span className="flex items-center gap-1.5"><Kbd>Ctrl M</Kbd> {t('statusbar.newMock')}</span>
        <Sep />
        <span className="flex items-center gap-1.5">
          <BrandMark className="h-2.5 w-auto opacity-90" />
          <span className="font-mono">v{__APP_VERSION__}</span>
        </span>
      </div>
    </footer>
  );
}
