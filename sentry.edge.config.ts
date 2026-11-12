// Sentry for the edge runtime (routes with `export const runtime = 'edge'`), loaded from
// src/instrumentation.ts. See src/lib/sentry.ts.
import { initSentry } from '@/lib/sentry';

initSentry();
