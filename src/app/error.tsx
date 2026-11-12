'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { ROUTES } from '@/constants/routes';
import { reportError } from '@/lib/reportError';

export interface ErrorPageProps {
  error: Error & { digest?: string };
  // re-fetches and re-renders the failed route segment
  retry: () => void;
}

// Error boundary for the pages, the root layout stays rendered.
// https://nextjs.org/docs/app/api-reference/file-conventions/error
export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <main data-testid="error-page">
      <h1>Oops!</h1>
      <p role="alert">Something went wrong</p>
      <button type="button" onClick={retry}>Try again</button>
      <Link href={ROUTES.home}>Go home</Link>
    </main>
  );
}
