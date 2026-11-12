import { setNavigation } from '@/__tests__/_utils/navigation';
import { render, screen } from '@/__tests__/_utils/render';
import NavLink from '@/components/ui/NavLink';
import { ROUTES } from '@/constants/routes';

test('should mark the link as current on its page', () => {
  setNavigation({ pathname: ROUTES.private });

  render(<NavLink href={ROUTES.private}>Private</NavLink>);

  expect(screen.getByRole('link', { name: 'Private' })).toHaveAttribute('aria-current', 'page');
});

test('should not mark the link on another page', () => {
  render(<NavLink href={ROUTES.private}>Private</NavLink>);

  expect(screen.getByRole('link', { name: 'Private' })).toHaveAttribute('aria-current', 'false');
  expect(screen.getByRole('link', { name: 'Private' })).toHaveAttribute('href', ROUTES.private);
});
