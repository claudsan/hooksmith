import { create } from 'zustand';
import type { CapturedRequest, Listener, MockRule, ReplayRequest, Workspace } from '@/types/ipc';
import {
  buildCurl,
  buildTargetUrl,
  errorMessage,
  filterRequests,
  headerValue,
  parseHeadersText,
  safeJsonParse,
  splitPath,
  statusText,
  toHeadersText,
  type TrafficFilter,
} from '@/lib/http';

const MAX_REQUESTS = 2000;
const TOAST_TTL_MS = 3800;
const WORKSPACE_STORAGE_KEY = 'hooksmith:active-workspace';

export type ToastKind = 'success' | 'error' | 'info';
export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

export interface MockDraft {
  id?: string;
  name: string;
  listener_port?: number | null;
  enabled?: number;
  method: string;
  path: string;
  delay_ms: number;
  status_code: number;
  response_headers_json: string;
  response_body: string;
  callback_url?: string | null;
  callback_method?: string | null;
  callback_body?: string | null;
  callback_delay_ms?: number;
}

export interface ListenerDraft {
  id?: string;
  name?: string | null;
  port: number;
  target_forward_url: string | null;
  is_https?: number;
}

export interface ReplayDraft {
  targetUrl: string;
  body: string;
  headersText: string;
}

const EMPTY_REPLAY: ReplayDraft = { targetUrl: '', body: '', headersText: '{}' };

export const EMPTY_MOCK: MockDraft = {
  name: '',
  listener_port: null,
  enabled: 1,
  method: 'POST',
  path: '/webhooks/',
  delay_ms: 0,
  status_code: 200,
  response_headers_json: JSON.stringify({ 'Content-Type': 'application/json' }, null, 2),
  response_body: '{\n  "ok": true\n}',
  callback_url: null,
  callback_method: 'POST',
  callback_body: null,
  callback_delay_ms: 0,
};

interface AppState {
  ready: boolean;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  listeners: Listener[];
  mocks: MockRule[];
  requests: CapturedRequest[];
  selectedRequestId: string | null;
  selectedMockId: string | null;
  searchQuery: string;
  trafficFilter: TrafficFilter;
  replayDraft: ReplayDraft;
  editMode: boolean;
  replaying: boolean;
  listenerModal: { open: boolean; editing: Listener | null };
  mockModal: { open: boolean; draft: MockDraft | null };
  toasts: Toast[];

  bootstrap: () => Promise<void>;
  selectWorkspace: (id: string) => Promise<void>;
  refreshListeners: () => Promise<void>;
  refreshMocks: () => Promise<void>;
  refreshRequests: () => Promise<void>;

  addIncomingRequest: (record: CapturedRequest) => void;
  selectRequest: (id: string | null) => void;
  selectMock: (id: string | null) => void;
  selectRelative: (delta: 1 | -1) => void;
  clearRequests: () => Promise<void>;
  setSearchQuery: (q: string) => void;
  setTrafficFilter: (f: TrafficFilter) => void;

  setReplayDraft: (patch: Partial<ReplayDraft>) => void;
  setEditMode: (on: boolean) => void;
  runReplay: () => Promise<void>;
  copySelectedAsCurl: () => Promise<void>;

  openListenerModal: (editing?: Listener | null) => void;
  closeListenerModal: () => void;
  saveListener: (draft: ListenerDraft) => Promise<boolean>;
  toggleListener: (listener: Listener) => Promise<void>;
  deleteListener: (listener: Listener) => Promise<void>;

  openMockModal: (draft?: MockDraft | null) => void;
  openMockFromSelected: () => void;
  closeMockModal: () => void;
  saveMock: (draft: MockDraft) => Promise<boolean>;
  toggleMock: (mock: MockRule) => Promise<void>;
  deleteMock: (mock: MockRule) => Promise<void>;

  copy: (text: string, label: string) => Promise<void>;
  pushToast: (kind: ToastKind, message: string) => void;
  dismissToast: (id: number) => void;
}

/** Bridge IPC exposta pelo preload; ausente quando o renderer roda fora do Electron. */
const bridge = () => (typeof window !== 'undefined' ? window.hookforge : undefined);
let toastSeq = 0;

export const useAppStore = create<AppState>((set, get) => {
  /** Executa uma ação IPC padronizando tratamento de erro com toast. */
  async function guarded<T>(action: () => Promise<T>): Promise<T | undefined> {
    try {
      return await action();
    } catch (err) {
      get().pushToast('error', errorMessage(err));
      return undefined;
    }
  }

  function replayDraftFor(req: CapturedRequest): ReplayDraft {
    const { listeners, workspaces, activeWorkspaceId } = get();
    const listener = listeners.find((l) => l.port === req.listener_port);
    const workspace = workspaces.find((w) => w.id === activeWorkspaceId);
    const base = req.source_type === 'REPLAY' ? undefined : listener?.target_forward_url || workspace?.default_target_url;
    return {
      targetUrl: buildTargetUrl(base, req.path),
      body: req.body_raw ?? '',
      headersText: toHeadersText(safeJsonParse<Record<string, string>>(req.headers_json, {})),
    };
  }

  const selectedRequest = () => get().requests.find((r) => r.id === get().selectedRequestId);

  return {
    ready: false,
    workspaces: [],
    activeWorkspaceId: null,
    listeners: [],
    mocks: [],
    requests: [],
    selectedRequestId: null,
    selectedMockId: null,
    searchQuery: '',
    trafficFilter: 'ALL',
    replayDraft: EMPTY_REPLAY,
    editMode: false,
    replaying: false,
    listenerModal: { open: false, editing: null },
    mockModal: { open: false, draft: null },
    toasts: [],

    // ───────────── Bootstrap / workspace ─────────────
    async bootstrap() {
      const api = bridge();
      if (!api) {
        set({ ready: true });
        return;
      }
      await guarded(async () => {
        const workspaces = await api.workspaces.getAll();
        set({ workspaces });
        const stored = localStorage.getItem(WORKSPACE_STORAGE_KEY);
        const initial = workspaces.find((w) => w.id === stored)?.id ?? workspaces[0]?.id;
        if (initial) await get().selectWorkspace(initial);
      });
      set({ ready: true });
    },

    async selectWorkspace(id) {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, id);
      set({ activeWorkspaceId: id, selectedRequestId: null, editMode: false, replayDraft: EMPTY_REPLAY });
      void bridge()?.workspaces.setActive(id);
      await Promise.all([get().refreshListeners(), get().refreshMocks(), get().refreshRequests()]);
    },

    async refreshListeners() {
      const api = bridge();
      const ws = get().activeWorkspaceId;
      if (!api || !ws) return;
      const listeners = await guarded(() => api.listeners.getByWorkspace(ws));
      if (listeners) set({ listeners });
    },

    async refreshMocks() {
      const api = bridge();
      const ws = get().activeWorkspaceId;
      if (!api || !ws) return;
      const mocks = await guarded(() => api.mocks.getByWorkspace(ws));
      if (mocks) set({ mocks });
    },

    async refreshRequests() {
      const api = bridge();
      const ws = get().activeWorkspaceId;
      if (!api || !ws) return;
      const requests = await guarded(() => api.requests.getByWorkspace(ws, MAX_REQUESTS));
      if (requests) set({ requests });
    },

    // ───────────── Tráfego ─────────────
    addIncomingRequest(record) {
      if (record.workspace_id !== get().activeWorkspaceId) return;
      set((s) => ({ requests: [record, ...s.requests.filter((r) => r.id !== record.id)].slice(0, MAX_REQUESTS) }));
    },

    selectRequest(id) {
      const req = id ? get().requests.find((r) => r.id === id) : undefined;
      set({
        selectedRequestId: req ? req.id : null,
        selectedMockId: null,
        editMode: false,
        replayDraft: req ? replayDraftFor(req) : EMPTY_REPLAY,
      });
    },

    selectMock(id) {
      set({
        selectedMockId: id,
        selectedRequestId: null,
        editMode: false,
      });
    },

    selectRelative(delta) {
      const { requests, trafficFilter, searchQuery, selectedRequestId } = get();
      const visible = filterRequests(requests, trafficFilter, searchQuery);
      if (visible.length === 0) return;
      const idx = visible.findIndex((r) => r.id === selectedRequestId);
      const next = idx < 0 ? 0 : Math.min(visible.length - 1, Math.max(0, idx + delta));
      get().selectRequest(visible[next].id);
    },

    async clearRequests() {
      const api = bridge();
      const ws = get().activeWorkspaceId;
      if (!api || !ws) return;
      await guarded(() => api.requests.clear(ws));
      set({ requests: [], selectedRequestId: null, editMode: false });
    },

    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setTrafficFilter: (trafficFilter) => set({ trafficFilter }),

    // ───────────── Replay ─────────────
    setReplayDraft: (patch) => set((s) => ({ replayDraft: { ...s.replayDraft, ...patch } })),

    setEditMode(on) {
      const req = selectedRequest();
      // Ao sair do modo edição, descarta overrides e volta ao payload original.
      set({ editMode: on, replayDraft: !on && req ? { ...replayDraftFor(req), targetUrl: get().replayDraft.targetUrl } : get().replayDraft });
    },

    async runReplay() {
      const api = bridge();
      const { selectedRequestId, replayDraft, editMode, replaying } = get();
      if (!api || !selectedRequestId || replaying) return;
      if (!/^https?:\/\//i.test(replayDraft.targetUrl)) {
        get().pushToast('error', 'Target URL must start with http:// or https://');
        return;
      }

      const payload: ReplayRequest = { requestId: selectedRequestId, targetUrl: replayDraft.targetUrl };
      if (editMode) {
        try {
          payload.overrideHeaders = parseHeadersText(replayDraft.headersText);
        } catch (err) {
          get().pushToast('error', errorMessage(err));
          return;
        }
        payload.overrideBody = replayDraft.body;
      }

      set({ replaying: true });
      const record = await guarded(() => api.requests.replay(payload));
      set({ replaying: false });
      if (!record) return;

      get().addIncomingRequest(record);
      get().selectRequest(record.id);
      const ok = record.response_status > 0 && record.response_status < 400;
      get().pushToast(
        ok ? 'success' : 'error',
        `Replay → ${record.response_status || 'ERR'} ${statusText(record.response_status)} · ${record.duration_ms} ms`,
      );
    },

    async copySelectedAsCurl() {
      const req = selectedRequest();
      if (!req) return;
      const { replayDraft, editMode } = get();
      const headers = editMode
        ? safeJsonParse<Record<string, string>>(replayDraft.headersText, {})
        : safeJsonParse<Record<string, string>>(req.headers_json, {});
      const url = replayDraft.targetUrl + splitPath(req.path).search;
      await get().copy(buildCurl({ method: req.method, url, headers, body: editMode ? replayDraft.body : req.body_raw }), 'cURL command');
    },

    // ───────────── Listeners ─────────────
    openListenerModal: (editing = null) => set({ listenerModal: { open: true, editing } }),
    closeListenerModal: () => set({ listenerModal: { open: false, editing: null } }),

    async saveListener(draft) {
      const api = bridge();
      const ws = get().activeWorkspaceId;
      if (!api || !ws) return false;
      const ok = await guarded(async () => {
        if (draft.id) {
          await api.listeners.update(draft.id, {
            name: draft.name,
            port: draft.port,
            target_forward_url: draft.target_forward_url,
            is_https: draft.is_https ?? 0,
          });
        } else {
          await api.listeners.create({
            workspace_id: ws,
            name: draft.name ?? undefined,
            port: draft.port,
            target_forward_url: draft.target_forward_url ?? undefined,
            is_https: draft.is_https ?? 0,
          });
        }
        return true;
      });
      await get().refreshListeners();
      if (ok) {
        const label = draft.name ? `${draft.name} (:${draft.port})` : `:${draft.port}`;
        get().pushToast('success', draft.id ? `Listener ${label} atualizado` : `Escutando em ${label}`);
      }
      return Boolean(ok);
    },

    async toggleListener(listener) {
      const api = bridge();
      if (!api) return;
      const next = listener.is_active ? 0 : 1;
      set((s) => ({ listeners: s.listeners.map((l) => (l.id === listener.id ? { ...l, is_active: next } : l)) }));
      await guarded(() => api.listeners.toggle(listener.id, next));
      await get().refreshListeners();
    },

    async deleteListener(listener) {
      const api = bridge();
      if (!api) return;
      await guarded(() => api.listeners.delete(listener.id));
      await get().refreshListeners();
      get().pushToast('info', `Listener :${listener.port} removed`);
    },

    // ───────────── Mocks ─────────────
    openMockModal: (draft = null) => set({ mockModal: { open: true, draft: draft ?? { ...EMPTY_MOCK } } }),

    openMockFromSelected() {
      const req = selectedRequest();
      if (!req) {
        get().openMockModal();
        return;
      }
      const headers = safeJsonParse<Record<string, string>>(req.response_headers_json, {});
      const contentType = headerValue(headers, 'content-type') || 'application/json';
      get().openMockModal({
        name: `${req.method} ${splitPath(req.path).pathname}`,
        listener_port: req.listener_port,
        enabled: 1,
        method: req.method,
        path: splitPath(req.path).pathname,
        delay_ms: 0,
        status_code: req.response_status || 200,
        response_headers_json: JSON.stringify({ 'Content-Type': contentType }, null, 2),
        response_body: req.response_body ?? '',
      });
    },

    closeMockModal: () => set({ mockModal: { open: false, draft: null } }),

    async saveMock(draft) {
      const api = bridge();
      const ws = get().activeWorkspaceId;
      if (!api || !ws) return false;
      const { id, ...fields } = draft;
      const ok = await guarded(async () => {
        if (id) await api.mocks.update(id, fields);
        else await api.mocks.create({ workspace_id: ws, ...fields });
        return true;
      });
      await get().refreshMocks();
      if (ok) get().pushToast('success', id ? 'Mock rule updated' : 'Mock rule created');
      return Boolean(ok);
    },

    async toggleMock(mock) {
      const api = bridge();
      if (!api) return;
      const next = mock.enabled ? 0 : 1;
      set((s) => ({ mocks: s.mocks.map((m) => (m.id === mock.id ? { ...m, enabled: next } : m)) }));
      await guarded(() => api.mocks.toggle(mock.id, next));
      await get().refreshMocks();
    },

    async deleteMock(mock) {
      const api = bridge();
      if (!api) return;
      await guarded(() => api.mocks.delete(mock.id));
      await get().refreshMocks();
      get().pushToast('info', 'Mock rule removed');
    },

    // ───────────── Utilidades ─────────────
    async copy(text, label) {
      try {
        await navigator.clipboard.writeText(text);
        get().pushToast('success', `${label} copied to clipboard`);
      } catch {
        get().pushToast('error', 'Clipboard is not available');
      }
    },

    pushToast(kind, message) {
      const id = ++toastSeq;
      set((s) => ({ toasts: [...s.toasts.slice(-3), { id, kind, message }] }));
      setTimeout(() => get().dismissToast(id), TOAST_TTL_MS);
    },

    dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  };
});
