// Sentry error tracking, shared by the browser (src/instrumentation-client.ts), Node.js
// (sentry.server.config.ts) and edge (sentry.edge.config.ts) setup: '@sentry/nextjs' resolves
// to the SDK of the runtime the file is bundled for.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs';

import { getAppEnv } from '@/lib/env';
import { isExpectedResponse } from '@/lib/reportError';

// An ApiError 4xx thrown in a Server Component (e.g. a 404 from authApiFetch) reaches Sentry through
// `onRequestError` in src/instrumentation.ts, not through the error pages: drop it here, on every runtime.
export const beforeSend: NonNullable<Sentry.BrowserOptions['beforeSend']> = (event, hint) => (
  isExpectedResponse(hint.originalException) ? null : event
);

export function initSentry() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  // enabled only when a DSN is set, so local development and tests send nothing
  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: getAppEnv(),
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
    beforeSend,
  });
}
