import { getAppEnv, getAppUrl, isIndexable } from '@/lib/env';

test('should use the env values', () => {
  vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'staging');
  vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://staging.example.com');

  expect(getAppEnv()).toBe('staging');
  expect(getAppUrl()).toBe('https://staging.example.com');
});

test('should fall back when the values are empty, as copied from .env.example', () => {
  vi.stubEnv('NEXT_PUBLIC_APP_ENV', '');
  vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
  vi.stubEnv('NODE_ENV', 'production');

  expect(getAppEnv()).toBe('production');
  expect(getAppUrl()).toBe('http://localhost:3000');
});

test('should index only the production environment', () => {
  vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'production');
  expect(isIndexable()).toBe(true);

  vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'staging');
  expect(isIndexable()).toBe(false);

  // a production build without NEXT_PUBLIC_APP_ENV (e.g. a forgotten staging value) is not indexed
  vi.stubEnv('NEXT_PUBLIC_APP_ENV', '');
  vi.stubEnv('NODE_ENV', 'production');
  expect(isIndexable()).toBe(false);
});
