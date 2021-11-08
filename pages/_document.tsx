import { extractCritical } from '@emotion/server';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

import { GOOGLE_ADSENSE } from '@/components/Adsense';
import { GA_TRACKING_ID } from '@/lib/gtag';

class SampleDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const styles = extractCritical(initialProps.html);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style data-emotion={`css ${styles.ids.join(' ')}`} dangerouslySetInnerHTML={{ __html: styles.css }} />
        </>
      ),
    };
  }

  render() {
    return (
      <Html prefix="og: http://ogp.me/ns#" lang="ja">
        <Head>
          <meta httpEquiv="x-dns-prefetch-control" content="on" />
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          <link rel="dns-prefetch" href="//www.googletagservices.com" />
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
          <link rel="dns-prefetch" href="//platform.twitter.com" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="alternate" type="application/rss+xml" href="https://b.0218.jp/feed.xml" />
          <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" />
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE.CLIENT}`}
            crossOrigin="anonymous"
          ></script>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
            }}
          />
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
