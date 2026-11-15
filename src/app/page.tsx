import { Header, HeroSection } from '@/components';

export default function HomePage() {
  return (
    <main
      className="bg-[#161616] h-[400vh] w-screen flex flex-col items-center"
      data-testid="home-page"
    >
      <Header />
      <HeroSection />
    </main>
  );
}
