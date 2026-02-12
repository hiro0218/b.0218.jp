import Script from 'next/script';

type GoogleAdSenseProps = {
  publisherId: string;
};

export function GoogleAdSense({ publisherId }: GoogleAdSenseProps) {
  return (
    <>
      <Script
        async
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        strategy="afterInteractive"
      />
      <Script
        src="https://fundingchoicesmessages.google.com/i/pub-7651142413133023?ers=1"
        strategy="afterInteractive"
      />
      <Script id="googlefc-present" strategy="afterInteractive">{`(function() {
        function signalGooglefcPresent() {
          if (!window.frames['googlefcPresent']) {
            if (document.body) {
              const iframe = document.createElement('iframe');
              iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
              iframe.style.display = 'none';
              iframe.name = 'googlefcPresent';
              document.body.appendChild(iframe);
            } else {
              setTimeout(signalGooglefcPresent, 0);
            }
          }
        }
        signalGooglefcPresent();
      })()`}</Script>
    </>
  );
}
