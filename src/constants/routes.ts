// single source of truth for URLs, use in <Link href>, router.push(), redirect() and src/proxy.ts
export const ROUTES = {
  home: '/',
  login: '/auth/login',
  private: '/private',
} as const;

// routes that need the access token, nested paths included (e.g. /private/settings):
// src/proxy.ts redirects them to login, robots.txt (src/app/robots.ts) hides them from search engines
export const PRIVATE_ROUTES: Array<string> = [ROUTES.private];

// public pages that search engines should index, listed in sitemap.xml (src/app/sitemap.ts)
export const PUBLIC_ROUTES: Array<string> = [ROUTES.home];
