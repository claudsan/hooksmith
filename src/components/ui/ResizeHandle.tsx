import { cn } from '@/lib/cn';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  isResizing?: boolean;
  className?: string;
  title?: string;
  orientation?: 'vertical' | 'horizontal';
}

export function ResizeHandle({
  onMouseDown,
  onDoubleClick,
  isResizing = false,
  className,
  title = 'Arraste para redimensionar (Duplo clique para restaurar)',
  orientation = 'vertical',
}: ResizeHandleProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      tabIndex={-1}
      title={title}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      className={cn(
        'group relative z-20 flex shrink-0 items-center justify-center transition-colors select-none',
        isHorizontal
          ? 'h-1.5 w-full cursor-row-resize -mt-[3px] -mb-[3px]'
          : 'w-1.5 h-full cursor-col-resize -ml-[3px] -mr-[3px]',
        isResizing ? 'bg-brand shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'hover:bg-brand/50',
        className
      )}
    >
      {/* Linha central sutil visível */}
      <div
        className={cn(
          'transition-colors',
          isHorizontal ? 'h-[1px] w-full' : 'h-full w-[1px]',
          isResizing ? 'bg-brand' : 'bg-transparent group-hover:bg-brand'
        )}
      />
    </div>
  );
}

