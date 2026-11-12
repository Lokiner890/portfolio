// Runs in the browser before the app becomes interactive.
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client
import * as Sentry from '@sentry/nextjs';

import { initSentry } from '@/lib/sentry';

initSentry();

// traces client-side navigations
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
