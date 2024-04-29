import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import type { ReactElement, ReactNode } from 'react';

import Footer from '@/components/App/Footer';
import Header from '@/components/App/Header';
import { AUTHOR_NAME, SCREEN_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/constant';
import debounce from '@/lib/debounce';
import observeScrollbarWidth from '@/lib/observeScrollbarWidth';
import smoothScroll from '@/lib/smoothScroll';
import createEmotionCache from '@/ui/lib/createEmotionCache';
import type { EmotionCache } from '@/ui/styled';
import CssBaseline from '@/ui/styled/CssBaseline';
import { StyledProvider } from '@/ui/styled/Provider';

import { Layout } from './_layouts/AppLayout';

const PageScroll = dynamic(() => import('@/components/UI/PageScroll').then((module) => module.PageScroll));

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type MyAppProps = AppProps & {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
};

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => smoothScroll());
  window.addEventListener('load', observeScrollbarWidth);
  window.addEventListener('resize', debounce(observeScrollbarWidth));
}

const clientSideEmotionCache = createEmotionCache();

export default function App({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) {
  // ページレベルで定義されたレイアウトがある場合はそれを使用する
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title key="title">{SITE_NAME}</title>
        <meta content="width=device-width" name="viewport" />
        <meta content={SITE_DESCRIPTION} key="description" name="description" />
        <meta content="website" key="og:type" property="og:type" />
        <meta content={SITE_URL} key="og:url" property="og:url" />
        <meta content={SITE_NAME} key="og:title" property="og:title" />
        <meta content={SITE_DESCRIPTION} key="og:description" property="og:description" />
        <meta content={SCREEN_IMAGE} key="og:image" property="og:image" />
        <meta content={SITE_NAME} property="og:site_name" />
        <meta content="ja_JP" property="og:locale" />
        <meta content="summary" key="twitter:card" name="twitter:card" />
        <meta content="@hiro0218" name="twitter:site" />
        <meta content="@hiro0218" name="twitter:creator" />
        <meta content="telephone=no" name="format-detection" />
        <meta content={AUTHOR_NAME} name="author" />
      </Head>

      <CssBaseline />

      <StyledProvider emotionCache={emotionCache}>
        <GoogleAnalytics trackPageViews={{ ignoreHashChange: true }} />
        <Layout>
          <Header />
          <main>{getLayout(<Component {...pageProps} />)}</main>
          <PageScroll />
          <Footer />
        </Layout>
      </StyledProvider>
    </>
  );
}
