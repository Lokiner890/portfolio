import type { Metadata } from 'next';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { logOut } from '@/lib/auth';
import { verifySession } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Private',
  // private pages are never shown in search results
  robots: {
    index: false,
    follow: false,
  },
};

// src/proxy.ts redirects to login early, verifySession() is the check on the server
// (it also makes the page render per request, not at build time)
export default async function PrivatePage() {
  await verifySession();

  return (
    <main data-testid="private-page">
      <h1>Private</h1>
      <form action={logOut}>
        <button type="submit">Log out</button>
      </form>
      <Link href={ROUTES.home}>Home</Link>
    </main>
  );
}
