import { join } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';
import type { Database as SqliteDatabase } from 'better-sqlite3';

const BetterSqlite3 = require('better-sqlite3');

export class AppDatabase {
  private db: SqliteDatabase;
  constructor(dbPath: string) {
    const dir = join(dbPath, '..');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    this.db = new (BetterSqlite3 as any)(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('foreign_keys = ON');
    this.initialize();
  }

  initialize(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS workspaces (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        project_path TEXT,
        default_target_url TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS listeners (
        id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        name TEXT,
        port INTEGER NOT NULL,
        target_forward_url TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        is_https INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS mock_rules (
        id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        listener_port INTEGER DEFAULT NULL,
        name TEXT NOT NULL,
        enabled INTEGER NOT NULL DEFAULT 1,
        method TEXT NOT NULL,
        path TEXT NOT NULL,
        delay_ms INTEGER NOT NULL DEFAULT 0,
        status_code INTEGER NOT NULL DEFAULT 200,
        response_headers_json TEXT NOT NULL,
        response_body TEXT NOT NULL,
        callback_url TEXT DEFAULT NULL,
        callback_method TEXT DEFAULT 'POST',
        callback_body TEXT DEFAULT NULL,
        callback_delay_ms INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS captured_requests (
        id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        listener_port INTEGER NOT NULL,
        method TEXT NOT NULL,
        path TEXT NOT NULL,
        query_json TEXT NOT NULL,
        headers_json TEXT NOT NULL,
        body_raw TEXT,
        response_status INTEGER NOT NULL,
        response_headers_json TEXT NOT NULL,
        response_body TEXT,
        duration_ms INTEGER NOT NULL,
        source_type TEXT NOT NULL DEFAULT 'CAPTURED',
        created_at INTEGER NOT NULL,
        FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_captured_requests_workspace_created
        ON captured_requests(workspace_id, created_at DESC);
    `);

    this.setupRetentionTrigger();
    this.runMigrations();
  }

  private runMigrations(): void {
    const listenerCols = this.db.pragma('table_info(listeners)') as Array<{ name: string }>;
    if (!listenerCols.some(c => c.name === 'is_https')) {
      this.db.exec('ALTER TABLE listeners ADD COLUMN is_https INTEGER NOT NULL DEFAULT 0;');
    }
    if (!listenerCols.some(c => c.name === 'name')) {
      this.db.exec('ALTER TABLE listeners ADD COLUMN name TEXT DEFAULT NULL;');
    }
    this.db.exec("UPDATE listeners SET name = 'Listener :' || port WHERE name IS NULL OR TRIM(name) = '';");

    const mockCols = this.db.pragma('table_info(mock_rules)') as Array<{ name: string }>;
    if (!mockCols.some(c => c.name === 'listener_port')) {
      this.db.exec('ALTER TABLE mock_rules ADD COLUMN listener_port INTEGER DEFAULT NULL;');
    }
    if (!mockCols.some(c => c.name === 'callback_url')) {
      this.db.exec('ALTER TABLE mock_rules ADD COLUMN callback_url TEXT DEFAULT NULL;');
    }
    if (!mockCols.some(c => c.name === 'callback_method')) {
      this.db.exec("ALTER TABLE mock_rules ADD COLUMN callback_method TEXT DEFAULT 'POST';");
    }
    if (!mockCols.some(c => c.name === 'callback_body')) {
      this.db.exec('ALTER TABLE mock_rules ADD COLUMN callback_body TEXT DEFAULT NULL;');
    }
    if (!mockCols.some(c => c.name === 'callback_delay_ms')) {
      this.db.exec('ALTER TABLE mock_rules ADD COLUMN callback_delay_ms INTEGER DEFAULT 0;');
    }
  }

  private setupRetentionTrigger(): void {
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS trg_captured_requests_retention
      AFTER INSERT ON captured_requests
      BEGIN
        DELETE FROM captured_requests
        WHERE workspace_id = NEW.workspace_id
          AND id NOT IN (
            SELECT id FROM captured_requests
            WHERE workspace_id = NEW.workspace_id
            ORDER BY created_at DESC
            LIMIT 2000
          );
      END;
    `);
  }

  getDb(): SqliteDatabase {
    return this.db;
  }

  close(): void {
    this.db.close();
  }
}