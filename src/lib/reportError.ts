import * as Sentry from '@sentry/nextjs';

// An error with a 4xx `status` (e.g. thrown by the API client for a 404 or 401 response) is an
// expected app state, not a bug. Next.js `notFound()`, `redirect()`, `forbidden()` and
// `unauthorized()` don't reach error boundaries at all, Next.js handles them itself.
// Also used by `beforeSend` in src/lib/sentry.ts for the errors reported on the server.
export const isExpectedResponse = (error: unknown) => {
  const status = (error as { status?: unknown } | null)?.status;

  return typeof status === 'number' && status >= 400 && status < 500;
};

// An error with a `digest` was thrown on the server (Server Component, Server Function), it is
// already reported there by `onRequestError` in src/instrumentation.ts, with the real message and
// stack. The browser only gets a generic message, reporting it again would duplicate the event.
const isServerError = (error: unknown) => Boolean((error as { digest?: unknown } | null)?.digest);

// Error boundaries (src/app/error.tsx, src/app/global-error.tsx) catch rendering errors in the
// browser, so they never reach Sentry's global handlers: report them here.
export function reportError(error: unknown) {
  if (isExpectedResponse(error) || isServerError(error)) {
    return;
  }

  Sentry.captureException(error);
  console.error(error);
}
