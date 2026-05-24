import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import SiteHeader from '@/components/site/site-header';
import { getSiteOrigin } from '@/lib/env';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
});

export const metadata: Metadata = {
  title: 'MindHatch',
  description: 'Semantic resume matching, interview planning, and audit-ready candidate workflows.',
  metadataBase: getSiteOrigin() ? new URL(getSiteOrigin() as string) : undefined,
  icons: '/mindhatch-favicon.svg'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
