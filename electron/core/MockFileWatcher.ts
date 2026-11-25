import { watch, type FSWatcher } from 'chokidar';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Database as SqliteDatabase } from 'better-sqlite3';
// MockRule imported but unused, removing
import { MockRepo, WorkspaceRepo } from '../db/repositories.js';
import { AppDatabase } from '../db/database.js';
import { randomUUID } from 'node:crypto';

interface WatcherEntry {
  watcher: FSWatcher;
  workspaceId: string;
  debounceTimer: NodeJS.Timeout | null;
  isWriting: boolean;
}

export class MockFileWatcher {
  private db: SqliteDatabase;
  private watchers: Map<string, WatcherEntry> = new Map();
  private onMocksUpdated?: (workspaceId: string) => void;

  constructor(db: AppDatabase) {
    this.db = db.getDb();
  }

  startWatching(workspaceId: string): void {
    const workspace = WorkspaceRepo.getById(this.db, workspaceId);
    if (!workspace?.project_path || this.watchers.has(workspaceId)) return;

    const filePath = join(workspace.project_path, '.hookforge-mocks.json');
    if (!existsSync(filePath)) {
      this.exportMocks(workspaceId);
    }

    const watcher = watch(filePath, {
      persistent: true,
      awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 50 },
    });

    const entry: WatcherEntry = {
      watcher,
      workspaceId,
      debounceTimer: null,
      isWriting: false,
    };

    watcher.on('change', () => {
      if (entry.isWriting) return;
      if (entry.debounceTimer) clearTimeout(entry.debounceTimer);
      entry.debounceTimer = setTimeout(() => this.importMocks(workspaceId), 300);
    });

    this.watchers.set(workspaceId, entry);
  }

  stopWatching(workspaceId: string): void {
    const entry = this.watchers.get(workspaceId);
    if (entry) {
      if (entry.debounceTimer) clearTimeout(entry.debounceTimer);
      entry.watcher.close();
      this.watchers.delete(workspaceId);
    }
  }

  stopAll(): void {
    for (const entry of this.watchers.values()) {
      if (entry.debounceTimer) clearTimeout(entry.debounceTimer);
      entry.watcher.close();
    }
    this.watchers.clear();
  }

  exportMocks(workspaceId: string): void {
    const workspace = WorkspaceRepo.getById(this.db, workspaceId);
    if (!workspace?.project_path) return;

    const mocks = MockRepo.getByWorkspace(this.db, workspaceId);
    const filePath = join(workspace.project_path, '.hookforge-mocks.json');

    const entry = this.watchers.get(workspaceId);
    if (entry) entry.isWriting = true;

    const data = JSON.stringify(
      mocks.map(m => ({
        id: m.id,
        name: m.name,
        listener_port: m.listener_port ?? null,
        enabled: m.enabled,
        method: m.method,
        path: m.path,
        delay_ms: m.delay_ms,
        status_code: m.status_code,
        response_headers_json: m.response_headers_json,
        response_body: m.response_body,
        callback_url: m.callback_url ?? null,
        callback_method: m.callback_method ?? 'POST',
        callback_body: m.callback_body ?? null,
        callback_delay_ms: m.callback_delay_ms ?? 0,
        created_at: m.created_at,
      })),
      null,
      2
    );

    writeFileSync(filePath, data, 'utf8');

    if (entry) {
      setTimeout(() => { entry.isWriting = false; }, 100);
    }
  }

  private importMocks(workspaceId: string): void {
    const workspace = WorkspaceRepo.getById(this.db, workspaceId);
    if (!workspace?.project_path) return;

    const filePath = join(workspace.project_path, '.hookforge-mocks.json');
    if (!existsSync(filePath)) return;

    try {
      const content = readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      const deleteStmt = this.db.prepare('DELETE FROM mock_rules WHERE workspace_id = ?');
      deleteStmt.run(workspaceId);

      const insertStmt = this.db.prepare(
        'INSERT INTO mock_rules (id, workspace_id, listener_port, name, enabled, method, path, delay_ms, status_code, response_headers_json, response_body, callback_url, callback_method, callback_body, callback_delay_ms, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );

      for (const rule of data) {
        insertStmt.run(
          rule.id || randomUUID(),
          workspaceId,
          rule.listener_port ?? null,
          rule.name,
          rule.enabled ?? 1,
          rule.method,
          rule.path,
          rule.delay_ms ?? 0,
          rule.status_code ?? 200,
          rule.response_headers_json || '{}',
          rule.response_body || '',
          rule.callback_url ?? null,
          rule.callback_method ?? 'POST',
          rule.callback_body ?? null,
          rule.callback_delay_ms ?? 0,
          rule.created_at || Date.now()
        );
      }

      this.onMocksUpdated?.(workspaceId);
    } catch (err) {
      console.error('Failed to import mocks:', err);
    }
  }

  on(event: 'mocksUpdated', callback: (workspaceId: string) => void): void {
    if (event === 'mocksUpdated') {
      this.onMocksUpdated = callback;
    }
  }
}