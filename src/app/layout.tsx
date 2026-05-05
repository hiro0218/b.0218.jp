import '@/ui/styles/globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next/types';
import { Suspense } from 'react';
import { openGraph } from '@/app/_metadata';
import { Footer } from '@/components/App/Footer';
import { Header } from '@/components/App/Header';
import { Layout } from '@/components/App/Layout/AppLayout';
import { MainContainer } from '@/components/App/Layout/MainContainer';
import { PageScroll } from '@/components/App/PageScroll/PageScroll';
import { SearchDialogProvider } from '@/components/App/SearchDialogContext';
import { BrowserEffects } from '@/components/Functional/BrowserEffects';
import { ClientSideScrollRestorer } from '@/components/Functional/ClientSideScrollRestorer';
import { GoogleAdSense } from '@/components/Functional/GoogleAdSense';
import { PreconnectLinks } from '@/components/Functional/PreconnectLinks';
import { AUTHOR_NAME, GOOGLE_ADSENSE, MAIN_CONTENT_ID, SITE_DESCRIPTION, SITE_NAME, SITE_URL, URL } from '@/constants';
import { isProduction } from '@/lib/config/environment';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
    apple: '/icon.png',
    other: Object.values(URL).map((url) => ({
      rel: 'me',
      url,
    })),
  },
  other: {
    search: '/opensearch.xml',
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-scroll-behavior="smooth" lang="ja">
      <body>
        <a className="skip-link" href={`#${MAIN_CONTENT_ID}`}>
          メインコンテンツへスキップ
        </a>
        {isProduction ? <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} /> : null}
        <SearchDialogProvider>
          <Layout>
            <Header />
            <MainContainer>{children}</MainContainer>
            <PageScroll />
            <Footer />
          </Layout>
        </SearchDialogProvider>
        <BrowserEffects />
        <Suspense>
          <ClientSideScrollRestorer />
        </Suspense>
        {isProduction ? <PreconnectLinks /> : null}
        {isProduction ? <GoogleAdSense publisherId={GOOGLE_ADSENSE.CLIENT} /> : null}
      </body>
    </html>
  );
}
