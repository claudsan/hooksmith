import type { ReactNode } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'danger',
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      title={title}
      icon={
        tone === 'danger' ? (
          <Trash2 className="h-4 w-4 text-[#F87171]" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-brand" />
        )
      }
      iconContainerClassName={
        tone === 'danger'
          ? 'border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.12)] text-[#F87171]'
          : undefined
      }
      width={440}
      onClose={onClose}
      onSubmit={() => void onConfirm()}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            type="submit"
            disabled={loading}
            className="border border-[#EF4444]/40 bg-[#EF4444]/20 text-[#F87171] hover:bg-[#EF4444]/30"
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-[13px] leading-relaxed text-fg-muted">
        {description}
      </div>
    </Modal>
  );
}

