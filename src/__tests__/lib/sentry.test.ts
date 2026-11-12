import * as Sentry from '@sentry/nextjs';

import { ApiError } from '@/lib/api';
import { beforeSend, initSentry } from '@/lib/sentry';

vi.mock('@sentry/nextjs', () => ({
  init: vi.fn(),
}));

test('should not init Sentry without a DSN', () => {
  vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', '');

  initSentry();

  expect(Sentry.init).not.toHaveBeenCalled();
});

test('should use the deployment environment', () => {
  vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://key@sentry.example.com/1');
  vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'staging');

  initSentry();

  expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({
    dsn: 'https://key@sentry.example.com/1',
    environment: 'staging',
  }));
});

test('should fall back to NODE_ENV when the environment is empty', () => {
  vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://key@sentry.example.com/1');
  // as copied from .env.example: `NEXT_PUBLIC_APP_ENV=`
  vi.stubEnv('NEXT_PUBLIC_APP_ENV', '');
  vi.stubEnv('NODE_ENV', 'production');

  initSentry();

  expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({
    environment: 'production',
    tracesSampleRate: 0.1,
  }));
});

test('should drop expected API responses reported on the server, keep other errors', () => {
  const event = { message: 'error' } as Parameters<typeof beforeSend>[0];

  expect(beforeSend(event, { originalException: new ApiError(404, 'GET /users/1 failed with 404', null) })).toBeNull();
  expect(beforeSend(event, { originalException: new ApiError(502, 'GET /users failed with 502', null) })).toBe(event);
  expect(beforeSend(event, { originalException: new Error('Broken page') })).toBe(event);
  expect(beforeSend(event, {})).toBe(event);
});

test('should filter events with beforeSend', () => {
  vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://key@sentry.example.com/1');

  initSentry();

  expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({ beforeSend }));
});
