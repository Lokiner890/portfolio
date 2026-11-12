import type { MetadataRoute } from 'next';

import { PUBLIC_ROUTES } from '@/constants/routes';
import { getAppUrl } from '@/lib/env';

// /sitemap.xml, generated at build time, lists PUBLIC_ROUTES from src/constants/routes.ts
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map(route => ({
    url: new URL(route, getAppUrl()).toString(),
  }));
}
