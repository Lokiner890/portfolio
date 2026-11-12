import Link from 'next/link';

import { ROUTES } from '@/constants/routes';

// unknown URLs and `notFound()` calls, responds with 404
// https://nextjs.org/docs/app/api-reference/file-conventions/not-found
export default function NotFound() {
  return (
    <main data-testid="not-found-page">
      <h1>Page not found</h1>
      <Link href={ROUTES.home}>Go home</Link>
    </main>
  );
}
