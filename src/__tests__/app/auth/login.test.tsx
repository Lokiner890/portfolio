import { render, screen } from '@/__tests__/_utils/render';
import LogInPage from '@/app/auth/login/page';
import { ROUTES } from '@/constants/routes';

test('should render the login form', () => {
  render(<LogInPage />);

  expect(screen.getByTestId('login-page')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Log in' })).toHaveAttribute('type', 'submit');
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', ROUTES.home);
});
