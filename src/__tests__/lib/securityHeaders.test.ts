import { buildContentSecurityPolicy, buildSecurityHeaders, CSP_SOURCES } from '@/lib/securityHeaders';

const production = { isDev: false, appUrl: 'https://example.com' };

const directives = (policy: string) => Object.fromEntries(policy.split('; ').map((directive) => {
  const [name, ...sources] = directive.split(' ');

  return [name, sources];
}));

test('should allow only this site by default', () => {
  const policy = directives(buildContentSecurityPolicy(production));

  expect(policy['default-src']).toEqual(["'self'"]);
  expect(policy['script-src']).toEqual(["'self'", "'unsafe-inline'"]);
  expect(policy['connect-src']).toEqual(["'self'"]);
  expect(policy['img-src']).toEqual(["'self'", 'blob:', 'data:']);
  expect(policy['object-src']).toEqual(["'none'"]);
  expect(policy['frame-ancestors']).toEqual(["'none'"]);
  expect(policy['form-action']).toEqual(["'self'"]);
  expect(policy['base-uri']).toEqual(["'self'"]);
  expect(policy['upgrade-insecure-requests']).toEqual([]);
});

test('should allow eval only in development', () => {
  const policy = directives(buildContentSecurityPolicy({ isDev: true, appUrl: 'http://localhost:3000' }));

  expect(policy['script-src']).toContain("'unsafe-eval'");
});

test('should add https-only rules only for an https site', () => {
  const local = { isDev: false, appUrl: 'http://localhost:3000' };

  expect(directives(buildContentSecurityPolicy(local))).not.toHaveProperty('upgrade-insecure-requests');
  expect(buildSecurityHeaders(local).map(header => header.key)).not.toContain('Strict-Transport-Security');
  expect(buildSecurityHeaders(production)).toContainEqual({
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  });
});

test('should add the origins of third-party services', () => {
  vi.spyOn(CSP_SOURCES, 'script', 'get').mockReturnValue(['https://js.stripe.com']);
  vi.spyOn(CSP_SOURCES, 'frame', 'get').mockReturnValue(['https://js.stripe.com']);

  const policy = directives(buildContentSecurityPolicy(production));

  expect(policy['script-src']).toEqual(["'self'", "'unsafe-inline'", 'https://js.stripe.com']);
  expect(policy['frame-src']).toEqual(["'self'", 'https://js.stripe.com']);
});

test('should send the other security headers', () => {
  const headers = Object.fromEntries(buildSecurityHeaders(production).map(({ key, value }) => [key, value]));

  expect(headers).toMatchObject({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    'X-Frame-Options': 'DENY',
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  });
  expect(headers['Content-Security-Policy']).toBe(buildContentSecurityPolicy(production));
});
