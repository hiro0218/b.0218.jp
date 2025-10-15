import '@/ui/styles/globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import dynamic from 'next/dynamic';
import type { Metadata, Viewport } from 'next/types';
import { Suspense } from 'react';
import { openGraph } from '@/app/_metadata';
import Footer from '@/components/App/Footer';
import Header from '@/components/App/Header';
import { Layout } from '@/components/App/Layout/AppLayout';
import { MainContainer } from '@/components/App/Layout/MainContainer';
import { ClientSideScrollRestorer } from '@/components/Functional/ClientSideScrollRestorer';
import { GoogleAdSense } from '@/components/Functional/GoogleAdSense';
import { PreconnectLinks } from '@/components/Functional/PreconnectLinks';
import { AUTHOR_NAME, GOOGLE_ADSENSE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, URL } from '@/constant';
import { SearchDialogProvider } from '@/contexts/SearchDialogContext';
import { getOrganizationStructured } from '@/lib/json-ld';

const PageScroll = dynamic(() => import('@/components/UI/PageScroll').then((module) => module.PageScroll));

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
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <SearchDialogProvider>
          <Layout>
            <Header />
            <MainContainer>{children}</MainContainer>
            <PageScroll />
            <Footer />
          </Layout>
        </SearchDialogProvider>
        <Suspense>
          <ClientSideScrollRestorer />
        </Suspense>
        <PreconnectLinks />
        {
          /** @see https://developer.mozilla.org/ja/docs/Web/HTML/Attributes/rel/me */
          Object.entries(URL).map(([key, url]) => (
            <link href={url} key={key} rel="me" />
          ))
        }
        <GoogleAdSense publisherId={GOOGLE_ADSENSE.CLIENT} />
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationStructured()),
          }}
          type="application/ld+json"
        />
      </body>
    </html>
  );
}
