'use client';

import ErrorPage, { type ErrorPageProps } from './error';

// Errors in the root layout: replaces it, so it renders its own <html> and <body>
// (without the global styles). Reports the error through ErrorPage.
// `metadata` exports don't work in error pages (Client Components), React's <title> sets the tab title.
// https://nextjs.org/docs/app/api-reference/file-conventions/error#global-error
export default function GlobalError(props: ErrorPageProps) {
  return (
    <html lang="en">
      <body>
        <title>Something went wrong</title>
        <ErrorPage {...props} />
      </body>
    </html>
  );
}
