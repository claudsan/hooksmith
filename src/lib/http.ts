import type { CapturedRequest } from '@/types/ipc';

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
export type TrafficFilter = 'ALL' | 'POST' | 'GET' | 'ERRORS';

// ───────────────────────── Estilos de método / status ─────────────────────────
export interface MethodStyle {
  text: string;
  bg: string;
  border: string;
}

const NEUTRAL_METHOD: MethodStyle = { text: '#94A3B8', bg: 'rgba(148, 163, 184, 0.10)', border: 'rgba(148, 163, 184, 0.22)' };
const BLUE_METHOD: MethodStyle = { text: '#60A5FA', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)' };

const METHOD_STYLES: Record<string, MethodStyle> = {
  GET: { text: '#34D399', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)' },
  POST: { text: '#FBBF24', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)' },
  PUT: BLUE_METHOD,
  PATCH: BLUE_METHOD,
  DELETE: { text: '#F87171', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.25)' },
};

export const methodStyle = (method: string): MethodStyle => METHOD_STYLES[method.toUpperCase()] ?? NEUTRAL_METHOD;

export function statusColor(code: number): string {
  if (code >= 500) return '#EF4444';
  if (code >= 400) return '#F59E0B';
  if (code >= 300) return '#38BDF8';
  if (code >= 200) return '#10B981';
  return '#64748B';
}

const STATUS_TEXT: Record<number, string> = {
  200: 'OK', 201: 'Created', 202: 'Accepted', 204: 'No Content',
  301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified',
  400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed',
  409: 'Conflict', 422: 'Unprocessable Entity', 429: 'Too Many Requests',
  500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable', 504: 'Gateway Timeout',
};

export const statusText = (code: number): string => (code === 0 ? 'Network Error' : STATUS_TEXT[code] ?? '');

export const SOURCE_STYLES: Record<CapturedRequest['source_type'], { label: string; color: string } | null> = {
  CAPTURED: null,
  MOCKED: { label: 'MOCKED', color: '#C084FC' },
  FORWARDED: { label: 'FORWARDED', color: '#38BDF8' },
  REPLAY: { label: 'REPLAY', color: '#F97316' },
  CALLBACK: { label: 'CALLBACK', color: '#F43F5E' },
};

// ───────────────────────── Formatação ─────────────────────────
export function formatRelative(timestamp: number, now: number): string {
  const s = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (s < 3) return 'now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export const formatClock = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export function formatDateTime(timestamp: number): string {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleString([], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const byteLength = (value: string | null | undefined): number =>
  value ? new TextEncoder().encode(value).length : 0;

// ───────────────────────── Payloads ─────────────────────────
export function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function prettify(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

export type PayloadLanguage = 'json' | 'xml' | 'html' | 'plaintext';

export function detectLanguage(raw: string | null | undefined, contentType = ''): PayloadLanguage {
  const ct = contentType.toLowerCase();
  if (ct.includes('json')) return 'json';
  if (ct.includes('html')) return 'html';
  if (ct.includes('xml')) return 'xml';
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return 'plaintext';
  if (/^[[{]/.test(trimmed)) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      return 'plaintext';
    }
  }
  if (/^<!doctype html|^<html/i.test(trimmed)) return 'html';
  if (trimmed.startsWith('<')) return 'xml';
  return 'plaintext';
}

export function headerValue(headers: Record<string, string>, name: string): string {
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? String(headers[key]) : '';
}

export const toHeadersText = (headers: Record<string, string>): string => JSON.stringify(headers, null, 2);

export function parseHeadersText(text: string): Record<string, string> {
  const trimmed = text.trim();
  if (!trimmed) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error('Headers must be valid JSON');
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Headers must be a JSON object');
  }
  return Object.fromEntries(Object.entries(parsed as Record<string, unknown>).map(([k, v]) => [k, String(v)]));
}

// ───────────────────────── URLs / cURL ─────────────────────────
export function splitPath(path: string): { pathname: string; search: string } {
  const idx = path.indexOf('?');
  return idx < 0 ? { pathname: path, search: '' } : { pathname: path.slice(0, idx), search: path.slice(idx) };
}

export function buildTargetUrl(base: string | null | undefined, path: string): string {
  const { pathname } = splitPath(path);
  try {
    return new URL(pathname, base || 'http://localhost:8080').toString();
  } catch {
    return pathname;
  }
}

const CURL_SKIPPED_HEADERS = new Set(['host', 'content-length', 'connection', 'accept-encoding']);
const shellQuote = (value: string) => `'${value.replace(/'/g, `'\\''`)}'`;

export function buildCurl(opts: { method: string; url: string; headers: Record<string, string>; body?: string | null }): string {
  const parts = [`curl -X ${opts.method.toUpperCase()} ${shellQuote(opts.url)}`];
  for (const [k, v] of Object.entries(opts.headers)) {
    if (!CURL_SKIPPED_HEADERS.has(k.toLowerCase())) parts.push(`-H ${shellQuote(`${k}: ${v}`)}`);
  }
  if (opts.body) parts.push(`--data-raw ${shellQuote(opts.body)}`);
  return parts.join(' \\\n  ');
}

// ───────────────────────── Filtro de tráfego ─────────────────────────
const isError = (r: CapturedRequest) => r.response_status === 0 || r.response_status >= 400;

const FILTER_STRATEGIES: Record<TrafficFilter, (r: CapturedRequest) => boolean> = {
  ALL: () => true,
  POST: (r) => r.method === 'POST',
  GET: (r) => r.method === 'GET',
  ERRORS: isError,
};

export function matchesFilter(request: CapturedRequest, filter: TrafficFilter): boolean {
  return FILTER_STRATEGIES[filter](request);
}

export function filterRequests(requests: CapturedRequest[], filter: TrafficFilter, query: string): CapturedRequest[] {
  const q = query.trim().toLowerCase();
  return requests.filter((r) => {
    if (!matchesFilter(r, filter)) return false;
    if (!q) return true;
    return (
      r.path.toLowerCase().includes(q) ||
      r.method.toLowerCase() === q ||
      String(r.response_status).startsWith(q) ||
      (r.body_raw ?? '').toLowerCase().includes(q) ||
      (r.response_body ?? '').toLowerCase().includes(q)
    );
  });
}

// ───────────────────────── Erros IPC ─────────────────────────
export function errorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  return raw.replace(/^Error invoking remote method '[^']+':\s*(Error:\s*)?/, '');
}

