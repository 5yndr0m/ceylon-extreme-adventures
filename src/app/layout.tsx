import type { Metadata } from 'next';
import { Anton, Inter, Caveat } from 'next/font/google';
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
      </body>
    </html>
  );
}
