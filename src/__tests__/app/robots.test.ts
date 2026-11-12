import robots from '@/app/robots';
import { PRIVATE_ROUTES, ROUTES } from '@/constants/routes';

test('should allow indexing in production, except private routes', () => {
  vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'production');
  vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://example.com');

  expect(robots()).toEqual({
    // the same list src/proxy.ts protects
    rules: { userAgent: '*', allow: '/', disallow: PRIVATE_ROUTES },
    sitemap: 'https://example.com/sitemap.xml',
  });
  expect(PRIVATE_ROUTES).toContain(ROUTES.private);
});

test('should block indexing in other environments', () => {
  vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'staging');

  expect(robots()).toEqual({
    rules: { userAgent: '*', disallow: '/' },
  });
});
