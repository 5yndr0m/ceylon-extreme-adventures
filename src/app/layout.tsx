import type { Metadata } from 'next';
import { Anton, Inter, Caveat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import SiteChrome from '../components/SiteChrome';

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-accent' });

export const metadata: Metadata = {
  title: 'Ceylon Extreme Adventures',
  description: 'Chase Freedom, One Adventure at a Time',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`${anton.variable} ${inter.variable} ${caveat.variable}`}>
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
