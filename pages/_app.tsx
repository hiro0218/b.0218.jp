import '../styles/index.css';

import { CacheProvider } from '@emotion/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { CSSReset } from '@/components/CSSReset';
import { Container } from '@/components/layout/Container';
import { TheFooter } from '@/components/TheFooter';
import TheHeader from '@/components/TheHeader';
import { AUTHOR, SITE } from '@/constant';
import createEmotionCache from '@/lib/createEmotionCache';
import usePageView from '@/lib/hooks/usePageView';

const App = ({ Component, pageProps }: AppProps) => {
  const clientSideEmotionCache = createEmotionCache();
  usePageView();

  return (
    <>
      <Head>
        <title key="title">{SITE.NAME}</title>
        <meta name="viewport" content="width=device-width" />
        <meta key="description" name="description" content={SITE.DESCRIPTION} />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:url" property="og:url" content={SITE.URL} />
        <meta key="og:title" property="og:title" content={SITE.NAME} />
        <meta key="og:description" property="og:description" content={SITE.DESCRIPTION} />
        <meta key="og:image" property="og:image" content={AUTHOR.ICON} />
        <meta property="og:site_name" content={SITE.NAME} />
        <meta property="og:locale" content="ja_JP" />
        <meta property="fb:app_id" content="1042526022490602" />
        <meta key="og:site_name" name="og:site_name" property="og:site_name" content={SITE.NAME} />
        <meta key="twitter:card" name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@hiro0218" />
        <meta name="twitter:creator" content="@hiro0218" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="author" content={AUTHOR.NAME} />
      </Head>

      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <CacheProvider value={clientSideEmotionCache}>
        <CSSReset />
        <TheHeader />
        <main>
          <Container>
            <Component {...pageProps} />
          </Container>
        </main>
        <TheFooter />
      </CacheProvider>
    </>
  );
};

export default App;
