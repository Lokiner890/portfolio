import type { ReadonlyURLSearchParams, useRouter } from 'next/navigation';

// Mocks of the next/navigation hooks, registered for every test in src/__tests__/setup.ts
// and reset after each test. Usage:
//   setNavigation({ pathname: '/users/1', searchParams: 'tab=info', params: { id: '1' } });
//   expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.login);

export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
} satisfies Partial<ReturnType<typeof useRouter>>;

type Params = Record<string, string | Array<string>>;

const initialState = () => ({
  pathname: '/',
  searchParams: new URLSearchParams(),
  params: {} as Params,
});

let state = initialState();

export function setNavigation({
  pathname = state.pathname,
  searchParams = state.searchParams.toString(),
  params = state.params,
}: { pathname?: string; searchParams?: string; params?: Params }) {
  state = { pathname, searchParams: new URLSearchParams(searchParams), params };
}

export function resetNavigation() {
  state = initialState();
  Object.values(mockRouter).forEach(mock => mock.mockReset());
}

// vi.fn, so tests can also check the calls, e.g. expect(navigationMock.useRouter).toHaveBeenCalled()
export const navigationMock = {
  useRouter: vi.fn(() => mockRouter),
  usePathname: vi.fn(() => state.pathname),
  useSearchParams: vi.fn(() => state.searchParams as ReadonlyURLSearchParams),
  useParams: vi.fn(() => state.params),
};
