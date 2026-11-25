import { BookmarkPlus, Copy, Edit3, Globe, Loader2, Play, RotateCcw, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { MethodBadge } from '@/components/ui/Badges';
import { Button } from '@/components/ui/Button';
import { Kbd } from '@/components/ui/Kbd';

export function ReplayBar() {
  const { t } = useTranslation();
  const {
    requests,
    selectedRequestId,
    replayDraft,
    editMode,
    replaying,
    setReplayDraft,
    setEditMode,
    runReplay,
    copySelectedAsCurl,
    openMockFromSelected,
    selectRequest,
  } = useAppStore();

  const selected = requests.find((r) => r.id === selectedRequestId);
  if (!selected) return null;

  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-gradient-to-b from-[#181C26] to-[#131720] px-4 shadow-sm">
      {/* Método HTTP destacado */}
      <MethodBadge method={selected.method} size="md" className="shadow-sm" />

      {/* Target URL com visual de barra de navegação moderna */}
      <div className="relative flex flex-1 items-center">
        <span className="pointer-events-none absolute left-3 flex items-center text-fg-subtle">
          <Globe className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={replayDraft.targetUrl}
          onChange={(e) => setReplayDraft({ targetUrl: e.target.value })}
          placeholder="http://localhost:8080/webhooks/endpoint"
          className="h-9 w-full rounded-lg border border-line bg-[#0E1118] pl-9 pr-3 font-mono text-[13px] text-fg outline-none transition-all placeholder:text-fg-subtle/60 focus:border-brand focus:ring-2 focus:ring-brand/20 shadow-inner"
        />
      </div>

      {/* Ações principais de Replay e Mock */}
      <div className="flex items-center gap-2">
        {/* Botão Primário REPLAY com destaque em Laranja Vibrante e glow */}
        <button
          type="button"
          onClick={() => void runReplay()}
          disabled={replaying}
          className="group relative inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] px-4 font-sans text-[13px] font-semibold text-white shadow-[0_2px_14px_rgba(249,115,22,0.4)] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {replaying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-3.5 w-3.5 fill-current" />
          )}
          <span>{t('inspector.replayBtn')}</span>
          <Kbd tone="onBrand" className="ml-0.5 text-[10.5px]">Ctrl ↵</Kbd>
        </button>

        {/* Botão Edit & Replay */}
        <Button
          variant={editMode ? 'active' : 'secondary'}
          size="md"
          onClick={() => setEditMode(!editMode)}
          className={`h-9 px-3 text-[13px] ${
            editMode
              ? 'border-brand/40 bg-brand/15 text-brand shadow-[0_0_12px_rgba(249,115,22,0.2)]'
              : 'border-line bg-elevated hover:bg-hover text-fg'
          }`}
          title={t('inspector.editReplayTitle')}
        >
          {editMode ? (
            <>
              <RotateCcw className="h-3.5 w-3.5 text-brand animate-spin" style={{ animationDuration: '4s' }} />
              <span className="font-semibold">{t('common.editing')}</span>
            </>
          ) : (
            <>
              <Edit3 className="h-3.5 w-3.5 text-fg-muted" />
              <span>{t('inspector.editReplay')}</span>
            </>
          )}
        </Button>

        {/* Botão Save as Mock */}
        <Button
          variant="secondary"
          size="md"
          onClick={() => openMockFromSelected()}
          className="h-9 px-3 text-[13px] border-line bg-elevated hover:bg-hover text-fg"
          title={t('inspector.saveAsMockTitle')}
        >
          <BookmarkPlus className="h-3.5 w-3.5 text-fg-muted" />
          <span className="hidden sm:inline">{t('inspector.saveAsMock')}</span>
        </Button>

        {/* Botão cURL */}
        <Button
          variant="ghost"
          size="md"
          onClick={() => void copySelectedAsCurl()}
          className="h-9 px-2.5 text-[13px] text-fg-muted hover:text-fg"
          title={t('inspector.curlTitle')}
        >
          <Copy className="h-3.5 w-3.5" />
          <span className="hidden xl:inline">cURL</span>
        </Button>

        <span className="h-4 w-px bg-line/80 mx-0.5" />

        {/* Botão Fechar Detalhes */}
        <Button
          variant="ghost"
          size="md"
          onClick={() => selectRequest(null)}
          className="h-9 w-9 p-0 text-fg-subtle hover:bg-hover hover:text-fg"
          title={t('inspector.closeDetails')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
