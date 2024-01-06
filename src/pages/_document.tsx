import createEmotionServer from '@emotion/server/create-instance';
import type { RenderPageResult } from 'next/dist/shared/lib/utils';
import type { DocumentContext } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { Children } from 'react';

import { GoogleAdSense } from '@/components/Functional/GoogleAdSense';
import { MetaLinkDnsPrefetch, MetaLinkFeed, MetaLinkRelMe } from '@/components/Functional/MetaLink';
import { GOOGLE_ADSENSE } from '@/constant';
import { processedCss } from '@/lib/processedCss';
import createEmotionCache from '@/ui/lib/createEmotionCache';

const HTML_PREFIX_BASE = 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#';
const HTML_PREFIX_ARTICLE = `${HTML_PREFIX_BASE} article: http://ogp.me/ns/article#`;

const prefetchDomains = [
  '//www.google-analytics.com',
  '//www.googletagservices.com',
  '//www.googletagmanager.com',
  '//platform.twitter.com',
  '//polyfill.io',
];
const feeds = [
  { href: '/feed.xml', type: 'application/rss+xml' },
  { href: '/atom.xml', type: 'application/atom+xml' },
  { href: '/feed.json', type: 'application/json' },
];

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
    const emotionStyleTags = emotionStyles.styles.map(({ css, key, ids }) => {
      return (
        <style
          dangerouslySetInnerHTML={{ __html: processedCss(css) }}
          data-emotion={`${key} ${ids.join(' ')}`}
          key={key}
        />
      );
    });

    const ogpPrefix = ctx.pathname.startsWith('/[slug]') ? HTML_PREFIX_ARTICLE : HTML_PREFIX_BASE;

    return {
      ...initialProps,
      styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags],
      ogpPrefix,
    };
  }

  render() {
    return (
      <Html lang="ja" prefix={this.props.ogpPrefix}>
        <Head>
          <MetaLinkDnsPrefetch domains={prefetchDomains} />
          <link href="https://googleads.g.doubleclick.net" rel="preconnect" />
          <link crossOrigin="anonymous" href="https://polyfill.io" rel="preconnect" />
          <link href="/favicon.ico" rel="icon" type="image/x-icon" />
          <MetaLinkFeed feeds={feeds} />
          <link href="/opensearch.xml" rel="search" type="application/opensearchdescription+xml" />
          <MetaLinkRelMe />
          <GoogleAdSense publisherId={GOOGLE_ADSENSE.CLIENT} />
          <script crossOrigin="anonymous" defer src="https://polyfill.io/v3/polyfill.min.js" />
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
