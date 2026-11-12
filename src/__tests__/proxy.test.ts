// @vitest-environment node
import { getRedirectUrl, unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { NextRequest } from 'next/server';

import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants/storage';
import { config, proxy } from '@/proxy';

const ORIGIN = 'http://localhost:3000';

const request = (pathname: string, accessToken?: string) => {
  const nextRequest = new NextRequest(new URL(pathname, ORIGIN));

  if (typeof accessToken === 'string') {
    nextRequest.cookies.set(STORAGE_KEYS.accessToken, accessToken);
  }

  return nextRequest;
};

test('should redirect to login from a private route without a token', () => {
  expect(getRedirectUrl(proxy(request(ROUTES.private)))).toBe(`${ORIGIN}${ROUTES.login}`);
});

test('should redirect nested private routes and an empty token', () => {
  expect(getRedirectUrl(proxy(request(`${ROUTES.private}/settings`)))).toBe(`${ORIGIN}${ROUTES.login}`);
  expect(getRedirectUrl(proxy(request(ROUTES.private, '')))).toBe(`${ORIGIN}${ROUTES.login}`);
});

test('should open a private route with a token', () => {
  expect(getRedirectUrl(proxy(request(ROUTES.private, 'token')))).toBeNull();
});

test('should open public routes without a token', () => {
  expect(getRedirectUrl(proxy(request(ROUTES.home)))).toBeNull();
  expect(getRedirectUrl(proxy(request(ROUTES.login)))).toBeNull();
  // starts with the private path, but is another route
  expect(getRedirectUrl(proxy(request(`${ROUTES.private}-info`)))).toBeNull();
});

test('should not run for static files', () => {
  expect(unstable_doesMiddlewareMatch({ config, url: ROUTES.private })).toBe(true);
  expect(unstable_doesMiddlewareMatch({ config, url: '/_next/static/chunks/main.js' })).toBe(false);
  expect(unstable_doesMiddlewareMatch({ config, url: '/_next/image?url=%2Flogo.png&w=64&q=75' })).toBe(false);
  expect(unstable_doesMiddlewareMatch({ config, url: '/favicon.ico' })).toBe(false);
});
