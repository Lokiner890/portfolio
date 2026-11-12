import type { NextRequest } from 'next/server';

import { isSameOrigin } from '@/lib/request';
import { getAccessToken } from '@/lib/session';

// Catch-all proxy to the backend for Client Components: `appApiFetch('/users/1')` (src/lib/api.ts)
// requests /api/users/1, this forwards it to NEXT_PUBLIC_API_URL/users/1 with the access token from
// the httpOnly cookie. The backend still validates the input and checks the permissions.
// A more specific Route Handler (e.g. src/app/api/reports/route.ts) takes precedence over this one:
// write one only to combine, reshape or hide backend data.
// https://nextjs.org/docs/app/guides/backend-for-frontend#proxying-to-a-backend

const TIMEOUT_MS = 30_000;

// requests that don't change data, the Origin check is only needed for the others
const SAFE_METHODS = new Set(['GET', 'HEAD']);

// only these headers are forwarded, never the browser's cookies or Host; X-Forwarded-For (set by the
// CDN / load balancer) and User-Agent keep the user's IP and browser in the backend logs and rate limits.
// X-Forwarded-For is passed as it arrives: a client can send its own, so the backend must trust only the
// address added by the load balancer (the last one in the list), never the first one.
const REQUEST_HEADERS = [
  'accept',
  'accept-language',
  'content-type',
  'if-none-match',
  'if-modified-since',
  'user-agent',
  'x-forwarded-for',
];

// content-length and content-encoding are not passed back: fetch has already decompressed the body
const RESPONSE_HEADERS = ['content-type', 'content-disposition', 'etag', 'last-modified'];

// responses are per user: never cached by the browser or the CDN
const NO_STORE = { 'Cache-Control': 'private, no-store' };

const pickHeaders = (source: Headers, names: Array<string>) => {
  const headers = new Headers();

  names.forEach((name) => {
    const value = source.get(name);

    if (value) {
      headers.set(name, value);
    }
  });

  return headers;
};

async function forward(request: NextRequest, { params }: RouteContext<'/api/[...path]'>) {
  if (!SAFE_METHODS.has(request.method) && !isSameOrigin(request)) {
    return Response.json({ message: 'Forbidden' }, { status: 403, headers: NO_STORE });
  }

  const accessToken = await getAccessToken();

  if (!accessToken) {
    return Response.json({ message: 'Unauthorized' }, { status: 401, headers: NO_STORE });
  }

  const { path } = await params;

  // `..` would step out of the API base path (e.g. /v1)
  if (path.some(segment => segment === '.' || segment === '..')) {
    return Response.json({ message: 'Invalid path' }, { status: 400, headers: NO_STORE });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set, see .env.example');
  }

  const url = `${apiUrl.replace(/\/$/, '')}/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`;
  const headers = pickHeaders(request.headers, REQUEST_HEADERS);

  headers.set('Authorization', `Bearer ${accessToken}`);

  // `duplex` is needed to stream a request body, the DOM types don't have it yet
  const init: RequestInit & { duplex: 'half' } = {
    method: request.method,
    headers,
    // streamed, so file uploads aren't held in memory
    body: SAFE_METHODS.has(request.method) ? null : request.body,
    duplex: 'half',
    // stops the backend request when the browser cancels (e.g. a newer search) or after the timeout
    signal: AbortSignal.any([request.signal, AbortSignal.timeout(TIMEOUT_MS)]),
    cache: 'no-store',
  };

  const response = await fetch(url, init).catch((error: unknown) => {
    // the browser cancelled the request: there is no one to answer and nothing to report
    if (request.signal.aborted) {
      return null;
    }

    // backend unreachable or too slow: Next.js answers 500 and onRequestError reports it
    throw error;
  });

  if (!response) {
    return new Response(null, { status: 499 });
  }

  const responseHeaders = pickHeaders(response.headers, RESPONSE_HEADERS);

  Object.entries(NO_STORE).forEach(([name, value]) => responseHeaders.set(name, value));

  // status and body as they come from the backend (4xx with validation errors included), streamed
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export { forward as DELETE, forward as GET, forward as HEAD, forward as PATCH, forward as POST, forward as PUT };
