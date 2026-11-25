import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppDatabase } from './db/database.js';
import { ListenerManager } from './core/ListenerManager.js';
import { MockFileWatcher } from './core/MockFileWatcher.js';
import { ReplayEngine } from './core/ReplayEngine.js';
import { CertificateManager } from './core/CertificateManager.js';
import { ListenerRepo, MockRepo, RequestRepo, WorkspaceRepo } from './db/repositories.js';
import type { ListenerCreateInput, ListenerUpdateInput, MockInput, MockUpdateInput, ReplayRequest } from './preload.js';

const isDev = process.env.NODE_ENV === 'development';
declare const __dirname: string;

let mainWindow: BrowserWindow | null = null;
let db: AppDatabase;
let listenerManager: ListenerManager;
let replayEngine: ReplayEngine;
let mockFileWatcher: MockFileWatcher;
let certManager: CertificateManager;

/** Resolve o ícone da aplicação (gerado em /build) tanto em dev quanto empacotado. */
function resolveAppIcon(): string | undefined {
  const candidates = [
    join(__dirname, '../../build/icon.png'),
    join(process.resourcesPath ?? '', 'icon.png'),
  ];
  return candidates.find((p) => existsSync(p));
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0B0D10',
    title: 'Hooksmith',
    icon: resolveAppIcon(),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
  });

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(join(__dirname, '../../dist/index.html'));
  }

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error(`Failed to load: ${validatedURL} - ${errorDescription} (${errorCode})`);
  });
  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    console.error(`Renderer process gone: ${details.reason}`);
  });

  const notifyMaximized = () => mainWindow?.webContents.send('app:maximized-changed', mainWindow.isMaximized());
  mainWindow.on('maximize', notifyMaximized);
  mainWindow.on('unmaximize', notifyMaximized);

  mainWindow.once('ready-to-show', () => mainWindow?.show());
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/** Inicia um listener sem derrubar o boot caso a porta esteja ocupada. */
async function safeStart(
  workspaceId: string,
  port: number,
  forwardUrl: string | null,
  isHttps: boolean = false
): Promise<void> {
  try {
    await listenerManager.startListener(workspaceId, port, forwardUrl, isHttps);
  } catch (err) {
    console.error(`[listener] Could not start :${port} —`, (err as Error).message);
  }
}

async function initializeCore(): Promise<void> {
  const userDataPath = app.getPath('userData');
  db = new AppDatabase(join(userDataPath, 'hookforge.db'));
  certManager = new CertificateManager(userDataPath);

  const broadcast = (record: unknown) => mainWindow?.webContents.send('traffic:new-request', record);
  listenerManager = new ListenerManager(db, certManager, broadcast);
  replayEngine = new ReplayEngine(db, broadcast);
  mockFileWatcher = new MockFileWatcher(db);

  mockFileWatcher.on('mocksUpdated', (workspaceId: string) => {
    mainWindow?.webContents.send('mocks:updated', workspaceId);
  });

  await seedInitialData();
}

async function seedInitialData(): Promise<void> {
  const sqlite = db.getDb();
  const workspaces = WorkspaceRepo.getAll(sqlite);

  if (workspaces.length === 0) {
    const workspaceId = 'default-workspace';
    WorkspaceRepo.create(sqlite, {
      id: workspaceId,
      name: 'Default Local Workspace',
      project_path: null,
      default_target_url: 'http://localhost:8080/webhooks',
      created_at: Date.now(),
    });
    ListenerRepo.create(sqlite, {
      id: 'default-listener',
      workspace_id: workspaceId,
      name: 'Default Webhooks',
      port: 4010,
      target_forward_url: null,
      is_active: 1,
      is_https: 0,
      created_at: Date.now(),
    });
    MockRepo.create(sqlite, {
      id: 'mock-1',
      workspace_id: workspaceId,
      name: 'Simular Falha Gateway (500)',
      enabled: 0,
      method: 'POST',
      path: '/webhooks/payment',
      delay_ms: 800,
      status_code: 500,
      response_headers_json: JSON.stringify({ 'Content-Type': 'application/json' }),
      response_body: JSON.stringify({ error: 'upstream_timeout', retryable: true }),
      created_at: Date.now(),
    });
    await safeStart(workspaceId, 4010, null, false);
    mockFileWatcher.startWatching(workspaceId);
    return;
  }

  for (const ws of workspaces) {
    for (const l of ListenerRepo.getByWorkspace(sqlite, ws.id)) {
      if (l.is_active) await safeStart(ws.id, l.port, l.target_forward_url || null, Boolean(l.is_https));
    }
    mockFileWatcher.startWatching(ws.id);
  }
}

app.whenReady().then(async () => {
  if (process.platform === 'win32') app.setAppUserModelId('com.hooksmith.app');
  try {
    await initializeCore();
    createWindow();
  } catch (err) {
    console.error('Failed to initialize app:', err);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  listenerManager?.stopAll();
  mockFileWatcher?.stopAll();
  db?.close();
});

// ───────────────────────────── IPC: Workspaces ─────────────────────────────
ipcMain.handle('workspaces:getAll', () => WorkspaceRepo.getAll(db.getDb()));
ipcMain.handle('workspaces:create', (_e, data: { name: string; project_path?: string; default_target_url?: string }) => {
  const id = crypto.randomUUID();
  WorkspaceRepo.create(db.getDb(), {
    id,
    name: data.name,
    project_path: data.project_path ?? null,
    default_target_url: data.default_target_url ?? '',
    created_at: Date.now(),
  });
  mockFileWatcher.startWatching(id);
  return id;
});
ipcMain.handle('workspaces:delete', async (_e, workspaceId: string) => {
  await listenerManager.stopWorkspaceListeners(workspaceId);
  mockFileWatcher.stopWatching(workspaceId);
  WorkspaceRepo.delete(db.getDb(), workspaceId);
});
ipcMain.handle('workspaces:setActive', () => {
  // O workspace ativo é estado de UI (renderer); nada a persistir no Main.
});

// ───────────────────────────── IPC: Listeners ─────────────────────────────
ipcMain.handle('listeners:getByWorkspace', (_e, workspaceId: string) => ListenerRepo.getByWorkspace(db.getDb(), workspaceId));

ipcMain.handle('listeners:create', async (_e, data: ListenerCreateInput) => {
  const forward = data.target_forward_url || null;
  const isHttps = Boolean(data.is_https);
  // Sobe o servidor primeiro: se a porta estiver ocupada, nada é persistido.
  await listenerManager.startListener(data.workspace_id, data.port, forward, isHttps);
  const id = crypto.randomUUID();
  ListenerRepo.create(db.getDb(), {
    id,
    workspace_id: data.workspace_id,
    name: data.name ?? null,
    port: data.port,
    target_forward_url: forward,
    is_active: 1,
    is_https: data.is_https ?? 0,
    created_at: Date.now(),
  });
  return id;
});

ipcMain.handle('listeners:update', async (_e, id: string, data: ListenerUpdateInput) => {
  const sqlite = db.getDb();
  const current = ListenerRepo.getById(sqlite, id);
  if (!current) throw new Error('Listener not found');

  const next = {
    name: data.name === undefined ? current.name : data.name || null,
    port: data.port ?? current.port,
    target_forward_url: data.target_forward_url === undefined ? current.target_forward_url : data.target_forward_url || null,
    is_active: data.is_active ?? current.is_active,
    is_https: data.is_https === undefined ? current.is_https : data.is_https,
  };

  await listenerManager.stopListener(current.workspace_id, current.port);
  if (next.is_active) {
    try {
      await listenerManager.startListener(current.workspace_id, next.port, next.target_forward_url, Boolean(next.is_https));
    } catch (err) {
      if (current.is_active) {
        await safeStart(current.workspace_id, current.port, current.target_forward_url, Boolean(current.is_https));
      }
      throw err;
    }
  }
  ListenerRepo.update(sqlite, id, next);
});

ipcMain.handle('listeners:delete', async (_e, id: string) => {
  const listener = ListenerRepo.getById(db.getDb(), id);
  if (!listener) return;
  await listenerManager.stopListener(listener.workspace_id, listener.port);
  ListenerRepo.delete(db.getDb(), id);
});

ipcMain.handle('listeners:toggle', async (_e, id: string, isActive: number) => {
  const listener = ListenerRepo.getById(db.getDb(), id);
  if (!listener) return;
  if (isActive) {
    await listenerManager.startListener(
      listener.workspace_id,
      listener.port,
      listener.target_forward_url,
      Boolean(listener.is_https)
    );
  } else {
    await listenerManager.stopListener(listener.workspace_id, listener.port);
  }
  ListenerRepo.update(db.getDb(), id, { is_active: isActive });
});

ipcMain.handle('listeners:getCertsDir', () => certManager.getCertsDir());

// ───────────────────────────── IPC: Mocks ─────────────────────────────
ipcMain.handle('mocks:getByWorkspace', (_e, workspaceId: string) => MockRepo.getByWorkspace(db.getDb(), workspaceId));

ipcMain.handle('mocks:create', (_e, data: MockInput) => {
  const id = crypto.randomUUID();
  MockRepo.create(db.getDb(), { id, ...data, enabled: data.enabled ?? 1, created_at: Date.now() });
  mockFileWatcher.exportMocks(data.workspace_id);
  return id;
});

const withMockExport = (id: string, mutate: () => void) => {
  const mock = MockRepo.getById(db.getDb(), id);
  mutate();
  if (mock) mockFileWatcher.exportMocks(mock.workspace_id);
};

ipcMain.handle('mocks:update', (_e, id: string, data: MockUpdateInput) =>
  withMockExport(id, () => MockRepo.update(db.getDb(), id, data)));
ipcMain.handle('mocks:delete', (_e, id: string) => withMockExport(id, () => MockRepo.delete(db.getDb(), id)));
ipcMain.handle('mocks:toggle', (_e, id: string, enabled: number) =>
  withMockExport(id, () => MockRepo.update(db.getDb(), id, { enabled })));

// ───────────────────────────── IPC: Requests ─────────────────────────────
ipcMain.handle('requests:getByWorkspace', (_e, workspaceId: string, limit?: number) =>
  RequestRepo.getByWorkspace(db.getDb(), workspaceId, limit ?? 2000));
ipcMain.handle('requests:clear', (_e, workspaceId: string) => RequestRepo.clearByWorkspace(db.getDb(), workspaceId));
ipcMain.handle('requests:replay', (_e, data: ReplayRequest) => replayEngine.replay(data));

// ───────────────────────────── IPC: Window ─────────────────────────────
ipcMain.handle('app:minimize', () => mainWindow?.minimize());
ipcMain.handle('app:maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.handle('app:close', () => mainWindow?.close());
ipcMain.handle('app:isMaximized', () => mainWindow?.isMaximized() ?? false);
ipcMain.handle('shell:openExternal', (_e, url: string) => shell.openExternal(url));
