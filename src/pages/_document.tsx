import createEmotionServer from '@emotion/server/create-instance';
import { RenderPageResult } from 'next/dist/shared/lib/utils';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { Children } from 'react';

import { GOOGLE_ADSENSE } from '@/components/UI/Adsense';
import { AUTHOR, SITE } from '@/constant';
import createEmotionCache from '@/ui/lib/createEmotionCache';

const HTML_PREFIX = {
  home: 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#',
  article: 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#',
};

class MyDocument extends Document<{ ogpPrefix: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> =>
      originalRenderPage({
        // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
        enhanceApp: (App: any) => (props) => <App emotionCache={cache} {...props} />,
      });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map(
      (style) =>
        style.css && (
          <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
            dangerouslySetInnerHTML={{ __html: style.css }}
          />
        ),
    );

    const ogpPrefix = ctx.pathname.startsWith('/[slug]') ? HTML_PREFIX.article : HTML_PREFIX.home;

    return {
      ...initialProps,
      styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags],
      ogpPrefix,
    };
  }

  render() {
    const ogpPrefix = this.props.ogpPrefix;

    return (
      <Html prefix={ogpPrefix} lang="ja">
        <Head>
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          <link rel="dns-prefetch" href="//www.googletagservices.com" />
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
          <link rel="dns-prefetch" href="//platform.twitter.com" />
          <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="alternate" type="application/rss+xml" href={`${SITE.URL}feed.xml`} />
          <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: `{
                "@context": "https://schema.org",
                "@type": "Organization",
                "url": "${SITE.URL}",
                "logo": "${AUTHOR.ICON}"
              }`,
            }}
          ></script>
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE.CLIENT}`}
            crossOrigin="anonymous"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
