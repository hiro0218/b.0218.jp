import Document, { Html, Head, Main, NextScript } from "next/document";
import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
class SampleDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="dns-prefetch" href="//www.google.co.jp" />
        </Head>
        <body>
          <TheHeader />
          <Main />
          <TheFooter />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default SampleDocument;
