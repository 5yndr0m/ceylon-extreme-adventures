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
  // Experience detail pages render their own fixed "Enquire Now" bar (.bp-mobile-cta)
  // at the same bottom position below 1024px — the global "Book Now" bar would stack
  // on top of it and hide it entirely, so suppress it just on those pages.
  const isExperienceDetail = pathname?.startsWith('/experiences/');

  return (
    <ScrollEffects>
      {!hideChrome && <Header />}
      {children}
      {!hideChrome && <Footer hideStickyCta={isExperienceDetail} />}
    </ScrollEffects>
  );
}
