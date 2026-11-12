'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface NavLinkProps {
  href: Route;
  children: ReactNode;
}

// next/link that marks the link of the current page with aria-current="page",
// style the active link with the `[aria-current='page']` selector
function NavLink({ href, children }: Readonly<NavLinkProps>) {
  const isActive = usePathname() === href;

  return (
    <Link href={href} aria-current={isActive ? 'page' : false}>
      {children}
    </Link>
  );
}

export default NavLink;
