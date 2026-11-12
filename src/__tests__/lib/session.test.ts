import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants/storage';
import { getAccessToken, verifySession } from '@/lib/session';

const cookieStore = {
  get: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => cookieStore),
}));

// throws like the real redirect(), so the code after it doesn't run
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

test('should return the access token from the cookie', async () => {
  cookieStore.get.mockReturnValue({ value: 'token' });

  await expect(verifySession()).resolves.toEqual({ accessToken: 'token' });
  expect(cookies).toHaveBeenCalled();
  expect(cookieStore.get).toHaveBeenCalledWith(STORAGE_KEYS.accessToken);
  expect(redirect).not.toHaveBeenCalled();
});

test('should redirect to login without the access token', async () => {
  // no cookie
  cookieStore.get.mockReturnValue(null);

  await expect(verifySession()).rejects.toThrow('NEXT_REDIRECT');
  expect(redirect).toHaveBeenCalledWith(ROUTES.login);
});

test('should return null for Route Handlers instead of redirecting', async () => {
  cookieStore.get.mockReturnValue({ value: '' });

  await expect(getAccessToken()).resolves.toBeNull();
  expect(redirect).not.toHaveBeenCalled();
});
