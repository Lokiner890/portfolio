// Runs once when a Next.js server instance starts.
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

// reports errors from Server Components, route handlers, Server Functions and src/proxy.ts
export const onRequestError = Sentry.captureRequestError;
