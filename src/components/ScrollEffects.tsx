'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollEffects({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const revealSelector = 'main > section:not(.hero), main > .page-hero, .page-hero';
    const parallaxSelector = '.hero-bg img, .page-hero-bg img, [data-parallax]';
    let frame = 0;

    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));
    revealTargets.forEach((target) => target.classList.add('scroll-reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach((target) => revealObserver.observe(target));

    const parallaxTargets = Array.from(document.querySelectorAll<HTMLElement>(parallaxSelector));
    const updateParallax = () => {
      frame = 0;
      if (reduceMotion.matches) return;

      const viewportCenter = window.innerHeight / 2;
      parallaxTargets.forEach((target) => {
        const bounds = target.parentElement?.getBoundingClientRect() ?? target.getBoundingClientRect();
        const speed = Number(target.dataset.parallax ?? (target.closest('.page-hero-bg') ? 0.12 : 0.08));
        const offset = (bounds.top + bounds.height / 2 - viewportCenter) * speed;
        target.style.setProperty('--parallax-offset', `${offset.toFixed(2)}px`);
      });
    };

    const requestParallaxUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    window.addEventListener('resize', requestParallaxUpdate);
    reduceMotion.addEventListener('change', requestParallaxUpdate);
    requestParallaxUpdate();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestParallaxUpdate);
      window.removeEventListener('resize', requestParallaxUpdate);
      reduceMotion.removeEventListener('change', requestParallaxUpdate);
      revealObserver.disconnect();
    };
  }, [pathname]);

  return <>{children}</>;
}