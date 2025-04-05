import '@/styles/globals.css';

import { openGraph } from '@/app/_metadata';
import Footer from '@/components/App/Footer';
import Header from '@/components/App/Header';
import { Layout } from '@/components/App/Layout/AppLayout';
import { MainContainer } from '@/components/App/Layout/MainContainer';
import { GoogleAdSense } from '@/components/Functional/GoogleAdSense';
import { GoogleFontLinks } from '@/components/Functional/GoogleFontLinks';
import { AUTHOR_NAME, GOOGLE_ADSENSE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, URL } from '@/constant';
import { getOrganizationStructured } from '@/lib/json-ld';
import { GoogleAnalytics } from '@next/third-parties/google';
import dynamic from 'next/dynamic';
import type { Metadata, Viewport } from 'next/types';
import { unstable_ViewTransition as ViewTransition } from 'react';

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
        <link href="/favicon.ico" rel="icon" type="image/x-icon" />
        <link href="/opensearch.xml" rel="search" type="application/opensearchdescription+xml" />
        <link href="/feed.xml" rel="alternate" title="RSSフィード" type="application/rss+xml" />
        <GoogleFontLinks />
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
        ></script>
      </head>
      <body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <Layout>
          <Header />
          <ViewTransition name="cross-fade">
            <MainContainer>{children}</MainContainer>
          </ViewTransition>
          <PageScroll />
          <Footer />
        </Layout>
      </body>
    </html>
  );
}
