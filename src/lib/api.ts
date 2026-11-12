// fetch wrapper for the backend API (NEXT_PUBLIC_API_URL), works on the server and in the browser.
// Requests that need the access token: `authApiFetch` (src/lib/authApi.ts) on the server, and
// `appApiFetch` to this app's Route Handlers from Client Components. The token is in an httpOnly
// cookie, only the server can read it.
//
//   const users = await apiFetch<Array<User>>('/users', { query: { page: 1 } });
//   await apiFetch('/users', { method: 'POST', body: { name } });
//
// Responses are read as JSON or text. For files (PDF, images, exports) use a link to the API proxy
// (`<a href="/api/reports/1/pdf" download>`) or a plain `fetch` and `response.blob()`.

// a request that takes longer fails, so a slow backend doesn't keep a page render waiting forever
const DEFAULT_TIMEOUT_MS = 30_000;

// thrown for every response that isn't 2xx; `status` 4xx is an expected app state and is not
// reported to Sentry (src/lib/reportError.ts, `beforeSend` in src/lib/sentry.ts)
export class ApiError extends Error {
  readonly status: number;

  // parsed response body (JSON or text), e.g. validation errors from the backend
  readonly data: unknown;

  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  // a plain object or array is sent as JSON, FormData / Blob / string are sent as they are
  body?: BodyInit | Record<string, unknown> | Array<unknown>;
  query?: Record<string, string | number | boolean>;
  accessToken?: string;
  // NEXT_PUBLIC_API_URL by default
  baseUrl?: string;
  timeoutMs?: number;
};

const isJsonBody = (body: ApiFetchOptions['body']) => (
  typeof body === 'object' && body !== null && (Array.isArray(body) || Object.getPrototypeOf(body) === Object.prototype)
);

const buildUrl = (path: string, query: ApiFetchOptions['query'], baseUrl = process.env.NEXT_PUBLIC_API_URL) => {
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set, see .env.example');
  }

  const search = new URLSearchParams(
    Object.entries(query ?? {}).map(([key, value]) => [key, String(value)]),
  ).toString();

  // a string, not new URL(path, baseUrl): keeps a base path like https://api.example.com/v1,
  // and works with a relative base like /api
  return `${baseUrl.replace(/\/$/, '')}${path}${search ? `?${search}` : ''}`;
};

const parseBody = async (response: Response) => {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  return response.headers.get('content-type')?.includes('json') ? JSON.parse(text) : text;
};

// Next.js options pass through, e.g. `next: { revalidate: 60, tags: ['users'] }` for cached public data.
// Never cache a request with an access token (`cache: 'force-cache'`, `next.revalidate`): the cached
// response would be shared between users.
export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, query, accessToken, baseUrl, timeoutMs = DEFAULT_TIMEOUT_MS, headers, signal, ...init } = options;
  const requestHeaders = new Headers(headers);
  const jsonBody = isJsonBody(body);

  // JSON unless the caller asks for something else
  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json');
  }

  if (jsonBody) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(buildUrl(path, query, baseUrl), {
    ...init,
    headers: requestHeaders,
    body: jsonBody ? JSON.stringify(body) : (body as BodyInit | undefined),
    // the caller's signal (e.g. from TanStack Query) cancels it earlier, the timeout still applies
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs),
  });

  const data = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(response.status, `${init.method ?? 'GET'} ${path} failed with ${response.status}`, data);
  }

  return data as T;
}

// Requests from Client Components to this app's Route Handlers (src/app/api): same origin, so the
// browser sends the httpOnly access token cookie, and the Route Handler adds the token for the backend.
//   const notifications = await appApiFetch<Array<Notification>>('/notifications', { query: { page: 3 } });
export const appApiFetch = <T = unknown>(path: string, options: Omit<ApiFetchOptions, 'accessToken' | 'baseUrl'> = {}) => (
  apiFetch<T>(path, { ...options, baseUrl: '/api' })
);
