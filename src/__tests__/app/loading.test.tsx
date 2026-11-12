import { render, screen } from '@/__tests__/_utils/render';
import Loading from '@/app/loading';

test('should render an accessible loader', () => {
  render(<Loading />);

  const loader = screen.getByRole('status');

  expect(loader).toHaveAttribute('aria-live', 'polite');
  expect(loader).toHaveTextContent('Loading...');
});
