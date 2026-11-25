import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export const SEARCH_INPUT_ID = 'global-search';
const ZOOM_STORAGE_KEY = 'hooksmith:zoom-factor';
const DEFAULT_ZOOM = 1.15; // 115% de escala padrão para ótima legibilidade

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.id === SEARCH_INPUT_ID) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"], .monaco-editor'));
}

/** Atalhos globais (CLAUDE.md §6 + Atalhos de Zoom Ctrl+/Ctrl-). */
export function useGlobalShortcuts(): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useAppStore.getState();
      const mod = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // Controle de Zoom nativo: Ctrl + +, Ctrl + -, Ctrl + 0
      if (mod && (key === '=' || key === '+' || e.code === 'NumpadAdd')) {
        e.preventDefault();
        const api = window.hookforge;
        if (api?.zoom) {
          const current = api.zoom.get();
          const next = Math.min(2.0, Math.round((current + 0.05) * 100) / 100);
          api.zoom.set(next);
          localStorage.setItem(ZOOM_STORAGE_KEY, String(next));
          s.pushToast('info', `Zoom: ${Math.round(next * 100)}%`);
        }
        return;
      }

      if (mod && (key === '-' || key === '_' || e.code === 'NumpadSubtract')) {
        e.preventDefault();
        const api = window.hookforge;
        if (api?.zoom) {
          const current = api.zoom.get();
          const next = Math.max(0.8, Math.round((current - 0.05) * 100) / 100);
          api.zoom.set(next);
          localStorage.setItem(ZOOM_STORAGE_KEY, String(next));
          s.pushToast('info', `Zoom: ${Math.round(next * 100)}%`);
        }
        return;
      }

      if (mod && (key === '0' || e.code === 'Numpad0')) {
        e.preventDefault();
        const api = window.hookforge;
        if (api?.zoom) {
          api.zoom.set(DEFAULT_ZOOM);
          localStorage.setItem(ZOOM_STORAGE_KEY, String(DEFAULT_ZOOM));
          s.pushToast('info', `Zoom: ${Math.round(DEFAULT_ZOOM * 100)}% (Padrão)`);
        }
        return;
      }

      if (mod && key === 'k') {
        e.preventDefault();
        const input = document.getElementById(SEARCH_INPUT_ID) as HTMLInputElement | null;
        input?.focus();
        input?.select();
        return;
      }

      if (s.listenerModal.open || s.mockModal.open) return;

      if (mod && key === 'enter') {
        e.preventDefault();
        e.stopPropagation();
        void s.runReplay();
        return;
      }
      if (mod && key === 'm') {
        e.preventDefault();
        s.openMockFromSelected();
        return;
      }
      if (key === 'escape') {
        if (s.editMode) {
          s.setEditMode(false);
        } else if (s.selectedRequestId || s.selectedMockId) {
          s.selectRequest(null);
          s.selectMock(null);
        } else {
          (document.activeElement as HTMLElement | null)?.blur();
        }
        return;
      }
      if ((key === 'arrowdown' || key === 'arrowup') && !mod && !isTypingTarget(e.target)) {
        e.preventDefault();
        s.selectRelative(key === 'arrowdown' ? 1 : -1);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);
}

/** Boot do estado + configuração do zoom inicial + assinatura dos eventos IPC. */
export function useAppBootstrap(): void {
  useEffect(() => {
    // Aplica o zoom configurado ou o novo padrão confortável de 115%
    const api = window.hookforge;
    if (api?.zoom) {
      const saved = localStorage.getItem(ZOOM_STORAGE_KEY);
      const factor = saved ? parseFloat(saved) : DEFAULT_ZOOM;
      if (!isNaN(factor)) {
        api.zoom.set(factor);
      }
    }

    void useAppStore.getState().bootstrap();
    if (!api) return;
    const offTraffic = api.onTrafficNewRequest((record) => useAppStore.getState().addIncomingRequest(record));
    const offMocks = api.onMocksUpdated((workspaceId) => {
      const s = useAppStore.getState();
      if (workspaceId === s.activeWorkspaceId) void s.refreshMocks();
    });
    return () => {
      offTraffic();
      offMocks();
    };
  }, []);
}
