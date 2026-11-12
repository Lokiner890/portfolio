import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants/storage';

// The access token from the cookie, or null. For Route Handlers: they answer 401 instead of redirecting.
export const getAccessToken = cache(async () => (await cookies()).get(STORAGE_KEYS.accessToken)?.value || null);

// Data Access Layer: the real auth check, on the server, where private data is read.
// src/proxy.ts only redirects early (optimistic check). Call verifySession() in every private page
// and Server Function that reads or changes private data. Not in a layout: layouts don't render
// again on client-side navigation, so their check can be skipped. Not in a Route Handler: the
// browser's fetch would follow the redirect, use getAccessToken() and answer 401 there.
// `cache` runs it once per request, however many components call it.
// `server-only`: importing this file from a Client Component is a build error.
// https://nextjs.org/docs/app/guides/authentication#creating-a-data-access-layer-dal
export const verifySession = cache(async () => {
  const accessToken = await getAccessToken();

  // Demo: only checks that the cookie exists. Validate the token with the backend here
  // (e.g. `await apiFetch<User>('/me', { accessToken })` from src/lib/api.ts) and return what the pages need.
  if (!accessToken) {
    redirect(ROUTES.login);
  }

  return { accessToken };
});
