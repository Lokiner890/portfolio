import type { NextRequest } from 'next/server';

// Route Handlers that use the access token cookie must reject requests started by other sites (CSRF).
// The SameSite=lax cookie already blocks most of them; this also checks the Origin header that browsers
// send with every POST, PUT, PATCH and DELETE. Same rule as Next.js uses for Server Functions: the Origin
// host must match the host the request was sent to (X-Forwarded-Host behind a proxy / CDN; with several
// proxies it is a list, `example.com, internal`, the first one is the host the browser sent the request to).
export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host')?.split(',')[0].trim() || request.headers.get('host');

  if (!origin || !host || !URL.canParse(origin)) {
    return false;
  }

  return new URL(origin).host === host;
}
