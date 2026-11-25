import { useState, type ReactNode } from 'react';
import { Lock, Pencil, Plus, Radio, Send, ShieldCheck, Timer, Trash2, Waypoints } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import type { Listener, MockRule } from '@/types/ipc';
import { BrandIcon } from '@/components/ui/Brand';
import { IconButton } from '@/components/ui/Button';
import { CountPill, MethodBadge, StatusDot, StatusPill } from '@/components/ui/Badges';
import { Toggle } from '@/components/ui/Toggle';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { cn } from '@/lib/cn';

export function Sidebar() {
  const { t } = useTranslation();
  const listeners = useAppStore((s) => s.listeners);
  const mocks = useAppStore((s) => s.mocks);
  const deleteListener = useAppStore((s) => s.deleteListener);
  const deleteMock = useAppStore((s) => s.deleteMock);
  const { openListenerModal, openMockModal } = useAppStore.getState();
  const [mockToDelete, setMockToDelete] = useState<MockRule | null>(null);
  const [listenerToDelete, setListenerToDelete] = useState<Listener | null>(null);

  return (
    <aside className="flex w-[250px] shrink-0 flex-col border-r border-line bg-panel">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-3.5">
        <Section title={t('sidebar.listeners')} count={listeners.length} onAdd={() => openListenerModal()} addLabel={t('sidebar.newListener')}>
          {listeners.length === 0 ? (
            <EmptyHint icon={<Radio className="h-4 w-4" />} text={t('sidebar.noListeners')} action={t('sidebar.createListener')} onAction={() => openListenerModal()} />
          ) : (
            listeners.map((l) => (
              <ListenerCard
                key={l.id}
                listener={l}
                onDelete={() => setListenerToDelete(l)}
              />
            ))
          )}
        </Section>

        <Section title={t('sidebar.mockRules')} count={mocks.length} onAdd={() => openMockModal()} addLabel={t('sidebar.newMockRule')}>
          {mocks.length === 0 ? (
            <EmptyHint icon={<Waypoints className="h-4 w-4" />} text={t('sidebar.noMockRules')} action={t('sidebar.createMock')} onAction={() => openMockModal()} />
          ) : (
            mocks.map((m) => <MockCard key={m.id} mock={m} onDelete={() => setMockToDelete(m)} />)
          )}
        </Section>
      </div>
      <SidebarFooter />

      <ConfirmModal
        isOpen={Boolean(listenerToDelete)}
        title={t('confirm.deleteListenerTitle')}
        description={t('confirm.deleteListenerDesc', {
          name: listenerToDelete?.name ? `${listenerToDelete.name} (:${listenerToDelete.port})` : `:${listenerToDelete?.port}`,
        })}
        confirmLabel={t('confirm.deleteBtn')}
        cancelLabel={t('confirm.cancelBtn')}
        tone="danger"
        onClose={() => setListenerToDelete(null)}
        onConfirm={async () => {
          if (listenerToDelete) {
            await deleteListener(listenerToDelete);
            setListenerToDelete(null);
          }
        }}
      />

      <ConfirmModal
        isOpen={Boolean(mockToDelete)}
        title={t('confirm.deleteMockTitle')}
        description={t('confirm.deleteMockDesc', {
          name: mockToDelete?.name || mockToDelete?.path || '',
        })}
        confirmLabel={t('confirm.deleteBtn')}
        cancelLabel={t('confirm.cancelBtn')}
        tone="danger"
        onClose={() => setMockToDelete(null)}
        onConfirm={async () => {
          if (mockToDelete) {
            await deleteMock(mockToDelete);
            setMockToDelete(null);
          }
        }}
      />
    </aside>
  );
}

function Section({ title, count, onAdd, addLabel, children }: { title: string; count: number; onAdd: () => void; addLabel: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-2.5 flex items-center gap-2 px-1">
        <h3 className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-fg-subtle">{title}</h3>
        <CountPill value={count} />
        <IconButton label={addLabel} onClick={onAdd} className="ml-auto">
          <Plus className="h-3.5 w-3.5" />
        </IconButton>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function EmptyHint({ icon, text, action, onAction }: { icon: ReactNode; text: string; action: string; onAction: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-4 text-center">
      <span className="text-fg-subtle">{icon}</span>
      <span className="text-[12px] text-fg-subtle">{text}</span>
      <button type="button" onClick={onAction} className="text-[12px] font-medium text-brand hover:text-[#FB923C]">
        {action}
      </button>
    </div>
  );
}

function ListenerCard({ listener, onDelete }: { listener: Listener; onDelete: () => void }) {
  const { t } = useTranslation();
  const active = listener.is_active === 1;
  const isHttps = Boolean(listener.is_https);
  const { toggleListener, openListenerModal } = useAppStore.getState();
  const displayName = listener.name?.trim() || `Listener :${listener.port}`;

  return (
    <div
      onClick={() => openListenerModal(listener)}
      className={cn(
        'group cursor-pointer rounded-lg border bg-elevated px-3 py-2.5 transition-colors',
        active ? 'border-line hover:border-line-focus' : 'border-line/70 bg-elevated/50',
      )}
    >
      <div className="flex items-center gap-2">
        <StatusDot active={active} pulse />
        <span className={cn('min-w-0 flex-1 truncate text-[13px] font-semibold', active ? 'text-fg' : 'text-fg-muted')} title={displayName}>
          {displayName}
        </span>
        <div className="ml-auto flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
            <IconButton label={t('sidebar.editListener')} onClick={() => openListenerModal(listener)}>
              <Pencil className="h-3.5 w-3.5" />
            </IconButton>
            <IconButton
              label={t('sidebar.deleteListener')}
              tone="danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </IconButton>
          </div>
          <Toggle checked={active} onChange={() => void toggleListener(listener)} label={active ? t('sidebar.disableRule') : t('sidebar.enableRule')} />
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <span className={cn('font-mono text-[12px] font-bold', active ? 'text-fg' : 'text-fg-muted')}>:{listener.port}</span>
        {isHttps ? (
          <span className="flex items-center gap-0.5 rounded bg-brand/15 border border-brand/30 px-1.5 py-0.2 font-mono text-[9.5px] font-bold text-brand shadow-sm">
            HTTPS
          </span>
        ) : (
          <span className="font-mono text-[9.5px] text-fg-subtle">
            HTTP
          </span>
        )}
        <span className={cn('text-[10px] font-bold uppercase tracking-wider', active ? 'text-ok' : 'text-fg-subtle')}>
          {active ? t('sidebar.live') : t('sidebar.off')}
        </span>
      </div>
    </div>
  );
}

function MockCard({ mock, onDelete }: { mock: MockRule; onDelete: () => void }) {
  const { t } = useTranslation();
  const enabled = mock.enabled !== 0;
  const selectedMockId = useAppStore((s) => s.selectedMockId);
  const selectMock = useAppStore((s) => s.selectMock);
  const openMockModal = useAppStore((s) => s.openMockModal);
  const toggleMock = useAppStore((s) => s.toggleMock);
  const listeners = useAppStore((s) => s.listeners);
  const isSelected = selectedMockId === mock.id;

  const targetListener = mock.listener_port ? listeners.find((l) => l.port === mock.listener_port) : null;
  const isHttps = Boolean(targetListener?.is_https);

  return (
    <div
      onClick={() => selectMock(isSelected ? null : mock.id)}
      className={cn(
        'group cursor-pointer rounded-lg border px-3 py-2.5 transition-all',
        isSelected
          ? 'border-brand/70 bg-brand/10 shadow-sm ring-1 ring-brand/30'
          : enabled
            ? 'border-line bg-elevated hover:border-line-focus'
            : 'border-line/70 bg-elevated/50',
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'min-w-0 flex-1 truncate text-[13px] font-medium',
            isSelected ? 'text-brand font-semibold' : enabled ? 'text-fg font-semibold' : 'text-fg-muted',
          )}
          title={mock.name}
        >
          {mock.name || t('sidebar.untitledRule')}
        </span>
        <Toggle
          checked={enabled}
          onChange={() => void toggleMock(mock)}
          label={enabled ? t('sidebar.disableRule') : t('sidebar.enableRule')}
        />
      </div>
      <div className={cn('mt-2 flex items-center gap-2', !enabled && 'opacity-60')}>
        <MethodBadge method={mock.method} />
        <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-fg-muted" title={mock.path}>
          {mock.path}
        </span>
      </div>
      <div className={cn('mt-2 flex items-center gap-2', !enabled && 'opacity-60')}>
        <StatusPill code={mock.status_code} />
        {mock.delay_ms > 0 && (
          <span className="inline-flex h-[20px] items-center gap-1 rounded border border-line bg-shell px-1.5 font-mono text-[11px] text-fg-muted">
            <Timer className="h-3 w-3" />
            {mock.delay_ms}ms
          </span>
        )}
        {mock.listener_port ? (
          <span
            className="inline-flex h-[20px] items-center gap-1 rounded border border-brand/35 bg-brand/10 px-1.5 font-mono text-[10.5px] font-bold text-brand shadow-sm"
            title={`Mock para a porta :${mock.listener_port} (${isHttps ? 'HTTPS / SSL' : 'HTTP'})`}
          >
            {isHttps && <Lock className="h-2.5 w-2.5 text-brand" />}
            <span>:{mock.listener_port}</span>
            {isHttps ? (
              <span className="rounded bg-brand/20 px-0.5 text-[8.5px] font-extrabold uppercase text-brand">
                SSL
              </span>
            ) : (
              <span className="text-[8.5px] font-medium text-fg-subtle">
                HTTP
              </span>
            )}
          </span>
        ) : (
          <span
            className="inline-flex h-[20px] items-center rounded border border-line bg-shell px-1.5 font-mono text-[10px] text-fg-subtle"
            title="Aplica-se a todos os listeners"
          >
            {t('sidebar.allPorts')}
          </span>
        )}
        {mock.callback_url && (
          <span
            className="inline-flex h-[20px] items-center gap-1 rounded border border-[#F43F5E]/30 bg-[#F43F5E]/10 px-1.5 font-mono text-[10px] font-bold text-[#FB7185] shadow-sm"
            title={`Callback ${mock.callback_method || 'POST'} -> ${mock.callback_url}`}
          >
            <Send className="h-2.5 w-2.5" />
            CB
          </span>
        )}
        <div className="ml-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <IconButton
            label={t('sidebar.editRule')}
            className="hover:text-brand"
            onClick={(e) => {
              e.stopPropagation();
              openMockModal(mock);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton
            label={t('sidebar.deleteRule')}
            tone="danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function SidebarFooter() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2.5 border-t border-line px-3 py-3">
      <BrandIcon className="h-7 w-7 rounded-[7px]" />
      <div className="min-w-0 flex-1 leading-tight">
        <div className="text-[13px] font-semibold text-fg">Hooksmith</div>
        <div className="font-mono text-[11px] text-fg-subtle">v{__APP_VERSION__}</div>
      </div>
      <span
        className="inline-flex items-center gap-1 rounded-full border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.08)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#6EE7B7]"
        title={t('common.localTagline')}
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        {t('common.local')}
      </span>
    </div>
  );
}
