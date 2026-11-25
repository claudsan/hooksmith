import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import { request as undiciRequest } from 'undici';
import { randomUUID } from 'node:crypto';
import type { Database as SqliteDatabase } from 'better-sqlite3';
import { MockMatcher } from './MockMatcher.js';
import { RequestRepo } from '../db/repositories.js';
import type { CapturedRequest, MockRule } from '../preload.js';
import { AppDatabase } from '../db/database.js';
import { CertificateManager } from './CertificateManager.js';

interface ListenerServer {
  fastify: FastifyInstance;
  port: number;
  workspaceId: string;
  targetForwardUrl: string | null;
  isHttps: boolean;
}

export class ListenerManager {
  private servers: Map<string, ListenerServer> = new Map();
  private db: SqliteDatabase;
  private onNewRequest: (record: CapturedRequest) => void;
  private mockMatcher: MockMatcher;
  private certManager: CertificateManager;

  constructor(db: AppDatabase, certManager: CertificateManager, onNewRequest: (record: CapturedRequest) => void) {
    this.db = db.getDb();
    this.certManager = certManager;
    this.onNewRequest = onNewRequest;
    this.mockMatcher = new MockMatcher(db.getDb());
  }

  async startListener(
    workspaceId: string,
    port: number,
    targetForwardUrl: string | null,
    isHttps: boolean = false
  ): Promise<void> {
    const key = `${workspaceId}:${port}`;
    if (this.servers.has(key)) return;

    try {
      let httpsConfig: { key: string; cert: string } | null = null;
      if (isHttps) {
        const creds = await this.certManager.getOrCreateCertificate();
        httpsConfig = {
          key: creds.key,
          cert: creds.cert,
        };
      }

      const fastify = Fastify({
        https: httpsConfig,
        logger: false,
        bodyLimit: 10 * 1024 * 1024,
      });

      fastify.addContentTypeParser(
        ['application/json', 'application/x-www-form-urlencoded', 'text/plain', 'application/xml', '*'],
        { parseAs: 'string' },
        (req, body, done) => {
          const raw = body as string;
          let parsed: any = raw;
          try {
            const ct = req.headers['content-type'] || '';
            if (ct.includes('application/json') || raw.trim().startsWith('{') || raw.trim().startsWith('[')) {
              parsed = JSON.parse(raw);
            } else if (ct.includes('application/x-www-form-urlencoded')) {
              parsed = Object.fromEntries(new URLSearchParams(raw));
            }
          } catch {
            parsed = raw;
          }
          (req as any).rawBody = raw;
          (req as any).parseError = false;
          done(null, parsed);
        }
      );

      fastify.all('/*', async (request, reply) => {
        const startTime = performance.now();
        const method = request.method;
        const path = request.url;
        const headers = request.headers as Record<string, string>;
        const query = request.query as Record<string, string>;
        const body = (request as any).rawBody || (typeof request.body === 'string' ? request.body : JSON.stringify(request.body));

        const mock = this.mockMatcher.findMatch(workspaceId, method, path, port);
        let responseStatus: number;
        let responseHeaders: Record<string, string>;
        let responseBody: string;
        let sourceType: CapturedRequest['source_type'];

        if (mock) {
          await new Promise(r => setTimeout(r, mock.delay_ms));
          responseStatus = mock.status_code;
          responseHeaders = JSON.parse(mock.response_headers_json || '{}');
          responseBody = mock.response_body || '';
          sourceType = 'MOCKED';

          if (mock.callback_url && mock.callback_url.trim().length > 0) {
            this.triggerMockCallback(workspaceId, port, mock, body);
          }
        } else if (targetForwardUrl) {
          const forwardUrl = targetForwardUrl.replace(/\/$/, '') + path;
          const cleanHeaders = { ...headers };
          delete cleanHeaders.host;
          delete cleanHeaders['content-length'];

          try {
            const resp = await undiciRequest(forwardUrl, {
              method: method as any,
              headers: cleanHeaders,
              body: body && body.length > 0 ? body : undefined,
            });
            responseStatus = resp.statusCode;
            responseHeaders = Object.fromEntries(
              Object.entries(resp.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : String(v)])
            );
            responseBody = await resp.body.text();
            sourceType = 'FORWARDED';
          } catch (err: any) {
            responseStatus = 502;
            responseHeaders = { 'Content-Type': 'application/json' };
            responseBody = JSON.stringify({ error: 'Bad Gateway', detail: err.message });
            sourceType = 'FORWARDED';
          }
        } else {
          responseStatus = 200;
          responseHeaders = { 'Content-Type': 'application/json' };
          responseBody = JSON.stringify({
            received: true,
            service: 'HookForge Local',
            protocol: isHttps ? 'https' : 'http',
            id: randomUUID(),
            timestamp: new Date().toISOString(),
          });
          sourceType = 'CAPTURED';
        }

        const durationMs = Math.round(performance.now() - startTime);

        const record: CapturedRequest = {
          id: randomUUID(),
          workspace_id: workspaceId,
          listener_port: port,
          method,
          path,
          query_json: JSON.stringify(query),
          headers_json: JSON.stringify(headers),
          body_raw: body || null,
          response_status: responseStatus,
          response_headers_json: JSON.stringify(responseHeaders),
          response_body: responseBody,
          duration_ms: durationMs,
          source_type: sourceType,
          created_at: Date.now(),
        };

        RequestRepo.create(this.db, record);
        this.onNewRequest(record);

        reply.status(responseStatus);
        Object.entries(responseHeaders).forEach(([k, v]) => reply.header(k, v));
        reply.send(responseBody);
      });

      await fastify.listen({ port, host: '127.0.0.1' });
      this.servers.set(key, { fastify, port, workspaceId, targetForwardUrl, isHttps });
    } catch (err: any) {
      if (err.code === 'EADDRINUSE') {
        throw new Error(`Port ${port} is already in use`);
      }
      throw err;
    }
  }

  async stopListener(workspaceId: string, port: number): Promise<void> {
    const key = `${workspaceId}:${port}`;
    const server = this.servers.get(key);
    if (!server) return;
    this.servers.delete(key);
    await server.fastify.close();
  }

  isRunning(workspaceId: string, port: number): boolean {
    return this.servers.has(`${workspaceId}:${port}`);
  }

  isListenerHttps(workspaceId: string, port: number): boolean {
    return this.servers.get(`${workspaceId}:${port}`)?.isHttps ?? false;
  }

  async stopWorkspaceListeners(workspaceId: string): Promise<void> {
    for (const [key, server] of this.servers.entries()) {
      if (server.workspaceId === workspaceId) {
        await server.fastify.close();
        this.servers.delete(key);
      }
    }
  }

  stopAll(): void {
    for (const server of this.servers.values()) {
      server.fastify.close();
    }
    this.servers.clear();
  }

  private triggerMockCallback(
    workspaceId: string,
    port: number,
    mock: MockRule,
    incomingBody: string | null
  ): void {
    const rawUrl = mock.callback_url?.trim();
    if (!rawUrl) return;

    const delay = Math.max(0, Number(mock.callback_delay_ms) || 0);

    setTimeout(async () => {
      const cbStartTime = performance.now();
      const cbMethod = (mock.callback_method || 'POST').toUpperCase();
      const cbBody =
        mock.callback_body !== null && mock.callback_body !== undefined && mock.callback_body.trim().length > 0
          ? mock.callback_body
          : incomingBody || undefined;

      let cbStatus = 0;
      let cbRespHeaders: Record<string, string> = {};
      let cbRespBody = '';

      try {
        const resp = await undiciRequest(rawUrl, {
          method: cbMethod as any,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Hooksmith-Mock-Callback/1.0',
            'X-Hooksmith-Mock-Id': mock.id,
            'X-Hooksmith-Mock-Name': mock.name || '',
          },
          body: cbBody,
        });

        cbStatus = resp.statusCode;
        cbRespHeaders = Object.fromEntries(
          Object.entries(resp.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : String(v)])
        );
        cbRespBody = await resp.body.text();
      } catch (err: any) {
        cbStatus = 502;
        cbRespHeaders = { 'Content-Type': 'application/json' };
        cbRespBody = JSON.stringify({ error: 'Callback Failed', detail: err.message });
      }

      const cbDuration = Math.round(performance.now() - cbStartTime);

      const callbackRecord: CapturedRequest = {
        id: randomUUID(),
        workspace_id: workspaceId,
        listener_port: port,
        method: cbMethod,
        path: `[CALLBACK] ${rawUrl}`,
        query_json: '{}',
        headers_json: JSON.stringify({
          'Content-Type': 'application/json',
          'User-Agent': 'Hooksmith-Mock-Callback/1.0',
          'X-Hooksmith-Mock-Id': mock.id,
        }),
        body_raw: cbBody || null,
        response_status: cbStatus,
        response_headers_json: JSON.stringify(cbRespHeaders),
        response_body: cbRespBody,
        duration_ms: cbDuration,
        source_type: 'CALLBACK',
        created_at: Date.now(),
      };

      RequestRepo.create(this.db, callbackRecord);
      this.onNewRequest(callbackRecord);
    }, delay);
  }
}
