import { useState, useMemo } from 'react';
import { Send, Trash2, Waypoints } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type MockDraft } from '@/store/useAppStore';
import { HTTP_METHODS } from '@/lib/http';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Field, inputClass, textareaClass } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/lib/cn';

export function MockEditorModal() {
  const { t } = useTranslation();
  const { mockModal, closeMockModal, saveMock, deleteMock, listeners } = useAppStore();
  const draft = mockModal.draft;

  const statusOptions = useMemo(() => [
    {
      group: t('mockModal.groups.success'),
      codes: [
        { code: 200, label: '200 OK' },
        { code: 201, label: '201 Created' },
        { code: 202, label: '202 Accepted' },
        { code: 204, label: '204 No Content' },
      ],
    },
    {
      group: t('mockModal.groups.redirect'),
      codes: [
        { code: 301, label: '301 Moved Permanently' },
        { code: 302, label: '302 Found' },
        { code: 304, label: '304 Not Modified' },
        { code: 307, label: '307 Temporary Redirect' },
        { code: 308, label: '308 Permanent Redirect' },
      ],
    },
    {
      group: t('mockModal.groups.clientError'),
      codes: [
        { code: 400, label: '400 Bad Request' },
        { code: 401, label: '401 Unauthorized' },
        { code: 403, label: '403 Forbidden' },
        { code: 404, label: '404 Not Found' },
        { code: 405, label: '405 Method Not Allowed' },
        { code: 408, label: '408 Request Timeout' },
        { code: 409, label: '409 Conflict' },
        { code: 422, label: '422 Unprocessable Entity' },
        { code: 429, label: '429 Too Many Requests' },
      ],
    },
    {
      group: t('mockModal.groups.serverError'),
      codes: [
        { code: 500, label: '500 Internal Server Error' },
        { code: 502, label: '502 Bad Gateway' },
        { code: 503, label: '503 Service Unavailable' },
        { code: 504, label: '504 Gateway Timeout' },
      ],
    },
  ], [t]);

  const knownCodes = useMemo(() => new Set(statusOptions.flatMap((g) => g.codes.map((c) => c.code))), [statusOptions]);

  const [form, setForm] = useState<MockDraft>(() => draft ?? {
    name: 'Mock Rule',
    listener_port: null,
    enabled: 1,
    method: 'POST',
    path: '/webhooks/payment',
    delay_ms: 0,
    status_code: 200,
    response_headers_json: '{\n  "Content-Type": "application/json"\n}',
    response_body: '{\n  "status": "success"\n}',
    callback_url: null,
    callback_method: 'POST',
    callback_body: null,
    callback_delay_ms: 0,
  });

  const [hasCallback, setHasCallback] = useState<boolean>(() => Boolean(draft?.callback_url));
  const [callbackBodyError, setCallbackBodyError] = useState<string | null>(null);
  const [isCustomStatus, setIsCustomStatus] = useState<boolean>(() => !knownCodes.has(form.status_code));
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [headerError, setHeaderError] = useState<string | null>(null);

  const isEnabled = form.enabled !== 0;

  const handleSubmit = async () => {
    try {
      JSON.parse(form.response_headers_json);
      setHeaderError(null);
    } catch {
      setHeaderError(t('mockModal.headersJsonError'));
      return;
    }

    if (hasCallback && form.callback_url?.trim()) {
      if (form.callback_body?.trim()) {
        try {
          JSON.parse(form.callback_body);
          setCallbackBodyError(null);
        } catch {
          setCallbackBodyError(t('mockModal.callbackBodyJsonError'));
          return;
        }
      }
    }

    setLoading(true);
    const success = await saveMock({
      ...form,
      listener_port: form.listener_port !== null && form.listener_port !== undefined ? Number(form.listener_port) : null,
      enabled: isEnabled ? 1 : 0,
      delay_ms: Number(form.delay_ms) || 0,
      status_code: Number(form.status_code) || 200,
      callback_url: hasCallback && form.callback_url?.trim() ? form.callback_url.trim() : null,
      callback_method: hasCallback ? (form.callback_method || 'POST') : 'POST',
      callback_body: hasCallback && form.callback_body?.trim() ? form.callback_body : null,
      callback_delay_ms: hasCallback ? (Number(form.callback_delay_ms) || 0) : 0,
    });
    setLoading(false);

    if (success) {
      closeMockModal();
    }
  };

  const handleStatusSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'CUSTOM') {
      setIsCustomStatus(true);
    } else {
      setIsCustomStatus(false);
      setForm({ ...form, status_code: Number(val) });
    }
  };

  return (
    <Modal
      title={draft?.id ? t('mockModal.titleEdit') : t('mockModal.titleNew')}
      subtitle={t('mockModal.subtitle')}
      icon={<Waypoints className="h-4 w-4" />}
      width={560}
      onClose={closeMockModal}
      onSubmit={handleSubmit}
      footer={
        <div className="flex w-full items-center justify-between">
          {draft?.id ? (
            <Button
              variant="danger"
              onClick={() => setConfirmDelete(true)}
              disabled={loading}
              className="gap-1.5 border border-[#EF4444]/30 bg-[#EF4444]/10 text-[#F87171] hover:bg-[#EF4444]/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t('mockModal.deleteRuleBtn')}
            </Button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={closeMockModal} disabled={loading}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? t('common.saving') : draft?.id ? t('mockModal.saveChangesBtn') : t('mockModal.saveBtn')}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Toggle de Ativação / Desativação da Regra */}
        <div className="flex items-center justify-between rounded-lg border border-line bg-shell/70 p-3.5 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-fg">{t('mockModal.statusToggle')}</span>
              <span className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${isEnabled ? 'bg-ok/15 text-ok' : 'bg-elevated text-fg-subtle'}`}>
                {isEnabled ? t('mockModal.statusActive') : t('mockModal.statusInactive')}
              </span>
            </div>
            <div className="text-[11.5px] text-fg-subtle mt-0.5">
              {isEnabled
                ? t('mockModal.statusActiveDesc')
                : t('mockModal.statusInactiveDesc')}
            </div>
          </div>
          <Toggle
            checked={isEnabled}
            onChange={(checked) => setForm({ ...form, enabled: checked ? 1 : 0 })}
            label={t('mockModal.enableDisableRule')}
            tone="success"
          />
        </div>

        {/* Seletor de Listener / Porta Alvo */}
        <Field
          label={t('mockModal.listenerScope')}
          hint="Defina se o mock intercepta em uma porta específica ou em todos os listeners"
        >
          <select
            value={form.listener_port !== null && form.listener_port !== undefined ? String(form.listener_port) : 'ALL'}
            onChange={(e) => {
              const val = e.target.value;
              setForm({ ...form, listener_port: val === 'ALL' ? null : Number(val) });
            }}
            className={inputClass}
          >
            <option value="ALL">🌐 {t('mockModal.allListeners')}</option>
            {listeners.map((l) => (
              <option key={l.id} value={l.port}>
                {Boolean(l.is_https) ? '🔒' : '⚡'} {l.name ? `${l.name} (:${l.port})` : t('mockModal.portOption', { port: l.port, protocol: Boolean(l.is_https) ? 'HTTPS' : 'HTTP' })}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t('mockModal.ruleName')} required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            placeholder={t('mockModal.ruleNamePlaceholder')}
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label={t('mockModal.method')} required>
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
              className={inputClass}
            >
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <div className="col-span-2">
            <Field label={t('mockModal.path')} required hint="Ex: /webhook ou /api/*">
              <input
                type="text"
                value={form.path}
                onChange={(e) => setForm({ ...form, path: e.target.value })}
                className={inputClass}
                placeholder={t('mockModal.pathPlaceholder')}
              />
            </Field>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t('mockModal.statusCode')} required>
            <div className="space-y-1.5">
              <select
                value={isCustomStatus ? 'CUSTOM' : form.status_code}
                onChange={handleStatusSelectChange}
                className={inputClass}
              >
                {statusOptions.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.codes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value="CUSTOM">{t('mockModal.customCodeOption')}</option>
              </select>

              {isCustomStatus && (
                <input
                  type="number"
                  min={100}
                  max={599}
                  value={form.status_code}
                  onChange={(e) => setForm({ ...form, status_code: Number(e.target.value) })}
                  className={inputClass}
                  placeholder="Ex: 418, 451, 521..."
                />
              )}
            </div>
          </Field>

          <Field label={t('mockModal.delayMs')}>
            <input
              type="number"
              min={0}
              step={50}
              value={form.delay_ms}
              onChange={(e) => setForm({ ...form, delay_ms: Number(e.target.value) })}
              className={inputClass}
            />
          </Field>
        </div>

        <Field
          label={t('mockModal.responseHeaders')}
          hint="JSON com pares chave-valor"
          error={headerError ?? undefined}
        >
          <textarea
            rows={3}
            value={form.response_headers_json}
            onChange={(e) => setForm({ ...form, response_headers_json: e.target.value })}
            className={textareaClass}
            spellCheck={false}
          />
        </Field>

        <Field label={t('mockModal.responseBody')}>
          <textarea
            rows={5}
            value={form.response_body}
            onChange={(e) => setForm({ ...form, response_body: e.target.value })}
            className={textareaClass}
            spellCheck={false}
          />
        </Field>

        {/* Seção de Callback Assíncrono (Webhook) */}
        <div className="rounded-lg border border-line bg-shell/70 p-3.5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg border text-xs',
                hasCallback ? 'border-[#F43F5E]/40 bg-[#F43F5E]/15 text-[#FB7185]' : 'border-line bg-elevated text-fg-subtle'
              )}>
                <Send className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-fg">{t('mockModal.callbackSection')}</span>
                  <span className={cn(
                    'rounded px-1.5 py-0.2 font-mono text-[9.5px] font-bold',
                    hasCallback ? 'bg-[#F43F5E]/15 text-[#FB7185]' : 'bg-elevated text-fg-subtle'
                  )}>
                    {hasCallback ? t('mockModal.statusActive') : t('mockModal.statusInactive')}
                  </span>
                </div>
                <div className="text-[11.5px] text-fg-subtle mt-0.5">
                  {hasCallback ? t('mockModal.callbackActiveDesc') : t('mockModal.callbackInactiveDesc')}
                </div>
              </div>
            </div>
            <Toggle
              checked={hasCallback}
              onChange={(checked) => setHasCallback(checked)}
              label={t('mockModal.callbackToggle')}
              tone="success"
            />
          </div>

          {hasCallback && (
            <div className="space-y-3 pt-3 border-t border-line/60">
              <div className="grid grid-cols-4 gap-3">
                <Field label={t('mockModal.callbackMethod')}>
                  <select
                    value={form.callback_method || 'POST'}
                    onChange={(e) => setForm({ ...form, callback_method: e.target.value })}
                    className={inputClass}
                  >
                    {HTTP_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="col-span-3">
                  <Field label={t('mockModal.callbackUrl')} required hint="Ex: http://localhost:3000/api/orders/webhook">
                    <input
                      type="url"
                      value={form.callback_url || ''}
                      onChange={(e) => setForm({ ...form, callback_url: e.target.value })}
                      className={inputClass}
                      placeholder={t('mockModal.callbackUrlPlaceholder')}
                    />
                  </Field>
                </div>
              </div>

              <Field label={t('mockModal.callbackDelayMs')} hint="Tempo de espera após responder o mock antes de disparar o callback">
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={form.callback_delay_ms ?? 0}
                  onChange={(e) => setForm({ ...form, callback_delay_ms: Number(e.target.value) })}
                  className={inputClass}
                />
              </Field>

              <Field
                label={t('mockModal.callbackBody')}
                hint={t('mockModal.callbackBodyHint')}
                error={callbackBodyError ?? undefined}
              >
                <textarea
                  rows={4}
                  value={form.callback_body || ''}
                  onChange={(e) => setForm({ ...form, callback_body: e.target.value })}
                  className={textareaClass}
                  placeholder={`{\n  "event": "payment.approved",\n  "status": "success"\n}`}
                  spellCheck={false}
                />
              </Field>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete}
        title={t('confirm.deleteMockTitle')}
        description={t('confirm.deleteMockDesc', {
          name: form.name || form.path || '',
        })}
        confirmLabel={t('confirm.deleteBtn')}
        cancelLabel={t('confirm.cancelBtn')}
        tone="danger"
        onClose={() => setConfirmDelete(false)}
        onConfirm={async () => {
          if (draft && draft.id) {
            await deleteMock(draft as any);
            setConfirmDelete(false);
            closeMockModal();
          }
        }}
      />
    </Modal>
  );
}
