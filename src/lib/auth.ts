'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants/storage';

// Server Functions for the login / logout forms (`<form action={logIn}>`). They run on the server,
// so the access token is stored in an httpOnly cookie that browser JavaScript can't read.
// https://nextjs.org/docs/app/guides/authentication

export async function logIn() {
  // Demo: replace with the real login request and store the token from the backend response
  const accessToken = 'demo-token';
  const cookieStore = await cookies();

  cookieStore.set(STORAGE_KEYS.accessToken, accessToken, {
    httpOnly: true,
    // browsers also accept secure cookies on http://localhost
    secure: true,
    sameSite: 'lax',
    path: '/',
    // without maxAge the cookie ends when the browser closes; set it to the token lifetime, e.g.
    // maxAge: expiresInSeconds,
  });

  redirect(ROUTES.private);
}

export async function logOut() {
  const cookieStore = await cookies();

  cookieStore.delete(STORAGE_KEYS.accessToken);

  redirect(ROUTES.login);
}
