import { useState } from 'react';
import { Check, Copy, FileCode2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { detectLanguage, prettify, type PayloadLanguage } from '@/lib/http';
import { CodeEditor } from './CodeEditor';

interface PayloadViewerProps {
  body: string | null;
  headers: Record<string, string>;
  query: Record<string, string>;
  readOnly?: boolean;
  onBodyChange?: (body: string) => void;
  onHeadersChange?: (headersText: string) => void;
}

type Tab = 'Body' | 'Headers' | 'Query' | 'Raw';

export function PayloadViewer({
  body,
  headers,
  query,
  readOnly = true,
  onBodyChange,
  onHeadersChange,
}: PayloadViewerProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('Body');
  const [copied, setCopied] = useState(false);
  const [isPretty, setIsPretty] = useState(true);

  const headersCount = Object.keys(headers).length;
  const queryCount = Object.keys(query).length;

  const currentRaw = body ?? '';
  const detectedLang: PayloadLanguage = detectLanguage(currentRaw, headers['content-type']);
  const isJson = detectedLang === 'json';

  // Valor a exibir na aba Body: formatado se for JSON e isPretty estiver ativo
  const bodyDisplayValue = isJson && isPretty ? prettify(currentRaw) : currentRaw;

  const handleCopy = async () => {
    let textToCopy = '';
    if (activeTab === 'Body') {
      textToCopy = bodyDisplayValue;
    } else if (activeTab === 'Raw') {
      textToCopy = currentRaw;
    } else if (activeTab === 'Headers') {
      textToCopy = JSON.stringify(headers, null, 2);
    } else if (activeTab === 'Query') {
      textToCopy = JSON.stringify(query, null, 2);
    }
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePrettify = () => {
    if (!readOnly && onBodyChange) {
      onBodyChange(prettify(currentRaw));
      setIsPretty(true);
    } else {
      setIsPretty((prev) => !prev);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-shell">
      {/* Sub-header com abas estilizadas */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-line bg-[#13161F] px-3.5">
        <div className="flex items-center gap-1.5">
          <TabButton
            label={t('inspector.bodyTab')}
            active={activeTab === 'Body'}
            onClick={() => setActiveTab('Body')}
          />
          <TabButton
            label={t('inspector.headersTab')}
            count={headersCount}
            active={activeTab === 'Headers'}
            onClick={() => setActiveTab('Headers')}
          />
          <TabButton
            label={t('inspector.queryTab')}
            count={queryCount}
            active={activeTab === 'Query'}
            onClick={() => setActiveTab('Query')}
          />
          <TabButton
            label={t('inspector.rawTab')}
            active={activeTab === 'Raw'}
            onClick={() => setActiveTab('Raw')}
          />
        </div>

        {/* Toolbar da aba ativa */}
        <div className="flex items-center gap-2 text-[12px] text-fg-subtle">
          {activeTab === 'Body' && (
            <>
              <span className="flex items-center gap-1 rounded border border-line bg-elevated px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-fg-muted shadow-sm">
                <FileCode2 className="h-3 w-3 text-brand" />
                <span>{detectedLang}</span>
              </span>

              {isJson && (
                <button
                  type="button"
                  onClick={handlePrettify}
                  className={`flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11.5px] font-semibold transition-all ${
                    isPretty
                      ? 'border-brand/40 bg-brand/15 text-brand shadow-sm hover:bg-brand/25'
                      : 'border-line bg-elevated text-fg-muted hover:bg-hover hover:text-fg'
                  }`}
                  title={
                    readOnly
                      ? isPretty
                        ? 'Exibindo JSON formatado (Clique para alternar para compacto)'
                        : 'Clique para formatar JSON (Prettify)'
                      : 'Formatar JSON (Prettify)'
                  }
                >
                  <Sparkles className={`h-3 w-3 ${isPretty ? 'text-brand' : 'text-fg-subtle'}`} />
                  <span>{isPretty ? 'Pretty' : 'Raw'}</span>
                </button>
              )}
            </>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded border border-line bg-elevated px-2 py-0.5 text-[11.5px] font-medium text-fg-muted hover:bg-hover hover:text-fg transition-colors"
            title={t('common.copy')}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-ok" />
                <span className="text-ok font-semibold">{t('common.copied')}</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>{t('common.copy')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Painel do Monaco Editor */}
      <div className="min-h-0 flex-1">
        {activeTab === 'Body' && (
          <CodeEditor
            value={bodyDisplayValue}
            onChange={onBodyChange}
            readOnly={readOnly}
            language={detectedLang === 'json' ? 'json' : detectedLang === 'xml' ? 'xml' : 'plaintext'}
          />
        )}

        {activeTab === 'Headers' && (
          <CodeEditor
            value={JSON.stringify(headers, null, 2)}
            onChange={onHeadersChange}
            readOnly={readOnly}
            language="json"
          />
        )}

        {activeTab === 'Query' && (
          <CodeEditor
            value={JSON.stringify(query, null, 2)}
            readOnly={true}
            language="json"
          />
        )}

        {activeTab === 'Raw' && (
          <CodeEditor
            value={currentRaw}
            onChange={onBodyChange}
            readOnly={readOnly}
            language="plaintext"
          />
        )}
      </div>
    </div>
  );
}

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-7 items-center gap-1.5 rounded-md px-3 text-[12.5px] font-medium transition-all ${
        active
          ? 'bg-elevated text-fg border border-line-focus shadow-sm font-semibold'
          : 'text-fg-subtle hover:bg-hover/80 hover:text-fg'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`rounded px-1.5 py-0.2 font-mono text-[10.5px] font-bold ${
            active ? 'bg-brand/15 text-brand' : 'bg-shell/80 text-fg-subtle'
          }`}
        >
          {count}
        </span>
      )}
      {active && (
        <span className="absolute -bottom-[5px] left-3 right-3 h-[2px] bg-brand rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
      )}
    </button>
  );
}
