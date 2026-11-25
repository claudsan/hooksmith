import { contextBridge, ipcRenderer, webFrame, type IpcRendererEvent } from 'electron';

export interface Workspace {
  id: string;
  name: string;
  project_path: string | null;
  default_target_url: string;
  created_at: number;
}

export interface Listener {
  id: string;
  workspace_id: string;
  name?: string | null;
  port: number;
  target_forward_url: string | null;
  is_active: number;
  is_https: number;
  created_at: number;
}

export interface MockRule {
  id: string;
  workspace_id: string;
  listener_port?: number | null;
  name: string;
  enabled: number;
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
  created_at: number;
}

export interface CapturedRequest {
  id: string;
  workspace_id: string;
  listener_port: number;
  method: string;
  path: string;
  query_json: string;
  headers_json: string;
  body_raw: string | null;
  response_status: number;
  response_headers_json: string;
  response_body: string | null;
  duration_ms: number;
  source_type: 'CAPTURED' | 'MOCKED' | 'FORWARDED' | 'REPLAY' | 'CALLBACK';
  created_at: number;
}

export interface ReplayRequest {
  requestId: string;
  targetUrl: string;
  overrideMethod?: string;
  overrideHeaders?: Record<string, string>;
  overrideBody?: string;
}

export interface ListenerCreateInput {
  workspace_id: string;
  name?: string | null;
  port: number;
  target_forward_url?: string;
  is_https?: number;
}

export interface ListenerUpdateInput {
  name?: string | null;
  port?: number;
  target_forward_url?: string | null;
  is_active?: number;
  is_https?: number;
}

export interface MockInput {
  workspace_id: string;
  listener_port?: number | null;
  name: string;
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

export type MockUpdateInput = Partial<Omit<MockInput, 'workspace_id'> & { enabled: number }>;

type Unsubscribe = () => void;

/** Registra um listener IPC e devolve uma função de unsubscribe que remove exatamente o mesmo handler. */
function subscribe<T>(channel: string, callback: (payload: T) => void): Unsubscribe {
  const handler = (_event: IpcRendererEvent, payload: T) => callback(payload);
  ipcRenderer.on(channel, handler);
  return () => {
    ipcRenderer.removeListener(channel, handler);
  };
}

const hookforgeAPI = {
  workspaces: {
    getAll: () => ipcRenderer.invoke('workspaces:getAll') as Promise<Workspace[]>,
    create: (data: { name: string; project_path?: string; default_target_url?: string }) =>
      ipcRenderer.invoke('workspaces:create', data) as Promise<string>,
    delete: (id: string) => ipcRenderer.invoke('workspaces:delete', id) as Promise<void>,
    setActive: (id: string) => ipcRenderer.invoke('workspaces:setActive', id) as Promise<void>,
  },
  listeners: {
    getByWorkspace: (workspaceId: string) =>
      ipcRenderer.invoke('listeners:getByWorkspace', workspaceId) as Promise<Listener[]>,
    create: (data: ListenerCreateInput) => ipcRenderer.invoke('listeners:create', data) as Promise<string>,
    update: (id: string, data: ListenerUpdateInput) =>
      ipcRenderer.invoke('listeners:update', id, data) as Promise<void>,
    delete: (id: string) => ipcRenderer.invoke('listeners:delete', id) as Promise<void>,
    toggle: (id: string, isActive: number) => ipcRenderer.invoke('listeners:toggle', id, isActive) as Promise<void>,
    getCertsDir: () => ipcRenderer.invoke('listeners:getCertsDir') as Promise<string>,
  },
  mocks: {
    getByWorkspace: (workspaceId: string) =>
      ipcRenderer.invoke('mocks:getByWorkspace', workspaceId) as Promise<MockRule[]>,
    create: (data: MockInput) => ipcRenderer.invoke('mocks:create', data) as Promise<string>,
    update: (id: string, data: MockUpdateInput) => ipcRenderer.invoke('mocks:update', id, data) as Promise<void>,
    delete: (id: string) => ipcRenderer.invoke('mocks:delete', id) as Promise<void>,
    toggle: (id: string, enabled: number) => ipcRenderer.invoke('mocks:toggle', id, enabled) as Promise<void>,
  },
  requests: {
    getByWorkspace: (workspaceId: string, limit?: number) =>
      ipcRenderer.invoke('requests:getByWorkspace', workspaceId, limit) as Promise<CapturedRequest[]>,
    clear: (workspaceId: string) => ipcRenderer.invoke('requests:clear', workspaceId) as Promise<void>,
    replay: (data: ReplayRequest) => ipcRenderer.invoke('requests:replay', data) as Promise<CapturedRequest>,
  },
  app: {
    minimize: () => ipcRenderer.invoke('app:minimize') as Promise<void>,
    maximize: () => ipcRenderer.invoke('app:maximize') as Promise<void>,
    close: () => ipcRenderer.invoke('app:close') as Promise<void>,
    isMaximized: () => ipcRenderer.invoke('app:isMaximized') as Promise<boolean>,
  },
  shell: {
    openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url) as Promise<void>,
  },
  zoom: {
    get: () => webFrame.getZoomFactor(),
    set: (factor: number) => webFrame.setZoomFactor(factor),
    reset: () => webFrame.setZoomFactor(1.15),
  },
  onTrafficNewRequest: (callback: (record: CapturedRequest) => void) =>
    subscribe<CapturedRequest>('traffic:new-request', callback),
  onMocksUpdated: (callback: (workspaceId: string) => void) => subscribe<string>('mocks:updated', callback),
  onMaximizedChange: (callback: (maximized: boolean) => void) =>
    subscribe<boolean>('app:maximized-changed', callback),
};

contextBridge.exposeInMainWorld('hookforge', hookforgeAPI);

export type HookforgeAPI = typeof hookforgeAPI;

declare global {
  interface Window {
    hookforge: HookforgeAPI;
  }
}

export {};
