import '@testing-library/jest-dom/vitest';

import { resetNavigation } from '@/__tests__/_utils/navigation';

// `server-only` throws outside the Next.js server build, tests import server modules directly
vi.mock('server-only', () => ({}));

// next/navigation hooks need the Next.js app router, every test gets the mocks from _utils/navigation.ts
vi.mock('next/navigation', async importOriginal => ({
  ...await importOriginal<typeof import('next/navigation')>(),
  ...(await import('@/__tests__/_utils/navigation')).navigationMock,
}));

afterEach(() => {
  resetNavigation();
});
