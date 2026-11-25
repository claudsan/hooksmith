import { useEffect, useState } from 'react';

/** Relógio compartilhado para tempos relativos (“2s ago”) sem re-render por item. */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

