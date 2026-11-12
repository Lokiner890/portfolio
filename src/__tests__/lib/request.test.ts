// @vitest-environment node
import { NextRequest } from 'next/server';

import { isSameOrigin } from '@/lib/request';

const request = (headers: Record<string, string>) => new NextRequest('http://localhost:3000/api/test', { method: 'POST', headers });

test('should accept a request from the same site', () => {
  expect(isSameOrigin(request({ origin: 'http://localhost:3000', host: 'localhost:3000' }))).toBe(true);
  // behind a CDN / proxy the public host comes in X-Forwarded-Host
  expect(isSameOrigin(request({
    'origin': 'https://example.com',
    'host': 'internal:3000',
    'x-forwarded-host': 'example.com',
  }))).toBe(true);
  // several proxies: the first host is the one the browser used
  expect(isSameOrigin(request({
    'origin': 'https://example.com',
    'host': 'internal:3000',
    'x-forwarded-host': 'example.com, cdn.internal',
  }))).toBe(true);
});

test('should reject a request from another site or without an origin', () => {
  expect(isSameOrigin(request({ origin: 'https://evil.example', host: 'localhost:3000' }))).toBe(false);
  expect(isSameOrigin(request({ host: 'localhost:3000' }))).toBe(false);
  // sandboxed iframes and some redirects send `Origin: null`
  expect(isSameOrigin(request({ origin: 'null', host: 'localhost:3000' }))).toBe(false);
});
