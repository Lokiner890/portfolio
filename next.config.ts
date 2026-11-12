import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs/config';

// relative imports: the `@/` alias isn't available in this file
import { getAppUrl } from './src/lib/env';
import { buildSecurityHeaders } from './src/lib/securityHeaders';

// https://nextjs.org/docs/app/api-reference/config/next-config-js
const nextConfig: NextConfig = {
  // self-contained server in .next/standalone (`node server.js`), used by the Dockerfile
  output: 'standalone',
  // React Compiler adds memoization automatically, no manual useMemo / useCallback / memo needed.
  // Not used in tests, see vitest.config.ts.
  reactCompiler: true,
  // type-checks the routes in <Link href>, router.push() and redirect() (types from `next typegen`)
  typedRoutes: true,
  poweredByHeader: false,
  // security headers and the Content Security Policy for every response, see src/lib/securityHeaders.ts
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: buildSecurityHeaders({
          isDev: process.env.NODE_ENV === 'development',
          appUrl: getAppUrl(),
        }),
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // Source maps are not uploaded to Sentry, so no org, project or auth token is needed at build time.
  sourcemaps: {
    disable: true,
  },
  // Browser events go to a route on this site, which forwards them to Sentry: the CSP (`connect-src 'self'`)
  // needs no Sentry domain, and ad blockers don't block them. `true`: a random path, new with every build.
  tunnelRoute: true,
  silent: !process.env.CI,
  telemetry: false,
});
