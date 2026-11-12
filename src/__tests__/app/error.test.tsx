import * as Sentry from '@sentry/nextjs';

import { render, screen, userEvent } from '@/__tests__/_utils/render';
import ErrorPage from '@/app/error';
import { ROUTES } from '@/constants/routes';
import { ApiError } from '@/lib/api';

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => null);
});

test('should render the error page and report the error', () => {
  const error = new Error('Broken page');

  render(<ErrorPage error={error} retry={vi.fn()} />);

  expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', ROUTES.home);
  expect(Sentry.captureException).toHaveBeenCalledWith(error);
  expect(console.error).toHaveBeenCalledWith(error);
});

test('should not report expected API responses like 404', () => {
  const error = new ApiError(404, 'GET /users/1 failed with 404', null);

  render(<ErrorPage error={error} retry={vi.fn()} />);

  expect(screen.getByTestId('error-page')).toBeInTheDocument();
  expect(Sentry.captureException).not.toHaveBeenCalled();
});

test('should report server errors with a 5xx status', () => {
  const error = new ApiError(502, 'GET /users failed with 502', null);

  render(<ErrorPage error={error} retry={vi.fn()} />);

  expect(Sentry.captureException).toHaveBeenCalledWith(error);
});

test('should not report server errors again, onRequestError reports them on the server', () => {
  // in the browser a Server Component error only has a generic message and the digest
  const error = Object.assign(new Error('An error occurred in the Server Components render'), { digest: '2468' });

  render(<ErrorPage error={error} retry={vi.fn()} />);

  expect(screen.getByTestId('error-page')).toBeInTheDocument();
  expect(Sentry.captureException).not.toHaveBeenCalled();
});

test('should retry the failed route', async () => {
  const retry = vi.fn();

  render(<ErrorPage error={new Error('Broken page')} retry={retry} />);
  await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

  expect(retry).toHaveBeenCalledTimes(1);
});
