import { render, screen } from '@/__tests__/_utils/render';
import NotFound from '@/app/not-found';
import { ROUTES } from '@/constants/routes';

test('should render a link home', () => {
  render(<NotFound />);

  expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', ROUTES.home);
});
