import '@/styles/globals.css';

import { openGraph } from '@/app/metadata';
import Footer from '@/components/App/Footer';
import Header from '@/components/App/Header';
import { GoogleFontLinks } from '@/components/Functional/GoogleFontLinks';
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/constant';
import { Layout } from '@/pages/_layouts/AppLayout';
import { GoogleAnalytics } from '@next/third-parties/google';
import dynamic from 'next/dynamic';
import type { Metadata, Viewport } from 'next/types';

const PageScroll = dynamic(() => import('@/components/UI/PageScroll').then((module) => module.PageScroll));

export const viewport: Viewport = {
  width: 'device-width',
};

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  authors: [
    {
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
  ],
  openGraph: openGraph,
  twitter: {
    card: 'summary',
    site: '@hiro0218',
    creator: '@hiro0218',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <GoogleFontLinks />
      </head>
      <body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <Layout>
          <Header />
          <main>{children}</main>
          <PageScroll />
          <Footer />
        </Layout>
      </body>
    </html>
  );
}
