import { useState, useCallback, useRef } from 'react';

interface UseResizableHeightOptions {
  storageKey?: string;
  defaultRatio?: number;
  minRatio?: number;
  maxRatio?: number;
}

export function useResizableHeight({
  storageKey = 'hooksmith:inspector-split-ratio',
  defaultRatio = 0.5,
  minRatio = 0.15,
  maxRatio = 0.85,
}: UseResizableHeightOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [ratio, setRatio] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= minRatio && parsed <= maxRatio) {
          return parsed;
        }
      }
    } catch {
      // Ignora erro de acesso a storage
    }
    return defaultRatio;
  });

  const [isResizing, setIsResizing] = useState(false);
  const ratioRef = useRef(ratio);
  ratioRef.current = ratio;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!containerRef.current) return;

      setIsResizing(true);
      const containerRect = containerRef.current.getBoundingClientRect();

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!containerRef.current) return;
        const currentRect = containerRef.current.getBoundingClientRect();
        const relativeY = moveEvent.clientY - currentRect.top;
        const newRatio = Math.min(
          maxRatio,
          Math.max(minRatio, relativeY / currentRect.height)
        );
        setRatio(newRatio);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        document.body.style.removeProperty('user-select');
        document.body.style.removeProperty('cursor');

        try {
          localStorage.setItem(storageKey, String(ratioRef.current));
        } catch {
          // Ignora
        }
      };

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'row-resize';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [storageKey, minRatio, maxRatio]
  );

  const resetRatio = useCallback(() => {
    setRatio(defaultRatio);
    try {
      localStorage.setItem(storageKey, String(defaultRatio));
    } catch {
      // Ignora
    }
  }, [defaultRatio, storageKey]);

  return {
    containerRef,
    ratio,
    topPercent: Math.round(ratio * 1000) / 10, // ex: 50.0%
    isResizing,
    onMouseDown: handleMouseDown,
    resetRatio,
  };
}
