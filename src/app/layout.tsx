import '@/ui/styles/globals.css';

import type { Metadata, Viewport } from 'next/types';
import { Suspense } from 'react';
import { openGraph } from '@/app/_metadata';
import { Footer } from '@/components/App/Footer';
import { Header } from '@/components/App/Header';
import { Layout } from '@/components/App/Layout/AppLayout';
import { MainContainer } from '@/components/App/Layout/MainContainer';
import { PageScroll } from '@/components/App/PageScroll/PageScroll';
import { SearchProvider } from '@/components/App/Search/SearchProvider';
import { BrowserEffects } from '@/components/Functional/BrowserEffects';
import { ClientSideScrollRestorer } from '@/components/Functional/ClientSideScrollRestorer';
import { ThirdPartyScripts } from '@/components/Functional/ThirdPartyScripts';
import {
  AUTHOR_NAME,
  DOMAIN,
  MAIN_CONTENT_ID,
  SITE_DESCRIPTION,
  SITE_FEED_PATH,
  SITE_NAME,
  SITE_URL,
  URL,
  WEBMENTION,
} from '@/constants';
import { getFilteredPosts, getPopularPost } from '@/lib/post/list';

// post 全体は渡さず、slug と title だけにする。クライアントへ渡した値は、全ページの RSC payload に載るため
const SEARCH_POPULAR_POST_LIMIT = 5;
const searchPopularPosts = getPopularPost(getFilteredPosts(), SEARCH_POPULAR_POST_LIMIT).map(({ slug, title }) => ({
  slug,
  title,
}));

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
      'application/rss+xml': SITE_FEED_PATH,
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
    other: [
      ...Object.values(URL).map((url) => ({
        rel: 'me',
        url,
      })),
      {
        rel: 'webmention',
        url: WEBMENTION.endpoint,
      },
    ],
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-scroll-behavior="smooth" lang="ja">
      <body>
        <a className="skip-link" href={`#${MAIN_CONTENT_ID}`}>
          メインコンテンツへスキップ
        </a>
        <link href="/opensearch.xml" rel="search" title={DOMAIN} type="application/opensearchdescription+xml" />
        <SearchProvider popularPosts={searchPopularPosts}>
          <Layout>
            <Header />
            <MainContainer>{children}</MainContainer>
            <PageScroll />
            <Footer />
          </Layout>
        </SearchProvider>
        <BrowserEffects />
        <Suspense>
          <ClientSideScrollRestorer />
        </Suspense>
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
