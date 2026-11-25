import type { Database as SqliteDatabase } from 'better-sqlite3';
import type { MockRule } from '../preload.js';

export class MockMatcher {
  private db: SqliteDatabase;

  constructor(db: SqliteDatabase) {
    this.db = db;
  }

  /**
   * Normaliza um path HTTP removendo query string, hash e trailing slash (exceto root '/').
   * Garante que comece com '/'.
   */
  private normalizePath(rawPath: string): string {
    if (!rawPath) return '/';
    // Remove query params e hash se presentes
    const clean = rawPath.split(/[?#]/)[0].trim();
    // Garante barra inicial
    const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
    // Remove barra final se não for a raiz
    if (withSlash.length > 1 && withSlash.endsWith('/')) {
      return withSlash.slice(0, -1);
    }
    return withSlash;
  }

  findMatch(workspaceId: string, method: string, requestPath: string, port?: number): MockRule | null {
    const normReqPath = this.normalizePath(requestPath);
    const upperMethod = (method || 'GET').toUpperCase();
    const pathWithSlash = normReqPath === '/' ? '/' : `${normReqPath}/`;
    const targetPort = port !== undefined && port !== null ? Number(port) : null;

    // 1. Exact match com precedência de porta (específica primeiro, fallback global)
    let exactMatch: MockRule | undefined;

    if (targetPort !== null) {
      const exactStmt = this.db.prepare(`
        SELECT * FROM mock_rules
        WHERE workspace_id = ?
          AND enabled = 1
          AND UPPER(method) = ?
          AND (path = ? OR path = ?)
          AND (listener_port = ? OR listener_port IS NULL)
        ORDER BY
          CASE WHEN listener_port = ? THEN 0 ELSE 1 END,
          created_at ASC
        LIMIT 1
      `);
      exactMatch = exactStmt.get(
        workspaceId,
        upperMethod,
        normReqPath,
        pathWithSlash,
        targetPort,
        targetPort
      ) as MockRule | undefined;
    } else {
      const exactStmt = this.db.prepare(`
        SELECT * FROM mock_rules
        WHERE workspace_id = ?
          AND enabled = 1
          AND UPPER(method) = ?
          AND (path = ? OR path = ?)
        ORDER BY
          CASE WHEN listener_port IS NULL THEN 0 ELSE 1 END,
          created_at ASC
        LIMIT 1
      `);
      exactMatch = exactStmt.get(workspaceId, upperMethod, normReqPath, pathWithSlash) as MockRule | undefined;
    }

    if (exactMatch) return exactMatch;

    // 2. Wildcard pattern match (* ou caminhos com asterisco)
    let wildcards: MockRule[] = [];

    if (targetPort !== null) {
      const wildcardStmt = this.db.prepare(`
        SELECT * FROM mock_rules
        WHERE workspace_id = ?
          AND enabled = 1
          AND UPPER(method) = ?
          AND (path LIKE '%*%' OR path = '*')
          AND (listener_port = ? OR listener_port IS NULL)
        ORDER BY
          CASE WHEN listener_port = ? THEN 0 ELSE 1 END,
          LENGTH(path) DESC,
          created_at ASC
      `);
      wildcards = wildcardStmt.all(workspaceId, upperMethod, targetPort, targetPort) as MockRule[];
    } else {
      const wildcardStmt = this.db.prepare(`
        SELECT * FROM mock_rules
        WHERE workspace_id = ?
          AND enabled = 1
          AND UPPER(method) = ?
          AND (path LIKE '%*%' OR path = '*')
        ORDER BY
          CASE WHEN listener_port IS NULL THEN 0 ELSE 1 END,
          LENGTH(path) DESC,
          created_at ASC
      `);
      wildcards = wildcardStmt.all(workspaceId, upperMethod) as MockRule[];
    }

    for (const rule of wildcards) {
      const normRulePath = this.normalizePath(rule.path);
      // Se a regra é simplesmente '*' ou '/*', casa com qualquer rota
      if (rule.path === '*' || normRulePath === '/*') {
        return rule;
      }

      // Converte padrão glob para regex
      const pattern = normRulePath
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escapa caracteres especiais de regex
        .replace(/\*/g, '.*');                  // Substitui * por .*

      const regex = new RegExp(`^${pattern}$`, 'i');
      if (regex.test(normReqPath) || regex.test(pathWithSlash)) {
        return rule;
      }
    }

    return null;
  }
}
