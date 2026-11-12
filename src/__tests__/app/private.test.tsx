import { render, screen } from '@/__tests__/_utils/render';
import PrivatePage from '@/app/private/page';
import { ROUTES } from '@/constants/routes';
import { verifySession } from '@/lib/session';

vi.mock('@/lib/session', () => ({
  verifySession: vi.fn(async () => ({ accessToken: 'token' })),
}));

test('should check the session and render with a logout form', async () => {
  // an async Server Component: await it, then render the result
  render(await PrivatePage());

  expect(verifySession).toHaveBeenCalled();
  expect(screen.getByTestId('private-page')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Log out' })).toHaveAttribute('type', 'submit');
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', ROUTES.home);
});
