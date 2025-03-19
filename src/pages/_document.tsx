import type { DocumentContext } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { Children } from 'react';

import { GoogleAdSense } from '@/components/Functional/GoogleAdSense';
import { MetaLinkFeed, MetaLinkRelMe } from '@/components/Functional/MetaLink';
import { GOOGLE_ADSENSE } from '@/constant';

import { GoogleFontLinks } from '@/components/Functional/GoogleFontLinks';

const HTML_PREFIX_BASE = 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#';
const HTML_PREFIX_ARTICLE = `${HTML_PREFIX_BASE} article: http://ogp.me/ns/article#`;

const feeds = [
  { href: '/feed.xml', type: 'application/rss+xml' },
  { href: '/atom.xml', type: 'application/atom+xml' },
  { href: '/feed.json', type: 'application/json' },
];

class MyDocument extends Document<{ ogpPrefix: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const ogpPrefix = ctx.pathname.startsWith('/[slug]') ? HTML_PREFIX_ARTICLE : HTML_PREFIX_BASE;

    return {
      ...initialProps,
      styles: [...Children.toArray(initialProps.styles)],
      ogpPrefix,
    };
  }

  render() {
    return (
      <Html lang="ja" prefix={this.props.ogpPrefix}>
        <Head>
          <link href="/favicon.ico" rel="icon" type="image/x-icon" />
          <link href="/opensearch.xml" rel="search" type="application/opensearchdescription+xml" />
          <GoogleFontLinks />
          <MetaLinkFeed feeds={feeds} />
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
