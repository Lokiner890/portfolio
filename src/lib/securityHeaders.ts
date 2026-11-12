// Security headers for every response, added in next.config.ts `headers()`.
// The Content Security Policy is static (the same for every page and user), so pages stay prerendered
// and cacheable. It allows 'unsafe-inline' scripts because Next.js adds inline scripts to every page;
// a stricter nonce-based policy needs every page rendered per request, see README.md "Security headers".
// https://nextjs.org/docs/app/guides/content-security-policy

// Origins of third-party services, added to the matching CSP directive. For example Stripe:
//   script: ['https://js.stripe.com'], connect: ['https://api.stripe.com'], frame: ['https://js.stripe.com']
export const CSP_SOURCES: Record<'script' | 'style' | 'img' | 'font' | 'connect' | 'frame', Array<string>> = {
  script: [],
  style: [],
  // e.g. the CDN / S3 bucket with user uploads
  img: [],
  font: [],
  // the browser calls the backend through /api (src/app/api/[...path]), Sentry through its tunnel route
  connect: [],
  frame: [],
};

interface SecurityHeadersOptions {
  // `next dev`: React needs eval for its error overlay and server error stacks
  isDev: boolean;
  // NEXT_PUBLIC_APP_URL: https-only rules are added only for an https site, so http://localhost keeps working
  appUrl: string;
}

export function buildContentSecurityPolicy({ isDev, appUrl }: SecurityHeadersOptions) {
  const directives: Record<string, Array<string>> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : []), ...CSP_SOURCES.script],
    // next/font and inline style attributes
    'style-src': ["'self'", "'unsafe-inline'", ...CSP_SOURCES.style],
    // blob: and data: for previews of selected files and next/image blur placeholders
    'img-src': ["'self'", 'blob:', 'data:', ...CSP_SOURCES.img],
    // next/font serves the fonts from this site
    'font-src': ["'self'", ...CSP_SOURCES.font],
    'connect-src': ["'self'", ...CSP_SOURCES.connect],
    'frame-src': ["'self'", ...CSP_SOURCES.frame],
    // no plugins (Flash, Java)
    'object-src': ["'none'"],
    // an injected <base href> can't redirect relative URLs
    'base-uri': ["'self'"],
    // forms can only be sent to this site
    'form-action': ["'self'"],
    // this site can't be embedded in a frame (clickjacking)
    'frame-ancestors': ["'none'"],
  };

  if (appUrl.startsWith('https://')) {
    // http:// resources are requested over https
    directives['upgrade-insecure-requests'] = [];
  }

  return Object.entries(directives)
    .map(([directive, sources]) => [directive, ...sources].join(' '))
    .join('; ');
}

export function buildSecurityHeaders(options: SecurityHeadersOptions) {
  return [
    { key: 'Content-Security-Policy', value: buildContentSecurityPolicy(options) },
    // browsers use only https for this site for two years (they ignore it over http)
    ...(options.appUrl.startsWith('https://') ?
      [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }] :
      []),
    // the browser doesn't guess the file type (e.g. run an uploaded file as a script)
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    // other sites see only the domain, not full URLs with ids or tokens
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    // browser features the app doesn't use, allow them here when it does
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
    // frame-ancestors for older browsers
    { key: 'X-Frame-Options', value: 'DENY' },
    // pages this one opens can't control it; `-allow-popups` keeps OAuth login popups (Google, Facebook) working
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  ];
}
