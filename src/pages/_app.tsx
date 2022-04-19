import type { AppProps } from 'next/app';
import Head from 'next/head';

import CssBaseline from '@/components/Functional/CssBaseline';
import { Container } from '@/components/UI/Layout';
import { TheFooter } from '@/components/UI/TheFooter';
import TheHeader from '@/components/UI/TheHeader';
import { AUTHOR, SITE } from '@/constant';
import createEmotionCache from '@/lib/createEmotionCache';
import usePageView from '@/lib/hooks/usePageView';
import { CacheProvider, EmotionCache } from '@/ui/styled';

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const App = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) => {
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

      <CacheProvider value={emotionCache}>
        <CssBaseline />
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
