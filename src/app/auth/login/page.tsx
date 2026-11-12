import type { Metadata } from 'next';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { logIn } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'LogIn',
};

export default function LogInPage() {
  return (
    <main data-testid="login-page">
      <h1>LogIn</h1>
      <form action={logIn}>
        <button type="submit">Log in</button>
      </form>
      <Link href={ROUTES.home}>Home</Link>
    </main>
  );
}
