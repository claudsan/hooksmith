import type { Database as SqliteDatabase } from 'better-sqlite3';
import type { Workspace, Listener, MockRule, CapturedRequest } from '../preload.js';

export const WorkspaceRepo = {
  getAll(db: SqliteDatabase): Workspace[] {
    return db.prepare('SELECT * FROM workspaces ORDER BY created_at DESC').all() as Workspace[];
  },
  getById(db: SqliteDatabase, id: string): Workspace | undefined {
    return db.prepare('SELECT * FROM workspaces WHERE id = ?').get(id) as Workspace | undefined;
  },
  create(db: SqliteDatabase, workspace: Workspace): void {
    db.prepare(
      'INSERT INTO workspaces (id, name, project_path, default_target_url, created_at) VALUES (?, ?, ?, ?, ?)'
    ).run(workspace.id, workspace.name, workspace.project_path, workspace.default_target_url, workspace.created_at);
  },
  update(db: SqliteDatabase, id: string, data: Partial<Workspace>): void {
    const fields = Object.keys(data).filter(k => k !== 'id').map(k => `${k} = ?`).join(', ');
    const values = Object.entries(data).filter(([k]) => k !== 'id').map(([, v]) => v);
    if (fields) db.prepare(`UPDATE workspaces SET ${fields} WHERE id = ?`).run(...values, id);
  },
  delete(db: SqliteDatabase, id: string): void {
    db.prepare('DELETE FROM workspaces WHERE id = ?').run(id);
  },
};

export const ListenerRepo = {
  getByWorkspace(db: SqliteDatabase, workspaceId: string): Listener[] {
    return db.prepare('SELECT * FROM listeners WHERE workspace_id = ? ORDER BY created_at').all(workspaceId) as Listener[];
  },
  getById(db: SqliteDatabase, id: string): Listener | undefined {
    return db.prepare('SELECT * FROM listeners WHERE id = ?').get(id) as Listener | undefined;
  },
  create(db: SqliteDatabase, listener: Listener): void {
    db.prepare(
      'INSERT INTO listeners (id, workspace_id, name, port, target_forward_url, is_active, is_https, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(listener.id, listener.workspace_id, listener.name ?? null, listener.port, listener.target_forward_url, listener.is_active, listener.is_https ?? 0, listener.created_at);
  },
  update(db: SqliteDatabase, id: string, data: Partial<Listener>): void {
    const fields = Object.keys(data).filter(k => k !== 'id').map(k => `${k} = ?`).join(', ');
    const values = Object.entries(data).filter(([k]) => k !== 'id').map(([, v]) => v);
    if (fields) db.prepare(`UPDATE listeners SET ${fields} WHERE id = ?`).run(...values, id);
  },
  delete(db: SqliteDatabase, id: string): void {
    db.prepare('DELETE FROM listeners WHERE id = ?').run(id);
  },
};

export const MockRepo = {
  getByWorkspace(db: SqliteDatabase, workspaceId: string): MockRule[] {
    return db.prepare('SELECT * FROM mock_rules WHERE workspace_id = ? ORDER BY created_at').all(workspaceId) as MockRule[];
  },
  getById(db: SqliteDatabase, id: string): MockRule | undefined {
    return db.prepare('SELECT * FROM mock_rules WHERE id = ?').get(id) as MockRule | undefined;
  },
  create(db: SqliteDatabase, mock: MockRule): void {
    db.prepare(
      'INSERT INTO mock_rules (id, workspace_id, listener_port, name, enabled, method, path, delay_ms, status_code, response_headers_json, response_body, callback_url, callback_method, callback_body, callback_delay_ms, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(
      mock.id,
      mock.workspace_id,
      mock.listener_port ?? null,
      mock.name,
      mock.enabled,
      mock.method,
      mock.path,
      mock.delay_ms,
      mock.status_code,
      mock.response_headers_json,
      mock.response_body,
      mock.callback_url ?? null,
      mock.callback_method ?? 'POST',
      mock.callback_body ?? null,
      mock.callback_delay_ms ?? 0,
      mock.created_at
    );
  },
  update(db: SqliteDatabase, id: string, data: Partial<MockRule>): void {
    const fields = Object.keys(data).filter(k => k !== 'id').map(k => `${k} = ?`).join(', ');
    const values = Object.entries(data).filter(([k]) => k !== 'id').map(([, v]) => v);
    if (fields) db.prepare(`UPDATE mock_rules SET ${fields} WHERE id = ?`).run(...values, id);
  },
  delete(db: SqliteDatabase, id: string): void {
    db.prepare('DELETE FROM mock_rules WHERE id = ?').run(id);
  },
};

export const RequestRepo = {
  getByWorkspace(db: SqliteDatabase, workspaceId: string, limit: number): CapturedRequest[] {
    return db.prepare('SELECT * FROM captured_requests WHERE workspace_id = ? ORDER BY created_at DESC LIMIT ?').all(workspaceId, limit) as CapturedRequest[];
  },
  create(db: SqliteDatabase, request: CapturedRequest): void {
    db.prepare(
      'INSERT INTO captured_requests (id, workspace_id, listener_port, method, path, query_json, headers_json, body_raw, response_status, response_headers_json, response_body, duration_ms, source_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(
      request.id, request.workspace_id, request.listener_port, request.method, request.path,
      request.query_json, request.headers_json, request.body_raw, request.response_status,
      request.response_headers_json, request.response_body, request.duration_ms, request.source_type, request.created_at
    );
  },
  clearByWorkspace(db: SqliteDatabase, workspaceId: string): void {
    db.prepare('DELETE FROM captured_requests WHERE workspace_id = ?').run(workspaceId);
  },
};