import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { GOOGLE_ADSENSE } from '@/constants';
import { isProduction } from '@/lib/config/environment';
import { GoogleAdSense } from './GoogleAdSense';

/**
 * @summary 外部サービスのスクリプトと、その接続先への preconnect を 1 か所で読み込む。計測と広告は本番だけ。
 */
export function ThirdPartyScripts() {
  return (
    <>
      {isProduction ? (
        <>
          <link crossOrigin="anonymous" href="https://www.googletagmanager.com" rel="preconnect" />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          {/*
            次の 2 ホストは、接続の有無を測らずに外さない。どちらも読み込むスクリプトの URL にはない。
            gtag.js の本文には、2 ホストとも通信先として載っている。adsbygoogle.js の本文にも、googleads.g.doubleclick.net が載っている。
            実際に接続するかは未確認で、使われている場合に外すと、初回の接続が遅れるため
          */}
          <link crossOrigin="anonymous" href="https://www.google.com" rel="preconnect" />
          <link crossOrigin="anonymous" href="https://googleads.g.doubleclick.net" rel="preconnect" />
          <GoogleAdSense publisherId={GOOGLE_ADSENSE.CLIENT} />
        </>
      ) : null}
      {/* publisher.js を外さない。Page/Post/Share.tsx の google-add-preferred-source-btn の要素を、このスクリプトがボタンに置き換えるため */}
      <Script async src="https://news.google.com/swg/js/v1/publisher.js" />
    </>
  );
}
