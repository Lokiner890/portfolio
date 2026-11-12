import { redirect } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { ApiError, apiFetch } from '@/lib/api';
import { authApiFetch } from '@/lib/authApi';

vi.mock('@/lib/session', () => ({
  verifySession: vi.fn(async () => ({ accessToken: 'token' })),
}));

vi.mock('@/lib/api', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/api')>(),
  apiFetch: vi.fn(),
}));

// throws like the real redirect(), so the code after it doesn't run
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

test('should send the request with the access token of the session', async () => {
  vi.mocked(apiFetch).mockResolvedValue({ id: 1 });

  await expect(authApiFetch('/me', { method: 'GET' })).resolves.toEqual({ id: 1 });
  expect(apiFetch).toHaveBeenCalledWith('/me', { method: 'GET', accessToken: 'token' });
});

test('should redirect to login when the backend rejects the token', async () => {
  vi.mocked(apiFetch).mockRejectedValue(new ApiError(401, 'GET /me failed with 401', null));

  await expect(authApiFetch('/me')).rejects.toThrow('NEXT_REDIRECT');
  expect(redirect).toHaveBeenCalledWith(ROUTES.login);
});

test('should rethrow other errors', async () => {
  const error = new ApiError(500, 'GET /me failed with 500', null);

  vi.mocked(apiFetch).mockRejectedValue(error);

  await expect(authApiFetch('/me')).rejects.toBe(error);
  expect(redirect).not.toHaveBeenCalled();
});
