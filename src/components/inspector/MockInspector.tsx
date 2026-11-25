import { useState } from 'react';
import {
  Check,
  Copy,
  Lock,
  Pencil,
  Send,
  Terminal,
  Timer,
  Waypoints,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import type { MockRule } from '@/types/ipc';
import { prettify, safeJsonParse } from '@/lib/http';
import { MethodBadge, StatusPill } from '@/components/ui/Badges';
import { Button, IconButton } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { PayloadViewer } from './PayloadViewer';

interface MockInspectorProps {
  mock: MockRule;
}

export function MockInspector({ mock }: MockInspectorProps) {
  const { t } = useTranslation();
  const selectMock = useAppStore((s) => s.selectMock);
  const openMockModal = useAppStore((s) => s.openMockModal);
  const toggleMock = useAppStore((s) => s.toggleMock);
  const listeners = useAppStore((s) => s.listeners);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const enabled = mock.enabled !== 0;
  const resHeaders = safeJsonParse<Record<string, string>>(mock.response_headers_json, {});
  const resBody = mock.response_body;

  // Descobre a porta para o comando cURL de teste
  const targetPort =
    mock.listener_port ??
    listeners.find((l) => l.is_active)?.port ??
    listeners[0]?.port ??
    4010;

  const activeListener = listeners.find((l) => l.port === targetPort);
  const isHttps = Boolean(activeListener?.is_https);
  const protocol = isHttps ? 'https' : 'http';
  const insecureFlag = isHttps ? ' -k' : '';
  const testUrl = `${protocol}://127.0.0.1:${targetPort}${mock.path}`;

  const testCurl = `curl -i${insecureFlag} -X ${mock.method} "${testUrl}"`;

  const copyCurl = async () => {
    await navigator.clipboard.writeText(testCurl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#0D1016]">
      {/* 1. Header Toolbar do Mock com Ações em Destaque */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line bg-panel px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand/35 bg-brand-soft text-brand">
            <Waypoints className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-[14px] font-semibold text-fg" title={mock.name}>
                {mock.name || t('mockInspector.title')}
              </span>
              <StatusPill code={mock.status_code} />
              {mock.delay_ms > 0 && (
                <span className="inline-flex h-[18px] items-center gap-1 rounded border border-line bg-shell px-1.5 font-mono text-[10.5px] text-fg-muted">
                  <Timer className="h-3 w-3" />
                  {mock.delay_ms}ms
                </span>
              )}
            </div>

            <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-fg-subtle">
              <MethodBadge method={mock.method} size="sm" />
              <span className="font-mono text-fg-muted" title={mock.path}>
                {mock.path}
              </span>
              <span className="text-line-focus">·</span>
              <span className="font-mono text-[11px] inline-flex items-center gap-1">
                {mock.listener_port ? (
                  <>
                    <span>:{mock.listener_port}</span>
                    {isHttps ? (
                      <span className="inline-flex items-center gap-0.5 rounded border border-brand/40 bg-brand/15 px-1 py-0.2 text-[9.5px] font-bold text-brand">
                        <Lock className="h-2.5 w-2.5" />
                        SSL
                      </span>
                    ) : (
                      <span className="rounded border border-line bg-shell px-1 text-[9.5px] text-fg-subtle">
                        HTTP
                      </span>
                    )}
                  </>
                ) : (
                  t('mockInspector.allPorts')
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Ações à Direita: Toggle, Editar Mock, Copiar cURL, Fechar */}
        <div className="flex items-center gap-2">
          <div className="mr-1 flex items-center gap-1.5 border-r border-line pr-3">
            <span className="text-[11.5px] font-medium text-fg-subtle">
              {enabled ? t('common.active') : t('common.inactive')}
            </span>
            <Toggle
              checked={enabled}
              onChange={() => void toggleMock(mock)}
              label={enabled ? t('sidebar.disableRule') : t('sidebar.enableRule')}
            />
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={copyCurl}
            className="gap-1.5 text-[12px] shadow-sm"
            title="Copiar comando cURL para simular requisição"
          >
            {copiedCurl ? <Check className="h-3.5 w-3.5 text-ok" /> : <Terminal className="h-3.5 w-3.5 text-brand" />}
            <span>{copiedCurl ? t('common.copied') : t('mockInspector.testCurl')}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => openMockModal(mock)}
            className="gap-1.5 text-[12px] font-semibold shadow-sm"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>{t('mockInspector.editRule')}</span>
          </Button>

          <IconButton
            label={t('mockInspector.close')}
            onClick={() => selectMock(null)}
            className="ml-1 text-fg-subtle hover:text-fg"
          >
            <X className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      {/* 2. Conteúdo de Inspeção do Mock */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Painel de Callback se estiver configurado */}
        {mock.callback_url && (
          <div className="border-b border-line bg-shell/80 p-4">
            <div className="rounded-lg border border-[#F43F5E]/30 bg-[#F43F5E]/5 p-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 items-center gap-1 rounded bg-[#F43F5E]/15 border border-[#F43F5E]/30 px-1.5 font-mono text-[9.5px] font-bold text-[#FB7185]">
                    <Send className="h-2.5 w-2.5" />
                    CALLBACK
                  </span>
                  <span className="text-[12.5px] font-semibold text-fg">
                    {t('mockInspector.callbackSection')}
                  </span>
                </div>
                {mock.callback_delay_ms ? (
                  <span className="font-mono text-[11px] text-fg-subtle">
                    ⏱️ {mock.callback_delay_ms}ms delay
                  </span>
                ) : (
                  <span className="font-mono text-[10.5px] text-ok">⚡ Imediato</span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-2 font-mono text-[12px]">
                <MethodBadge method={mock.callback_method || 'POST'} size="sm" />
                <span className="truncate text-fg-muted" title={mock.callback_url}>
                  {mock.callback_url}
                </span>
              </div>

              {mock.callback_body && (
                <div className="mt-2.5">
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-fg-subtle mb-1">
                    Payload do Callback
                  </div>
                  <pre className="max-h-32 overflow-auto rounded border border-line bg-panel p-2 font-mono text-[11px] text-fg-muted">
                    {prettify(mock.callback_body)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resposta Simulada com PayloadViewer em modo read-only */}
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between border-b border-line/60 bg-[#11141A] px-4 py-2">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-fg-subtle">
              {t('mockInspector.responseSection')}
            </span>
            <span className="font-mono text-[11px] text-fg-subtle">
              Status {mock.status_code}
            </span>
          </div>

          <div className="min-h-[360px] flex-1">
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
