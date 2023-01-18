import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { ReactElement, ReactNode } from 'react';

import CssBaseline from '@/components/Functional/CssBaseline';
import AppLayout from '@/components/Layouts/AppLayout';
import { AUTHOR, SITE } from '@/constant';
import createEmotionCache from '@/ui/lib/createEmotionCache';
import { CacheProvider, EmotionCache, ThemeProvider } from '@/ui/styled';
import { theme } from '@/ui/themes';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type MyAppProps = AppProps & {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
};

const clientSideEmotionCache = createEmotionCache();

const App = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) => {
  // ページレベルで定義されたレイアウトがある場合はそれを使用する
  const getLayout = Component.getLayout || ((page) => page);

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

      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GoogleAnalytics trackPageViews={{ ignoreHashChange: true }} />
          <AppLayout>{getLayout(<Component {...pageProps} />)}</AppLayout>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
};

export default App;
