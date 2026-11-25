import { useEffect, useState, type ReactNode } from 'react';
import { ChevronDown, Copy, Layers, Minus, Plus, Search, Square, X } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { SEARCH_INPUT_ID } from '@/hooks/useAppLifecycle';
import { BrandMark, BrandName } from '@/components/ui/Brand';
import { Button } from '@/components/ui/Button';
import { StatusDot } from '@/components/ui/Badges';
import { Kbd } from '@/components/ui/Kbd';
import { LanguageToggle } from './LanguageToggle';
import { cn } from '@/lib/cn';

export function TitleBar() {
  const { t } = useTranslation();

  return (
    <header className="app-drag relative z-30 flex h-11 shrink-0 items-center border-b border-line bg-shell pl-4 pr-0">
      {/* Esquerda: Logo + Nome com bom espaçamento */}
      <div className="flex items-center gap-2.5 pr-4">
        <BrandMark className="h-[20px] w-auto drop-shadow-[0_0_12px_rgba(249,115,22,0.35)]" />
        <BrandName className="text-[14px] tracking-tight" />
      </div>

      <span className="h-4 w-px bg-line/80 mx-1" />

      {/* Seletor de Workspace com padding generoso */}
      <WorkspaceSelect />

      {/* Campo de busca central */}
      <SearchBox />

      {/* Direita: Language Toggle + Ports Pill + Listener + Window Controls */}
      <div className="app-no-drag ml-auto flex h-full items-center gap-2.5">
        <LanguageToggle />
        <PortsPill />
        <Button
          variant="primary"
          size="sm"
          className="h-[30px] px-3.5 text-[12.5px] font-semibold shadow-sm"
          onClick={() => useAppStore.getState().openListenerModal()}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span>{t('titlebar.newListener')}</span>
        </Button>
        <WindowControls />
      </div>
    </header>
  );
}

function WorkspaceSelect() {
  const { t } = useTranslation();
  const { workspaces, activeWorkspaceId, selectWorkspace } = useAppStore(
    useShallow((s) => ({ workspaces: s.workspaces, activeWorkspaceId: s.activeWorkspaceId, selectWorkspace: s.selectWorkspace })),
  );

  return (
    <div className="app-no-drag group relative ml-3 flex h-[30px] items-center rounded-lg border border-transparent pl-3 pr-7 transition-colors hover:border-line hover:bg-panel">
      <Layers className="mr-2 h-3.5 w-3.5 text-fg-subtle" />
      <select
        aria-label="Workspace"
        value={activeWorkspaceId ?? ''}
        onChange={(e) => e.target.value && void selectWorkspace(e.target.value)}
        className="max-w-[220px] appearance-none truncate bg-transparent text-[13px] font-medium text-fg-muted outline-none group-hover:text-fg cursor-pointer"
      >
        {workspaces.length === 0 && <option value="">{t('titlebar.noWorkspace')}</option>}
        {workspaces.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-fg-subtle" />
    </div>
  );
}

function SearchBox() {
  const { t } = useTranslation();
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);

  return (
    <div className="app-no-drag absolute left-1/2 top-1/2 w-[min(420px,34vw)] -translate-x-1/2 -translate-y-1/2">
      <div className="group flex h-[30px] items-center gap-2.5 rounded-lg border border-line bg-panel px-3 transition-colors focus-within:border-line-focus focus-within:bg-elevated hover:border-line-focus shadow-sm">
        <Search className="h-3.5 w-3.5 shrink-0 text-fg-subtle group-focus-within:text-brand" />
        <input
          id={SEARCH_INPUT_ID}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && searchQuery && (e.stopPropagation(), setSearchQuery(''))}
          placeholder={t('titlebar.searchPlaceholder')}
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-[13px] text-fg placeholder:text-fg-subtle/70 outline-none"
        />
        {searchQuery ? (
          <button type="button" onClick={() => setSearchQuery('')} className="text-fg-subtle hover:text-fg p-0.5" aria-label={t('titlebar.clearSearch')}>
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <Kbd>Ctrl K</Kbd>
        )}
      </div>
    </div>
  );
}

function PortsPill() {
  const { t } = useTranslation();
  const activeCount = useAppStore((s) => s.listeners.reduce((n, l) => n + (l.is_active ? 1 : 0), 0));
  return (
    <div
      className={cn(
        'flex h-[30px] items-center gap-2.5 rounded-full border px-3.5 text-[12px] font-medium transition-colors',
        activeCount > 0 ? 'border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.08)] text-[#6EE7B7]' : 'border-line bg-panel text-fg-subtle',
      )}
    >
      <StatusDot active={activeCount > 0} pulse />
      <span className="font-mono font-bold text-[12.5px]">{activeCount}</span>
      <span>{activeCount === 1 ? t('titlebar.portActive') : t('titlebar.portsActive')}</span>
    </div>
  );
}

function WindowControls() {
  const { t } = useTranslation();
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    const api = window.hookforge;
    if (!api) return;
    api.app.isMaximized().then(setMaximized).catch(() => undefined);
    return api.onMaximizedChange(setMaximized);
  }, []);

  const api = typeof window !== 'undefined' ? window.hookforge : undefined;

  return (
    <div className="ml-2 flex h-full items-stretch border-l border-line">
      <WindowButton label={t('titlebar.minimize')} onClick={() => void api?.app.minimize()}>
        <Minus className="h-4 w-4" strokeWidth={1.5} />
      </WindowButton>
      <WindowButton label={maximized ? t('titlebar.restore') : t('titlebar.maximize')} onClick={() => void api?.app.maximize()}>
        {maximized ? <Copy className="h-3.5 w-3.5 -scale-x-100" strokeWidth={1.5} /> : <Square className="h-3.5 w-3.5" strokeWidth={1.5} />}
      </WindowButton>
      <WindowButton label={t('common.close')} danger onClick={() => void api?.app.close()}>
        <X className="h-4 w-4" strokeWidth={1.5} />
      </WindowButton>
    </div>
  );
}

function WindowButton({ label, danger, onClick, children }: { label: string; danger?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        'flex w-[48px] items-center justify-center text-fg-muted transition-colors',
        danger ? 'hover:bg-[#E81123] hover:text-white' : 'hover:bg-hover hover:text-fg',
      )}
    >
      {children}
    </button>
  );
}
