import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import SiteChrome from '../components/SiteChrome';
import { DEFAULT_HERO_IMAGE_URL } from '../lib/sanity';

// Self-hosted brand fonts supplied by the client (CEA Fonts pack), replacing the earlier
// placeholder Google Fonts (Anton/Inter) that were never part of the approved brand kit.
const north = localFont({ src: './fonts/North.otf', weight: '400', variable: '--font-display', display: 'swap' });
const lato = localFont({
  src: [
    { path: './fonts/Lato-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/Lato-Bold.ttf', weight: '700', style: 'normal' },
    { path: './fonts/Lato-Black.ttf', weight: '900', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
});

const SITE_TITLE = 'Ceylon Extreme Adventures';
const SITE_DESCRIPTION = 'Chase Freedom, One Adventure at a Time';

export const metadata: Metadata = {
  // Resolves any relative URLs elsewhere in metadata (images, canonical links) into
  // absolute ones — without this Next.js falls back to localhost as the base.
  metadataBase: new URL('https://extremeadventure.lk'),
  title: { default: SITE_TITLE, template: `%s | ${SITE_TITLE}` },
  description: SITE_DESCRIPTION,
  // Default social-share preview (WhatsApp, Facebook, Slack, iMessage, etc). Individual
  // pages can override `openGraph`/`twitter` with their own image (e.g. an experience's
  // heroImage) — this is just the site-wide fallback so nothing shares with a blank card.
  openGraph: {
    type: 'website',
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: '/',
    images: [{ url: DEFAULT_HERO_IMAGE_URL, width: 1280, height: 720, alt: SITE_TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_HERO_IMAGE_URL],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`${north.variable} ${lato.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
        {/* Both are no-ops locally/in preview unless the Vercel project has Analytics
            and Speed Insights enabled in its dashboard settings — safe to ship always on. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
