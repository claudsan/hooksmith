import { request } from 'undici';
import { randomUUID } from 'node:crypto';
import type { Database as SqliteDatabase } from 'better-sqlite3';
import { RequestRepo } from '../db/repositories.js';
import type { CapturedRequest, ReplayRequest } from '../preload.js';
import { AppDatabase } from '../db/database.js';

export class ReplayEngine {
  private db: SqliteDatabase;
  private onNewRequest: (record: CapturedRequest) => void;

  constructor(db: AppDatabase, onNewRequest: (record: CapturedRequest) => void) {
    this.db = db.getDb();
    this.onNewRequest = onNewRequest;
  }

  async replay(data: ReplayRequest): Promise<CapturedRequest> {
    const startTime = performance.now();

    const stmt = this.db.prepare('SELECT * FROM captured_requests WHERE id = ?');
    const original = stmt.get(data.requestId) as CapturedRequest | undefined;
    if (!original) throw new Error('Original request not found');

    const method = (data.overrideMethod || original.method || 'GET') as any;
    const headers = data.overrideHeaders || JSON.parse(original.headers_json || '{}');
    const body = data.overrideBody !== undefined ? data.overrideBody : original.body_raw;
    const query = JSON.parse(original.query_json || '{}');

    const url = new URL(data.targetUrl);
    Object.entries(query).forEach(([k, v]) => url.searchParams.append(k, String(v)));

    let responseStatus: number;
    let responseHeaders: Record<string, string>;
    let responseBody: string;

    try {
      const resp = await request(url.toString(), {
        method,
        headers,
        body: body || undefined,
      });
      responseStatus = resp.statusCode;
      responseHeaders = Object.fromEntries(
        Object.entries(resp.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : String(v)])
      );
      responseBody = await resp.body.text();
    } catch (err: any) {
      responseStatus = 0;
      responseHeaders = {};
      responseBody = JSON.stringify({ error: err.message });
    }

    const durationMs = Math.round(performance.now() - startTime);

    const record: CapturedRequest = {
      id: randomUUID(),
      workspace_id: original.workspace_id,
      listener_port: original.listener_port,
      method,
      path: new URL(data.targetUrl).pathname,
      query_json: JSON.stringify(query),
      headers_json: JSON.stringify(headers),
      body_raw: body || null,
      response_status: responseStatus,
      response_headers_json: JSON.stringify(responseHeaders),
      response_body: responseBody,
      duration_ms: durationMs,
      source_type: 'REPLAY',
      created_at: Date.now(),
    };

    RequestRepo.create(this.db, record);
    this.onNewRequest(record);
    return record;
  }
}