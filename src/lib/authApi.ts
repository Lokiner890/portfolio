import 'server-only';

import { redirect } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { ApiError, apiFetch, type ApiFetchOptions } from '@/lib/api';
import { verifySession } from '@/lib/session';

// apiFetch with the access token of the current user, for Server Components and Server Functions.
// Client Components get private data through them (the token cookie is httpOnly).
//
//   const user = await authApiFetch<User>('/me');
//
// Not for Route Handlers: it redirects to login, and the browser's fetch follows the redirect and gets
// the login page HTML with status 200. A Route Handler answers 401 instead, like src/app/api/[...path]:
//   const accessToken = await getAccessToken();
//   if (!accessToken) return Response.json({ message: 'Unauthorized' }, { status: 401 });
//   const user = await apiFetch<User>('/me', { accessToken });
export async function authApiFetch<T = unknown>(path: string, options: Omit<ApiFetchOptions, 'accessToken'> = {}) {
  const { accessToken } = await verifySession();

  try {
    return await apiFetch<T>(path, { ...options, accessToken });
  }
  catch (error) {
    // the backend rejected the token (expired, revoked): log in again
    if (error instanceof ApiError && error.status === 401) {
      redirect(ROUTES.login);
    }

    throw error;
  }
}
