// @vitest-environment node
import { NextRequest } from 'next/server';

import { DELETE, GET, POST } from '@/app/api/[...path]/route';
import { getAccessToken } from '@/lib/session';

vi.mock('@/lib/session', () => ({
  getAccessToken: vi.fn(async () => 'token'),
}));

const ORIGIN = 'http://localhost:3000';
const API_URL = 'https://api.example.com/v1';

const fetchMock = vi.fn<typeof fetch>();

interface RequestOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
}

// a request from this app's Client Component to /api/<path>
const call = (handler: typeof GET, path: Array<string>, { method = 'GET', body, headers = {} }: RequestOptions = {}) => {
  const search = headers['x-test-search'] ?? '';
  const request = new NextRequest(`${ORIGIN}/api/${path.join('/')}${search}`, {
    method,
    body,
    headers: { host: 'localhost:3000', cookie: 'accessToken=token; other=secret', ...headers },
  });

  return handler(request, { params: Promise.resolve({ path }) });
};

const backendRequest = () => {
  const [url, init] = fetchMock.mock.calls[0];

  return { url: String(url), init: init ?? {}, headers: new Headers(init?.headers) };
};

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_API_URL', `${API_URL}/`);
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockResolvedValue(Response.json({ id: 1 }));
});

test('should forward the path and query to the backend with the access token', async () => {
  const response = await call(GET, ['notifications'], {
    headers: {
      'x-test-search': '?page=3',
      'accept': 'application/json',
      'x-forwarded-for': '203.0.113.7',
      'user-agent': 'Browser/1.0',
      'x-custom': 'not forwarded',
    },
  });

  const { url, init, headers } = backendRequest();

  expect(url).toBe(`${API_URL}/notifications?page=3`);
  expect(init.method).toBe('GET');
  expect(init.body).toBeNull();
  expect(headers.get('Authorization')).toBe('Bearer token');
  expect(headers.get('Accept')).toBe('application/json');
  // the user's IP and browser for the backend logs and rate limits
  expect(headers.get('X-Forwarded-For')).toBe('203.0.113.7');
  expect(headers.get('User-Agent')).toBe('Browser/1.0');
  // the browser's cookies and other headers stay in the app
  expect(headers.get('Cookie')).toBeNull();
  expect(headers.get('X-Custom')).toBeNull();

  expect(response.status).toBe(200);
  expect(response.headers.get('Cache-Control')).toBe('private, no-store');
  await expect(response.json()).resolves.toEqual({ id: 1 });
});

test('should stream the request body and pass the backend response as it is', async () => {
  fetchMock.mockResolvedValue(new Response('{"errors":{"name":"Required"}}', {
    status: 422,
    statusText: 'Unprocessable Content',
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': 'backend=1', 'Content-Encoding': 'gzip' },
  }));

  const response = await call(POST, ['users'], {
    method: 'POST',
    body: '{"name":""}',
    headers: { 'origin': ORIGIN, 'content-type': 'application/json' },
  });

  const { init, headers } = backendRequest();

  expect(init.method).toBe('POST');
  await expect(new Response(init.body).text()).resolves.toBe('{"name":""}');
  expect(headers.get('Content-Type')).toBe('application/json');

  expect(response.status).toBe(422);
  expect(response.statusText).toBe('Unprocessable Content');
  expect(response.headers.get('Content-Type')).toBe('application/json');
  // backend cookies and the already decoded encoding are not passed to the browser
  expect(response.headers.get('Set-Cookie')).toBeNull();
  expect(response.headers.get('Content-Encoding')).toBeNull();
  await expect(response.json()).resolves.toEqual({ errors: { name: 'Required' } });
});

test('should pass file downloads through', async () => {
  fetchMock.mockResolvedValue(new Response('%PDF-1.4', {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="report.pdf"' },
  }));

  const response = await call(GET, ['reports', '1', 'pdf']);

  expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="report.pdf"');
  await expect(response.text()).resolves.toBe('%PDF-1.4');
});

test('should encode path segments', async () => {
  await call(GET, ['users', 'a b', 'c/d']);

  expect(backendRequest().url).toBe(`${API_URL}/users/a%20b/c%2Fd`);
});

test('should reject requests that change data from other sites', async () => {
  const fromOtherSite = await call(DELETE, ['users', '1'], { method: 'DELETE', headers: { origin: 'https://evil.example' } });
  const withoutOrigin = await call(POST, ['users'], { method: 'POST', body: '{}' });

  expect(fromOtherSite.status).toBe(403);
  expect(withoutOrigin.status).toBe(403);
  expect(fetchMock).not.toHaveBeenCalled();
});

test('should allow GET without an Origin header (browsers omit it for same-origin GET)', async () => {
  expect((await call(GET, ['users'])).status).toBe(200);
});

test('should answer 401 without a session', async () => {
  vi.mocked(getAccessToken).mockResolvedValueOnce(null);

  const response = await call(GET, ['users']);

  expect(response.status).toBe(401);
  expect(response.headers.get('Cache-Control')).toBe('private, no-store');
  expect(fetchMock).not.toHaveBeenCalled();
});

test('should reject paths that step out of the API base path', async () => {
  expect((await call(GET, ['..', 'admin'])).status).toBe(400);
  expect((await call(GET, ['users', '.'])).status).toBe(400);
  expect(fetchMock).not.toHaveBeenCalled();
});

test('should answer nothing when the browser cancelled the request', async () => {
  const controller = new AbortController();
  const request = new NextRequest(`${ORIGIN}/api/slow`, { headers: { host: 'localhost:3000' }, signal: controller.signal });

  fetchMock.mockImplementation((_, init) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));

  const pending = GET(request, { params: Promise.resolve({ path: ['slow'] }) });

  await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
  controller.abort();

  // the backend request is cancelled with it
  expect(backendRequest().init.signal?.aborted).toBe(true);
  expect((await pending).status).toBe(499);
});

test('should throw when the backend is unreachable, Next.js answers 500 and reports it', async () => {
  const error = new TypeError('fetch failed');

  fetchMock.mockRejectedValue(error);

  await expect(call(GET, ['users'])).rejects.toBe(error);
});

test('should fail with a clear error without NEXT_PUBLIC_API_URL', async () => {
  vi.stubEnv('NEXT_PUBLIC_API_URL', '');

  await expect(call(GET, ['users'])).rejects.toThrow('NEXT_PUBLIC_API_URL is not set');
});
