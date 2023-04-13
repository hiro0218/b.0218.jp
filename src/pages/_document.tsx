import createEmotionServer from '@emotion/server/create-instance';
import { RenderPageResult } from 'next/dist/shared/lib/utils';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { Children } from 'react';

import { GOOGLE_ADSENSE } from '@/components/UI/Adsense';
import { SITE, URL } from '@/constant';
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
    const emotionStyleTags = emotionStyles.styles.map((style) => {
      return (
        style.css && (
          <style
            dangerouslySetInnerHTML={{ __html: style.css }}
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
          />
        )
      );
    });

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
      <Html lang="ja" prefix={ogpPrefix}>
        <Head>
          {dnsPrefetchHref.map((href, index) => {
            return <link href={href} key={href + index} rel="dns-prefetch" />;
          })}
          <link href="https://googleads.g.doubleclick.net" rel="preconnect" />
          <link href="/favicon.ico" rel="icon" type="image/x-icon" />
          <link href={`${SITE.URL}/feed.xml`} rel="alternate" title="RSSフィード" type="application/rss+xml" />
          <link href={`${SITE.URL}/atom.xml`} rel="alternate" title="Atomフィード" type="application/atom+xml" />
          <link href={`${SITE.URL}/feed.json`} rel="alternate" title="JSONフィード" type="application/json" />
          <link href="/opensearch.xml" rel="search" type="application/opensearchdescription+xml" />
          {Object.entries(URL).map(([key, url]) => {
            return key !== 'SITE' && <link href={url} key={key} rel="me" />;
          })}
          <script
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE.CLIENT}`}
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
