import Document, { Head, Html, Main, NextScript } from 'next/document';

class SampleDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html prefix="og: http://ogp.me/ns#" lang="ja">
        <Head>
          <meta name="theme-color" content="#ffffff" />
          <link rel="dns-prefetch" href="//partner.googlesyndication.com" />
          <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
          <link rel="dns-prefetch" href="//www.googletagservices.com" />
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          <link rel="dns-prefetch" href="//adservice.google.com" />
          <link rel="dns-prefetch" href="//adservice.google.co.jp" />
          <link rel="dns-prefetch" href="//platform.twitter.com" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="alternate" type="application/rss+xml" href="https://b.0218.jp/rss.xml" />
          <link rel="alternate" type="application/atom+xml" href="https://b.0218.jp/atom.xml" />
          <link rel="alternate" type="application/json" href="https://b.0218.jp/feed.json" />
          <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default SampleDocument;
