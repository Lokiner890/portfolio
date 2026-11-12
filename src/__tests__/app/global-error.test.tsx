import * as Sentry from '@sentry/nextjs';

import { render, screen } from '@/__tests__/_utils/render';
import GlobalError from '@/app/global-error';

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

test('should render its own document with the error page and report the error', () => {
  vi.spyOn(console, 'error').mockImplementation(() => null);
  const error = new Error('Broken root layout');

  // global-error replaces the root layout and renders <html>, which can't be inside the default <div> container
  render(<GlobalError error={error} retry={vi.fn()} />, { container: document as unknown as HTMLElement });

  expect(document.documentElement).toHaveAttribute('lang', 'en');
  expect(document.title).toBe('Something went wrong');
  expect(screen.getByTestId('error-page')).toBeInTheDocument();
  expect(Sentry.captureException).toHaveBeenCalledWith(error);
});
