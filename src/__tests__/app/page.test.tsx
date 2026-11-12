import { render, screen } from '@/__tests__/_utils/render';
import HomePage from '@/app/page';
import { ROUTES } from '@/constants/routes';

test('should render', () => {
  render(<HomePage />);

  expect(screen.getByTestId('home-page')).toBeInTheDocument();
});

test('should link to login and the private page', () => {
  render(<HomePage />);

  expect(screen.getByRole('link', { name: 'LogIn' })).toHaveAttribute('href', ROUTES.login);
  expect(screen.getByRole('link', { name: 'Private' })).toHaveAttribute('href', ROUTES.private);
});
