import '@/ui/styles/globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next/types';
import { Suspense } from 'react';
import { openGraph } from '@/app/_metadata';
import Footer from '@/components/App/Footer';
import Header from '@/components/App/Header';
import { SearchDialogProvider } from '@/components/App/Header/SearchDialogContext';
import { Layout } from '@/components/App/Layout/AppLayout';
import { MainContainer } from '@/components/App/Layout/MainContainer';
import { ClientSideScrollRestorer } from '@/components/Functional/ClientSideScrollRestorer';
import { GoogleAdSense } from '@/components/Functional/GoogleAdSense';
import { ClientPageScroll } from '@/components/Functional/PageScroll/ClientPageScroll';
import { PreconnectLinks } from '@/components/Functional/PreconnectLinks';
import { AUTHOR_NAME, GOOGLE_ADSENSE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, URL } from '@/constants';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [
    {
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
  ],
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: openGraph,
  twitter: {
    card: 'summary',
    site: '@hiro0218',
    creator: '@hiro0218',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    search: '/opensearch.xml',
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <a className="skip-link" href="#main">
          メインコンテンツへスキップ
        </a>
        {process.env.NODE_ENV === 'production' && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />}
        <SearchDialogProvider>
          <Layout>
            <Header />
            <MainContainer>{children}</MainContainer>
            <ClientPageScroll />
            <Footer />
          </Layout>
        </SearchDialogProvider>
        <Suspense>
          <ClientSideScrollRestorer />
        </Suspense>
        {process.env.NODE_ENV === 'production' && <PreconnectLinks />}
        {
          /**
           * rel="me" links for identity verification (Mastodon, IndieAuth, etc.)
           * Note: Ideally should be in <head>, but Next.js App Router metadata API
           * doesn't support custom <link> elements. HTML5 allows <link> in <body>
           * and browsers will process them correctly.
           * @see https://developer.mozilla.org/ja/docs/Web/HTML/Attributes/rel/me
           */
          Object.entries(URL).map(([key, url]) => (
            <link href={url} key={key} rel="me" />
          ))
        }
        {process.env.NODE_ENV === 'production' && <GoogleAdSense publisherId={GOOGLE_ADSENSE.CLIENT} />}
      </body>
    </html>
  );
}
