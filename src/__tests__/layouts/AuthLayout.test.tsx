import { setNavigation } from '@/__tests__/_utils/navigation';
import { render, screen } from '@/__tests__/_utils/render';
import { ROUTES } from '@/constants/routes';
import AuthLayout from '@/layouts/AuthLayout';

test('should render the page inside the layout', () => {
  render(
    <AuthLayout>
      <h1>LogIn</h1>
    </AuthLayout>,
  );

  expect(screen.getByTestId('auth-layout')).toContainElement(screen.getByRole('heading', { name: 'LogIn' }));
});

test('should mark the link of the current page', () => {
  setNavigation({ pathname: ROUTES.login });

  render(
    <AuthLayout>
      <h1>LogIn</h1>
    </AuthLayout>,
  );

  expect(screen.getByRole('link', { name: 'LogIn' })).toHaveAttribute('aria-current', 'page');
});
