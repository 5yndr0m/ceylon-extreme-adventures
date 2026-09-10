import type { Metadata } from 'next';
import { Anton, Inter, Dancing_Script } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import SiteChrome from '../components/SiteChrome';
import { DEFAULT_HERO_IMAGE_URL } from '../lib/sanity';

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const dancingScript = Dancing_Script({ weight: '700', subsets: ['latin'], variable: '--font-accent' });

const SITE_TITLE = 'Ceylon Extreme Adventures';
const SITE_DESCRIPTION = 'Chase Freedom, One Adventure at a Time';

export const metadata: Metadata = {
  // Resolves any relative URLs elsewhere in metadata (images, canonical links) into
  // absolute ones — without this Next.js falls back to localhost as the base.
  metadataBase: new URL('https://extremeadventure.lk'),
  title: SITE_TITLE,
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
    <html lang='en' className={`${anton.variable} ${inter.variable} ${dancingScript.variable}`}>
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
