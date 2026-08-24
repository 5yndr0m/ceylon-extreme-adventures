'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPayment = pathname === '/payment';

  return (
    <>
      {!isPayment && <Header />}
      {children}
      {!isPayment && <Footer />}
    </>
  );
}
