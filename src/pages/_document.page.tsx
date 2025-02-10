import createEmotionServer from '@emotion/server/create-instance';
import type { RenderPageResult } from 'next/dist/shared/lib/utils';
import type { DocumentContext } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { Children } from 'react';

import { GoogleAdSense } from '@/components/Functional/GoogleAdSense';
import { MetaLinkFeed, MetaLinkRelMe } from '@/components/Functional/MetaLink';
import { GOOGLE_ADSENSE } from '@/constant';
import createEmotionCache from '@/ui/lib/createEmotionCache';
import { processedCss } from '@/ui/lib/processedCss';

const HTML_PREFIX_BASE = 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#';
const HTML_PREFIX_ARTICLE = `${HTML_PREFIX_BASE} article: http://ogp.me/ns/article#`;

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
        // biome-ignore lint/suspicious/noExplicitAny:
        enhanceApp: (App: any) => (props) => <App emotionCache={cache} {...props} />,
      });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map(({ css, key, ids }) => {
      const style = processedCss(css);
      return (
        style && (
          <style
            dangerouslySetInnerHTML={{
              __html: `@layer emotion { ${style} }`,
            }}
            data-emotion={`${key} ${ids.join(' ')}`}
            key={key}
          />
        )
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
          <link href="/favicon.ico" rel="icon" type="image/x-icon" />
          <MetaLinkFeed feeds={feeds} />
          <link href="/opensearch.xml" rel="search" type="application/opensearchdescription+xml" />
          <MetaLinkRelMe />
          <GoogleAdSense publisherId={GOOGLE_ADSENSE.CLIENT} />
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
