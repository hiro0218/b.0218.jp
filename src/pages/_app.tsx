import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { ReactElement, ReactNode } from 'react';

import CssBaseline from '@/components/Functional/CssBaseline';
import AppLayout from '@/components/Layouts/AppLayout';
import { AUTHOR_ICON, AUTHOR_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/constant';
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

export default function App({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) {
  // ページレベルで定義されたレイアウトがある場合はそれを使用する
  const getLayout = Component.getLayout || ((page) => page);

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
        <meta content={AUTHOR_ICON} key="og:image" property="og:image" />
        <meta content={SITE_NAME} property="og:site_name" />
        <meta content="ja_JP" property="og:locale" />
        <meta content="1042526022490602" property="fb:app_id" />
        <meta content="summary" key="twitter:card" name="twitter:card" />
        <meta content="@hiro0218" name="twitter:site" />
        <meta content="@hiro0218" name="twitter:creator" />
        <meta content="telephone=no" name="format-detection" />
        <meta content={AUTHOR_NAME} name="author" />
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
}
