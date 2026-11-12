import { type NextRequest, NextResponse } from 'next/server';

import { PRIVATE_ROUTES, ROUTES } from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants/storage';

const isPrivateRoute = (pathname: string) => PRIVATE_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));

// Runs on the server before a route is rendered, for page loads and client-side navigations.
// Private routes without the access token cookie redirect to login. It only checks that the
// cookie exists, the backend still validates the token on every request.
// https://nextjs.org/docs/app/api-reference/file-conventions/proxy
export function proxy(request: NextRequest) {
  if (isPrivateRoute(request.nextUrl.pathname) && !request.cookies.get(STORAGE_KEYS.accessToken)?.value) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Must be a literal (Next.js reads it at build time), so ROUTES can't be used here:
  // runs for every route except static files and image optimization, isPrivateRoute decides.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
