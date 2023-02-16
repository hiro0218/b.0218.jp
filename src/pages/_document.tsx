import createEmotionServer from '@emotion/server/create-instance';
import { RenderPageResult } from 'next/dist/shared/lib/utils';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { Children } from 'react';

import { GOOGLE_ADSENSE } from '@/components/UI/Adsense';
import { AUTHOR, SITE, URL } from '@/constant';
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
    const dnsPrefetchHref = [
      '//www.google-analytics.com',
      '//www.googletagservices.com',
      '//www.googletagmanager.com',
      '//platform.twitter.com',
    ];

    return (
      <Html prefix={ogpPrefix} lang="ja">
        <Head>
          {dnsPrefetchHref.map((href, index) => {
            return <link key={href + index} rel="dns-prefetch" href={href} />;
          })}
          <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="alternate" type="application/rss+xml" href={`${SITE.URL}feed.xml`} />
          <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" />
          {Object.entries(URL).map(([key, url]) => {
            return key !== 'SITE' && <link key={key} rel="me" href={url} />;
          })}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                url: SITE.URL,
                logo: AUTHOR.ICON,
              }),
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
