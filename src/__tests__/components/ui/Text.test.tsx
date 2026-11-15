import { render, screen } from '@/__tests__/_utils/render';
import Text from '@/components/ui/Text';

test('should render as a paragraph by default', () => {
  render(<Text>Hello</Text>);

  expect(screen.getByText('Hello').tagName).toBe('P');
});

test('should render as the requested element', () => {
  render(<Text as="span">Label</Text>);

  expect(screen.getByText('Label').tagName).toBe('SPAN');
});

test('should merge styles onto the child when asChild is set', () => {
  render(
    <Text asChild size="lg" weight="bold">
      <h2>Title</h2>
    </Text>,
  );

  const title = screen.getByRole('heading', { name: 'Title', level: 2 });

  expect(title).toHaveAttribute('data-slot', 'text');
  expect(title.className).toContain('text-lg');
  expect(title.className).toContain('font-bold');
});
