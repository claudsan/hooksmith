import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAppStore, type ToastKind } from '@/store/useAppStore';

const ICONS: Record<ToastKind, ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-ok" />,
  error: <XCircle className="h-4 w-4 text-danger" />,
  info: <Info className="h-4 w-4 text-info" />,
};

export function Toaster() {
  const toasts = useAppStore((s) => s.toasts);
  const dismiss = useAppStore((s) => s.dismissToast);

  return (
    <div className="pointer-events-none fixed bottom-9 right-4 z-[200] flex w-[340px] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-2.5 rounded-lg border border-line-focus bg-elevated/95 px-3 py-2.5 shadow-panel backdrop-blur animate-toast-in"
        >
          <span className="mt-px">{ICONS[t.kind]}</span>
          <p className="min-w-0 flex-1 break-words text-[12px] leading-snug text-fg">{t.message}</p>
          <button type="button" onClick={() => dismiss(t.id)} className="text-fg-subtle hover:text-fg" aria-label="Dismiss">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

