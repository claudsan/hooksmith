import { useState } from 'react';
import { Lock, Radio } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { Modal } from '@/components/ui/Modal';
import { Field, inputClass } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';

export function ListenerModal() {
  const { t } = useTranslation();
  const { listenerModal, closeListenerModal, saveListener } = useAppStore();
  const editing = listenerModal.editing;

  const [name, setName] = useState<string>(editing?.name || '');
  const [port, setPort] = useState<number>(editing ? editing.port : 4010);
  const [isHttps, setIsHttps] = useState<boolean>(editing ? Boolean(editing.is_https) : false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleHttps = (checked: boolean) => {
    setIsHttps(checked);
    // Sugere porta padrão de TLS se ainda estiver com a padrão HTTP
    if (checked && port === 4010) {
      setPort(8443);
    } else if (!checked && port === 8443) {
      setPort(4010);
    }
  };

  const handleSubmit = async () => {
    if (!port || port < 1 || port > 65535) {
      setError(t('listenerModal.portRangeError'));
      return;
    }

    setLoading(true);
    setError(null);

    const success = await saveListener({
      id: editing?.id,
      name: name.trim() || null,
      port: Number(port),
      target_forward_url: null,
      is_https: isHttps ? 1 : 0,
    });

    setLoading(false);
    if (success) {
      closeListenerModal();
    }
  };

  return (
    <Modal
      title={
        editing
          ? editing.name
            ? `${editing.name} (:${editing.port})`
            : t('listenerModal.titleEdit', { port: editing.port })
          : t('listenerModal.titleNew')
      }
      subtitle={t('listenerModal.subtitle')}
      icon={<Radio className="h-4 w-4" />}
      width={480}
      onClose={closeListenerModal}
      onSubmit={handleSubmit}
      footer={
        <>
          <Button variant="ghost" onClick={closeListenerModal} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? t('common.saving') : editing ? t('listenerModal.saveChangesBtn') : t('listenerModal.saveBtn')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Toggle de Protocolo HTTPS */}
        <div className="flex items-center justify-between rounded-lg border border-line bg-shell/70 p-3.5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${isHttps ? 'border-ok/30 bg-ok/10 text-ok' : 'border-line bg-elevated text-fg-subtle'}`}>
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-fg">{t('listenerModal.httpsToggleLabel')}</span>
                <span className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${isHttps ? 'bg-ok/15 text-ok' : 'bg-elevated text-fg-subtle'}`}>
                  {isHttps ? t('listenerModal.httpsActiveBadge') : t('listenerModal.httpsInactiveBadge')}
                </span>
              </div>
              <div className="text-[11.5px] text-fg-subtle mt-0.5">
                {isHttps ? t('listenerModal.httpsActiveDesc') : t('listenerModal.httpsInactiveDesc')}
              </div>
            </div>
          </div>
          <Toggle
            checked={isHttps}
            onChange={handleToggleHttps}
            label={t('listenerModal.enableDisableHttps')}
            tone="success"
          />
        </div>

        <Field
          label={t('listenerModal.nameLabel')}
          hint="Identifique este listener (ex: Stripe, Mercado Pago, Auth...)"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder={t('listenerModal.namePlaceholder')}
            autoFocus
          />
        </Field>

        <Field
          label={t('listenerModal.portLabel')}
          required
          hint={isHttps ? 'Padrão sugerido para TLS: 8443, 9443, 443' : 'Padrão sugerido para HTTP: 3000, 4010, 8080'}
          error={error ?? undefined}
        >
          <input
            type="number"
            min={1}
            max={65535}
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            className={inputClass}
            placeholder={t('listenerModal.portPlaceholder')}
          />
        </Field>
      </div>
    </Modal>
  );
}
