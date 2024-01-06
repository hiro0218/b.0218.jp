import type { ScriptProps } from 'next/script';
import Script from 'next/script';

type GoogleAdSenseProps = {
  publisherId: string;
  strategy?: ScriptProps['strategy'];
};

export function GoogleAdSense({ publisherId, strategy = 'afterInteractive' }: GoogleAdSenseProps) {
  return (
    <Script
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      strategy={strategy}
    />
  );
}
