import NextLink from 'next/link';

import { render, screen } from '@/__tests__/_utils/render';
import Link from '@/components/ui/Link';

test('should render an anchor with href', () => {
  render(<Link href="/about">About</Link>);

  expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
});

test('should compose styles onto next/link when asChild is set', () => {
  render(
    <Link asChild size="sm" underline="always">
      <NextLink href="/projects">Projects</NextLink>
    </Link>,
  );

  const link = screen.getByRole('link', { name: 'Projects' });

  expect(link).toHaveAttribute('href', '/projects');
  expect(link).toHaveAttribute('data-slot', 'link');
  expect(link.className).toContain('text-sm');
  expect(link.className).toContain('underline');
});
