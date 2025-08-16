import Script from 'next/script';

type GoogleAdSenseProps = {
  publisherId: string;
};

export function GoogleAdSense({ publisherId }: GoogleAdSenseProps) {
  return (
    <Script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      strategy="afterInteractive"
    />
  );
}
