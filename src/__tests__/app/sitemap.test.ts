import sitemap from '@/app/sitemap';

test('should list the public pages with absolute URLs', () => {
  vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://example.com');

  expect(sitemap()).toEqual([{ url: 'https://example.com/' }]);
});
