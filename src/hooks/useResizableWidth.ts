import { useState, useCallback, useEffect, useRef } from 'react';

interface UseResizableWidthOptions {
  storageKey?: string;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function useResizableWidth({
  storageKey = 'hooksmith:traffic-column-width',
  defaultWidth = 350,
  minWidth = 260,
  maxWidth = 750,
}: UseResizableWidthOptions = {}) {
  const [width, setWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = Number(saved);
        if (!isNaN(parsed) && parsed >= minWidth && parsed <= maxWidth) {
          return parsed;
        }
      }
    } catch {
      // Ignora erro de acesso a storage
    }
    return defaultWidth;
  });

  const [isResizing, setIsResizing] = useState(false);
  const widthRef = useRef(width);
  widthRef.current = width;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);

      const startX = e.clientX;
      const startWidth = widthRef.current;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        const next = Math.min(maxWidth, Math.max(minWidth, Math.round(startWidth + delta)));
        setWidth(next);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        document.body.style.removeProperty('user-select');
        document.body.style.removeProperty('cursor');

        try {
          localStorage.setItem(storageKey, String(widthRef.current));
        } catch {
          // Ignora
        }
      };

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [storageKey, minWidth, maxWidth]
  );

  const resetWidth = useCallback(() => {
    setWidth(defaultWidth);
    try {
      localStorage.setItem(storageKey, String(defaultWidth));
    } catch {
      // Ignora
    }
  }, [defaultWidth, storageKey]);

  return {
    width,
    isResizing,
    onMouseDown: handleMouseDown,
    resetWidth,
  };
}

