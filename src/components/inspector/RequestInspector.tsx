import { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  Copy,
  Database,
  Flame,
  HardDrive,
  Radio,
  Sparkles,
  Terminal,
  Zap,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import {
  byteLength,
  formatBytes,
  formatDateTime,
  safeJsonParse,
  splitPath,
  statusColor,
  statusText,
} from '@/lib/http';
import { BrandWordmark, BrandMark } from '@/components/ui/Brand';
import { Button } from '@/components/ui/Button';
import { SourceTag } from '@/components/ui/Badges';
import { cn } from '@/lib/cn';
import { ResizeHandle } from '@/components/ui/ResizeHandle';
import { useResizableHeight } from '@/hooks/useResizableHeight';
import { ReplayBar } from './ReplayBar';
import { PayloadViewer } from './PayloadViewer';
import { MockInspector } from './MockInspector';

export function RequestInspector() {
  const { t } = useTranslation();
  const selectedRequestId = useAppStore((s) => s.selectedRequestId);
  const selectedMockId = useAppStore((s) => s.selectedMockId);
  const selectRequest = useAppStore((s) => s.selectRequest);
  const requests = useAppStore((s) => s.requests);
  const mocks = useAppStore((s) => s.mocks);
  const editMode = useAppStore((s) => s.editMode);
  const replayDraft = useAppStore((s) => s.replayDraft);
  const setReplayDraft = useAppStore((s) => s.setReplayDraft);

  const split = useResizableHeight({
    storageKey: 'hooksmith:inspector-split-ratio',
    defaultRatio: 0.5,
    minRatio: 0.15,
    maxRatio: 0.85,
  });

  // Se houver um mock selecionado na sidebar, renderiza o MockInspector
  const selectedMock = selectedMockId ? mocks.find((m) => m.id === selectedMockId) : null;
  if (selectedMock) {
    return <MockInspector mock={selectedMock} />;
  }

  const selected = requests.find((r) => r.id === selectedRequestId);

  if (!selected) {
    return <InspectorEmptyState />;
  }

  const reqHeaders = editMode
    ? safeJsonParse<Record<string, string>>(replayDraft.headersText, {})
    : safeJsonParse<Record<string, string>>(selected.headers_json, {});
  const reqQuery = safeJsonParse<Record<string, string>>(selected.query_json, {});
  const reqBody = editMode ? replayDraft.body : selected.body_raw;

  const resHeaders = safeJsonParse<Record<string, string>>(selected.response_headers_json, {});
  const resBody = selected.response_body;
  const resSize = byteLength(resBody);
  const resStatusColor = statusColor(selected.response_status);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#0D1016]">
      {/* 1. Barra de Ação Superior (Replay Bar destacada) */}
      <ReplayBar />

      {/* 2. Split vertical redimensionável: Request (superior) / Response (inferior) */}
      <div ref={split.containerRef} className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Metade Superior: Request */}
        <div
          style={{ height: `${split.topPercent}%` }}
          className="flex min-h-0 flex-col overflow-hidden border-b border-line shadow-sm"
        >
          {/* Header estilizado da Request */}
          <div className="flex h-9 shrink-0 items-center justify-between border-b border-line bg-gradient-to-r from-[#141822] to-[#11141C] px-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 items-center gap-1.5 rounded bg-brand/15 px-2 font-mono text-[11px] font-bold text-brand shadow-sm">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>{t('inspector.incomingRequest')}</span>
              </span>

              {editMode && (
                <span className="flex items-center gap-1 rounded bg-brand/20 px-2 py-0.5 font-mono text-[10.5px] font-semibold text-brand animate-pulse">
                  <Flame className="h-3 w-3" />
                  {t('inspector.editModeActive')}
                </span>
              )}

              <span className="font-mono text-[13px] font-semibold text-fg ml-1">
                {splitPath(selected.path).pathname}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="flex items-center gap-1.5 rounded bg-elevated border border-line px-2 py-0.5 font-mono text-[11px] text-fg-muted shadow-sm"
                title={`Data e hora da chamada: ${formatDateTime(selected.created_at)}`}
              >
                <Calendar className="h-3 w-3 text-brand" />
                <span className="text-fg font-medium">{formatDateTime(selected.created_at)}</span>
              </span>
              <SourceTag source={selected.source_type} />
              <span className="rounded bg-elevated border border-line px-2 py-0.5 font-mono text-[11px] text-fg-muted">
                {t('inspector.portLabel', { port: selected.listener_port })}
              </span>
              <button
                type="button"
                onClick={() => selectRequest(null)}
                title={t('inspector.closeDetails')}
                className="flex h-5 w-5 items-center justify-center rounded text-fg-subtle hover:bg-hover hover:text-fg transition-colors ml-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 bg-shell">
            <PayloadViewer
              body={reqBody}
              headers={reqHeaders}
              query={reqQuery}
              readOnly={!editMode}
              onBodyChange={(body) => setReplayDraft({ body })}
              onHeadersChange={(headersText) => setReplayDraft({ headersText })}
            />
          </div>
        </div>

        {/* Divisor Horizontal Interativo para Redimensionar Request / Response */}
        <ResizeHandle
          orientation="horizontal"
          onMouseDown={split.onMouseDown}
          onDoubleClick={split.resetRatio}
          isResizing={split.isResizing}
          title="Arraste para ajustar o espaço entre Requisição e Resposta (Duplo clique para 50%)"
        />

        {/* Metade Inferior: Response */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-shell">
          {/* Header estilizado da Response com status code em destaque */}
          <div className="flex h-9 shrink-0 items-center justify-between border-b border-line bg-gradient-to-r from-[#141822] to-[#11141C] px-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-5 items-center gap-1.5 rounded bg-ok/15 px-2 font-mono text-[11px] font-bold text-ok shadow-sm">
                <ArrowDownLeft className="h-3.5 w-3.5" />
                <span>{t('inspector.response')}</span>
              </span>

              {/* Status Code Badge Destacado */}
              <div
                className="flex items-center gap-1.5 rounded-md px-2.5 py-0.5 font-mono text-[12.5px] font-bold shadow-sm"
                style={{
                  backgroundColor: `${resStatusColor}1A`,
                  border: `1px solid ${resStatusColor}40`,
                  color: resStatusColor,
                }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: resStatusColor }} />
                <span>{selected.response_status || 'ERR'}</span>
                <span className="font-sans font-medium text-fg-subtle text-[11.5px]">
                  {statusText(selected.response_status)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-[12px]">
              <span className="flex items-center gap-1.5 rounded bg-elevated px-2 py-0.5 text-fg-muted border border-line">
                <Clock className="h-3.5 w-3.5 text-brand" />
                <span className="font-semibold text-fg">{selected.duration_ms} ms</span>
              </span>

              <span className="flex items-center gap-1.5 rounded bg-elevated px-2 py-0.5 text-fg-muted border border-line">
                <HardDrive className="h-3.5 w-3.5 text-info" />
                <span>{formatBytes(resSize)}</span>
              </span>
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <PayloadViewer
              body={resBody}
              headers={resHeaders}
              query={{}}
              readOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InspectorEmptyState() {
  const { t } = useTranslation();
  const listeners = useAppStore((s) => s.listeners);
  const [selectedListenerId, setSelectedListenerId] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const currentListener =
    listeners.find((l) => l.id === selectedListenerId) ??
    listeners.find((l) => l.is_active) ??
    listeners[0];

  const port = currentListener?.port ?? 4010;
  const isHttps = Boolean(currentListener?.is_https);
  const protocol = isHttps ? 'https' : 'http';
  const insecureFlag = isHttps ? ' -k' : '';
  const baseUrl = `${protocol}://127.0.0.1:${port}`;

  const testCurl = `curl -i${insecureFlag} -X POST ${baseUrl}/webhooks/payment \\
  -H "Content-Type: application/json" \\
  -d '{"event": "order.completed", "amount": 199.90, "currency": "BRL"}'`;

  const copyCurl = async () => {
    await navigator.clipboard.writeText(testCurl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const copyBaseUrl = async () => {
    await navigator.clipboard.writeText(baseUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="relative flex h-full flex-1 flex-col items-center justify-center bg-grid p-8 overflow-y-auto">
      {/* Bigorna como marca d'água de fundo com glow suave */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.055]">
        <BrandMark className="h-[520px] w-auto drop-shadow-[0_0_120px_rgba(249,115,22,0.12)]" />
      </div>

      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        {/* Container Hero com Glow e Logo em Alto Destaque */}
        <div className="relative mb-5 flex flex-col items-center">
          {/* Efeito de luz ambiente traseira */}
          <div className="pointer-events-none absolute -inset-4 rounded-full bg-brand/15 blur-2xl" />

          {/* Badge superior com estilo glassmorphism */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/35 bg-brand/10 px-3.5 py-1 font-mono text-[11.5px] font-semibold text-brand shadow-[0_0_24px_rgba(249,115,22,0.2)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-brand animate-pulse" />
            <span>{t('inspector.emptyBadge')}</span>
          </div>

          {/* Logo Wordmark Premium em Escala Imponente */}
          <div className="relative group transition-transform duration-300 hover:scale-[1.02]">
            <BrandWordmark className="h-16 sm:h-20 w-auto drop-shadow-[0_10px_32px_rgba(249,115,22,0.45)]" />
          </div>
        </div>

        <h3 className="text-[18px] font-semibold tracking-tight text-fg">{t('inspector.emptyTitle')}</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-fg-muted max-w-md">
          {t('inspector.emptySubtitle')}
        </p>

        {/* Seletor Multi-Listener quando houver mais de 1 listener */}
        {listeners.length > 1 && (
          <div className="mt-5 flex w-full flex-col gap-2 rounded-xl border border-line bg-[#13161F] p-3 text-left shadow-lg">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-fg-subtle">
                {t('inspector.selectListener')} ({listeners.length})
              </span>
              <span className="text-[11px] font-mono text-fg-subtle">
                {listeners.filter((l) => l.is_active).length} {t('sidebar.live')}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {listeners.map((l) => {
                const isSelected = l.id === currentListener?.id;
                const isSec = Boolean(l.is_https);
                const isActive = l.is_active === 1;

                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setSelectedListenerId(l.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-all cursor-pointer',
                      isSelected
                        ? 'border-brand bg-brand/15 text-fg shadow-[0_0_12px_rgba(249,115,22,0.25)] font-semibold'
                        : 'border-line/80 bg-elevated/70 text-fg-muted hover:border-line-focus hover:bg-elevated hover:text-fg'
                    )}
                  >
                    <span className="text-xs">{isSec ? '🔒' : '⚡'}</span>
                    <span>{l.name || `Listener :${l.port}`}</span>
                    {l.name && <span className="font-mono text-[11px] text-fg-subtle">:{l.port}</span>}
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.2 font-mono text-[9px] font-bold',
                        isSec ? 'bg-brand/20 text-brand' : 'bg-shell text-fg-subtle'
                      )}
                    >
                      {isSec ? 'HTTPS' : 'HTTP'}
                    </span>
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        isActive ? 'bg-ok shadow-[0_0_6px_rgba(16,185,129,0.8)]' : 'bg-fg-subtle/40'
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Card do cURL de teste interativo */}
        <div className="mt-5 w-full rounded-xl border border-line bg-[#151922]/95 p-4 text-left shadow-2xl backdrop-blur-md">
          <div className="mb-2.5 flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-2 font-semibold text-fg">
              <Terminal className="h-4 w-4 text-brand" />
              <span>
                {currentListener?.name
                  ? `${currentListener.name} (Porta :${port})`
                  : t('inspector.triggerTestWebhook', { port })}
              </span>
              <span
                className={cn(
                  'rounded px-1.5 py-0.2 font-mono text-[9.5px] font-bold',
                  isHttps ? 'bg-brand/20 text-brand' : 'bg-elevated text-fg-subtle'
                )}
              >
                {isHttps ? 'HTTPS' : 'HTTP'}
              </span>
            </span>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="xs"
                onClick={copyBaseUrl}
                className="gap-1 text-[11.5px] text-fg-subtle hover:text-fg"
                title="Copiar URL base (host + porta)"
              >
                {copiedUrl ? <Check className="h-3 w-3 text-ok" /> : <Copy className="h-3 w-3" />}
                <span>{copiedUrl ? t('inspector.baseUrlCopied') : t('inspector.copyBaseUrl')}</span>
              </Button>

              <Button
                variant="secondary"
                size="xs"
                onClick={copyCurl}
                className="gap-1.5 text-[11.5px] border-line-focus bg-elevated hover:bg-hover"
              >
                {copiedCurl ? <Check className="h-3.5 w-3.5 text-ok" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCurl ? t('common.copied') : t('inspector.copyCurlCommand')}</span>
              </Button>
            </div>
          </div>

          <pre className="overflow-x-auto rounded-lg border border-line/70 bg-shell p-3 font-mono text-[12px] leading-relaxed text-[#E2E8F0] shadow-inner">
            {testCurl}
          </pre>
        </div>

        {/* Recursos em destaque no rodapé do empty state */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-[12.5px]">
          <span className="flex items-center gap-2 rounded-full border border-line bg-elevated px-3.5 py-1.5 shadow-md text-fg">
            <Zap className="h-3.5 w-3.5 text-brand" />
            <span>{t('inspector.replayInstant')} (<kbd className="font-mono text-[10.5px] text-fg-subtle">Ctrl ↵</kbd>)</span>
          </span>
          <span className="flex items-center gap-2 rounded-full border border-line bg-elevated px-3.5 py-1.5 shadow-md text-fg">
            <Radio className="h-3.5 w-3.5 text-ok" />
            <span>{t('inspector.mockChaos')}</span>
          </span>
          <span className="flex items-center gap-2 rounded-full border border-line bg-elevated px-3.5 py-1.5 shadow-md text-fg">
            <Database className="h-3.5 w-3.5 text-info" />
            <span>{t('inspector.sqliteOffline')}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
