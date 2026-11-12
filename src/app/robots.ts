import type { MetadataRoute } from 'next';

import { PRIVATE_ROUTES } from '@/constants/routes';
import { getAppUrl, isIndexable } from '@/lib/env';

// /robots.txt, generated at build time
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
export default function robots(): MetadataRoute.Robots {
  // staging, dev, etc. are hidden from search engines
  if (!isIndexable()) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow: PRIVATE_ROUTES },
    sitemap: new URL('/sitemap.xml', getAppUrl()).toString(),
  };
}
