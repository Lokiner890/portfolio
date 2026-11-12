import { ApiError, apiFetch, appApiFetch } from '@/lib/api';

const API_URL = 'https://api.example.com/v1';

const fetchMock = vi.fn<typeof fetch>();

const jsonResponse = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json' },
});

const lastRequest = () => {
  const [url, init] = fetchMock.mock.calls[0];

  return { url: String(url), init: init ?? {}, headers: new Headers(init?.headers) };
};

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_API_URL', `${API_URL}/`);
  vi.stubGlobal('fetch', fetchMock);
});

test('should request the API URL with the query and return the JSON body', async () => {
  fetchMock.mockResolvedValue(jsonResponse([{ id: 1 }]));

  await expect(apiFetch('/users', { query: { page: 2, active: true } })).resolves.toEqual([{ id: 1 }]);

  const { url, headers, init } = lastRequest();

  // the base path (/v1) is kept, the trailing slash of NEXT_PUBLIC_API_URL is not doubled
  expect(url).toBe(`${API_URL}/users?page=2&active=true`);
  expect(headers.get('Accept')).toBe('application/json');
  expect(headers.get('Authorization')).toBeNull();
  expect(init.signal).toBeInstanceOf(AbortSignal);
});

test('should send an object body as JSON with the access token', async () => {
  fetchMock.mockResolvedValue(jsonResponse({ id: 1 }, 201));

  await apiFetch('/users', { method: 'POST', body: { name: 'Ann' }, accessToken: 'token' });

  const { init, headers } = lastRequest();

  expect(init.method).toBe('POST');
  expect(init.body).toBe('{"name":"Ann"}');
  expect(headers.get('Content-Type')).toBe('application/json');
  expect(headers.get('Authorization')).toBe('Bearer token');
});

test('should send FormData as it is', async () => {
  fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
  const formData = new FormData();

  formData.set('file', 'content');

  await expect(apiFetch('/files', { method: 'POST', body: formData })).resolves.toBeNull();

  const { init, headers } = lastRequest();

  expect(init.body).toBe(formData);
  // fetch sets multipart/form-data with the boundary itself
  expect(headers.get('Content-Type')).toBeNull();
});

test('should return text and empty bodies', async () => {
  fetchMock.mockResolvedValueOnce(new Response('pong', { headers: { 'Content-Type': 'text/plain' } }));
  fetchMock.mockResolvedValueOnce(new Response('', { status: 200 }));

  await expect(apiFetch('/ping')).resolves.toBe('pong');
  await expect(apiFetch('/empty')).resolves.toBeNull();
});

test('should throw an ApiError with the status and the response body', async () => {
  fetchMock.mockResolvedValue(jsonResponse({ errors: { name: 'Required' } }, 422));

  const error = await apiFetch('/users', { method: 'POST', body: {} }).catch((caught: unknown) => caught);

  expect(error).toBeInstanceOf(ApiError);
  expect(error).toMatchObject({
    name: 'ApiError',
    status: 422,
    message: 'POST /users failed with 422',
    data: { errors: { name: 'Required' } },
  });
});

test('should name the default GET method in the error', async () => {
  fetchMock.mockResolvedValue(new Response('Not Found', { status: 404 }));

  await expect(apiFetch('/users/1')).rejects.toMatchObject({
    status: 404,
    message: 'GET /users/1 failed with 404',
    data: 'Not Found',
  });
});

test('should cancel the request with the given abort signal and keep the timeout', async () => {
  fetchMock.mockResolvedValue(jsonResponse({}));
  const controller = new AbortController();

  await apiFetch('/users', { signal: controller.signal });

  const { signal } = lastRequest().init;

  expect(signal?.aborted).toBe(false);
  controller.abort();
  expect(signal?.aborted).toBe(true);
});

test('should time out even with the given abort signal', async () => {
  fetchMock.mockResolvedValue(jsonResponse({}));

  await apiFetch('/users', { signal: new AbortController().signal, timeoutMs: 1 });

  await vi.waitFor(() => expect(lastRequest().init.signal?.aborted).toBe(true));
});

test('should fail with a clear error without NEXT_PUBLIC_API_URL', async () => {
  vi.stubEnv('NEXT_PUBLIC_API_URL', '');

  await expect(apiFetch('/users')).rejects.toThrow('NEXT_PUBLIC_API_URL is not set');
  expect(fetchMock).not.toHaveBeenCalled();
});

test('should request this app\'s Route Handlers with a relative URL', async () => {
  fetchMock.mockResolvedValue(jsonResponse({ total: 0 }));

  await appApiFetch('/notifications', { query: { page: 3 } });

  expect(lastRequest().url).toBe('/api/notifications?page=3');
  // the browser sends the cookie, no token in the request
  expect(lastRequest().headers.get('Authorization')).toBeNull();
});

test('should keep the Accept header the caller sets', async () => {
  fetchMock.mockResolvedValue(new Response('<svg/>', { headers: { 'Content-Type': 'image/svg+xml' } }));

  await expect(apiFetch('/logo', { headers: { Accept: 'image/svg+xml' } })).resolves.toBe('<svg/>');
  expect(lastRequest().headers.get('Accept')).toBe('image/svg+xml');
});
