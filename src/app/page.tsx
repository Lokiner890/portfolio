import Link from 'next/link';

import styles from '@/assets/styles/pages/home.module.scss';
import { ROUTES } from '@/constants/routes';

export default function HomePage() {
  return (
    <main className={styles.homePage} data-testid="home-page">
      <h1>Home</h1>
      <Link href={ROUTES.login}>LogIn</Link>
      <Link href={ROUTES.private}>Private</Link>
    </main>
  );
}
