import type { ReactNode } from 'react';

import NavLink from '@/components/ui/NavLink';
import { ROUTES } from '@/constants/routes';

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
  return (
    <div data-testid="auth-layout">
      <nav aria-label="Authentication">
        <NavLink href={ROUTES.login}>LogIn</NavLink>
      </nav>
      {children}
    </div>
  );
}

export default AuthLayout;
