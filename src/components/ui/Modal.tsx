import { useEffect, type FormEvent, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { IconButton } from './Button';

interface ModalProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  iconContainerClassName?: string;
  width?: number;
  onClose: () => void;
  onSubmit?: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

/** Modal base (Template Method visual): header, corpo e footer padronizados; Escape fecha. */
export function Modal({ title, subtitle, icon, iconContainerClassName, width = 460, onClose, onSubmit, footer, children }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[3px] animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[86vh] flex-col overflow-hidden rounded-xl border border-line-focus bg-elevated shadow-panel animate-scale-in"
        style={{ width }}
      >
        <header className="flex items-start gap-3 border-b border-line px-5 py-4">
          {icon && (
            <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[rgba(249,115,22,0.25)] bg-brand-soft text-brand', iconContainerClassName)}>
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-[14px] font-semibold text-fg">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[12px] text-fg-subtle">{subtitle}</p>}
          </div>
          <IconButton label="Close (Esc)" onClick={onClose}>
            <X className="h-4 w-4" />
          </IconButton>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <footer className={cn('flex items-center justify-end gap-2 border-t border-line bg-panel px-5 py-3')}>{footer}</footer>}
      </form>
    </div>
  );
}

