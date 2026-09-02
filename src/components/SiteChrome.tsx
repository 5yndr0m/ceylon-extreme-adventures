'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import ScrollEffects from './ScrollEffects';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPayment = pathname === '/payment';
  const isStudio = pathname?.startsWith('/studio');
  const hideChrome = isPayment || isStudio;

  return (
    <ScrollEffects>
      {!hideChrome && <Header />}
      {children}
      {!hideChrome && <Footer />}
    </ScrollEffects>
  );
}
