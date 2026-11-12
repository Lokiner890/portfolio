import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants/storage';
import { logIn, logOut } from '@/lib/auth';

const cookieStore = {
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => cookieStore),
}));

// the real redirect() throws to stop rendering, here only the target is checked
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

test('should store the access token in an httpOnly cookie and open the private page', async () => {
  await logIn();

  expect(cookies).toHaveBeenCalled();
  expect(cookieStore.set).toHaveBeenCalledWith(STORAGE_KEYS.accessToken, expect.any(String), expect.objectContaining({
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  }));
  expect(redirect).toHaveBeenCalledWith(ROUTES.private);
});

test('should delete the access token and open the login page', async () => {
  await logOut();

  expect(cookieStore.delete).toHaveBeenCalledWith(STORAGE_KEYS.accessToken);
  expect(redirect).toHaveBeenCalledWith(ROUTES.login);
});
